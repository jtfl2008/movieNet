var Movie = require('./../models/movie')
var Comment = require('./../models/comment')
var Category = require('./../models/category')
var _ = require('underscore')
var fs = require('fs')
var path = require('path')

exports.detail = function(req, res, next) {
  var id = req.params.id;
  Movie.update({_id:id},{$inc:{pv:1}},function(err){
      console.log(err)
  })
  Movie.findById(id,function(err,movie){
    Comment
      .find({movie:id})
      .populate('from','name')
      .populate('reply.from reply.to','name')
      .exec(function(err,comments){
        console.log(comments)
        res.render('pages/movie/detail', { 
          title: 'movie '+ movie.title ,
          movie: movie,
          comments:comments
        })
      })
  })
}

exports.list = function(req, res, next) {
  Movie.fetch(function(err,movies){
    if(err){
        console.log(err)
    }
    res.render('pages/movie/list', { 
      title: 'movie 列表页' ,
      movies: movies
    });
  })
}

exports.new = function(req, res, next) {
  Category.find({},function(err,categories){
    console.log(categories)
    res.render('pages/movie/admin', { 
      title: 'movie 后台录入页', 
      movie: {},
      categories: categories
    });
  })
}

exports.savePoster = function(req,res,next){
  var posterData = req.files.uploadPoster
  var filePath = posterData.path
  var originalFilename = posterData.originalFilename
  if(originalFilename){
    fs.readFile(filePath,function(err,data){
      var timestamp = Date.now()
      var type = posterData.type.split('/')[1]
      var poster = timestamp+'.'+type
      var newPath = path.join(__dirname,'../','/public/upload/'+poster)
      fs.writeFile(newPath,data,function(err){
        req.poster = poster
        next()
      })
    })
  }else{
    next()
  }
}

exports.save = function(req,res){
  var id = req.body.movie._id
  var movieObj = req.body.movie
  var _movie,categoryId,categoryName
  if(req.poster){
    movieObj.poster = req.poster
  }
  if(id){
    Movie.findById(id,function(err,movie){
      if(err){
        console.log(err)
      }

      _movie = _.extend(movie,movieObj)
      _movie.save(function(err,movie){
        if(err){
          console.log(err)
        }
        res.redirect('/detail/'+movie._id)
      })
    })
  }else{
    _movie = new Movie(movieObj)
    categoryId = _movie.category
    categoryName = movieObj.categoryName
    _movie.save(function(err,movie){
      if(err){
        console.log(err)
      }
      if(categoryId){
        Category.findById(categoryId,function(err,category){
          category.movies.push(movie._id)
          category.save(function(err,category){
            res.redirect('/detail/'+movie._id)
          })
        })
      }else if(categoryName){
        var category = new Category({
          name:categoryName,
          movies:[movie._id]
        })
        category.save(function(err,category){
          movie.category = category._id
          movie.save(function(err,movie){
            res.redirect('/detail/'+movie._id)
          })
        })
      }
    })
  }
}

exports.update = function(req, res, next) {
  var id = req.params.id;
  Movie.findById(id,function(err,movie){
    if(err){
      console.log(err)
    }
    console.log(movie)
    Category.find({},function(err,categories){
      res.render('pages/movie/admin', { 
        title: 'movie 更新页' ,
        movie: movie,
        categories: categories
      })
    })
  })
}

exports.del = function(req,res){
  var id = req.params.id;
  console.log(id)
  if(id){
    Movie.remove({_id:id},function(err,movie){
      if(err){
        console.log(err)
      }else{
        res.json({success:1})
      }
    })
  }
}