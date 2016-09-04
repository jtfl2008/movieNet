var Category = require('./../models/category')
var Movie = require('./../models/movie')

exports.index = function(req, res, next) {
  Category
    .find({})
    .populate({path:'movies',options:{limit:6}})
    .exec(function(err,categories){
        if(err){
            console.log(err)
        }
        console.log(categories[1].movies[1])
        res.render('pages/movie/index', { 
          title: 'movie 首页' ,
          categories: categories
        });
    }) 
}

exports.search = function(req, res, next) {
  var catId = req.query.cat
  var page = parseInt(req.query.p,10) || 0
  var q = req.query.q
  var count = 2
  var index = page * count
  if(catId){
    Category
      .find({_id:catId})
      .populate({path:'movies',select:'title poster'})
      .exec(function(err,categories){
          if(err){
              console.log(err)
          }
          var category = categories[0] || {}
          var movies = category.movies || []
          var results = movies.slice(index,index+count)
          res.render('pages/movie/result', { 
            title: 'movie 结果列表页' ,
            totalPage: Math.ceil(movies.length/2),
            currentPage: (page+1),
            keyword: category.name,
            query: 'cat='+catId,
            movies: results
          });
      })
  }else{
    Movie
      .find({title:new RegExp(q+'.*','i')})
      .exec(function(err,movies){
        if(err){
              console.log(err)
          }
          var results = movies.slice(index,index+count)
          res.render('pages/movie/result', { 
            title: 'movie 结果列表页' ,
            totalPage: Math.ceil(movies.length/2),
            currentPage: (page+1),
            keyword: q,
            query: 'q='+q,
            movies: results
          });
      })
  }
}