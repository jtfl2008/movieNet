var Category = require('./../models/category')

exports.new = function(req, res, next){
    res.render('pages/category/admin', { 
        title: 'category 后台录入页', 
        category: {}
    });
}

exports.save = function(req, res, next){
    var categoryObj = req.body.category
    var _category = new Category(categoryObj)
    _category.save(function(err,category){
        if(err){
          console.log(err)
        }

        res.redirect('/admin/category/list')
    })
}

exports.list = function(req, res, next){
    Category.fetch(function(err,categories){
        if(err){
            console.log(err)
        }
        res.render('pages/category/list', { 
          title: 'category 列表页' ,
          categories: categories
        });
    })
}