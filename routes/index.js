var express = require('express');
var router = express.Router();
var Movie = require('../controls/movie')
var Index = require('../controls/index')
var User = require('../controls/user')
var Comment = require('../controls/comment')
var Category = require('../controls/category')

/* GET home page. */
router.get('/', Index.index);

//signup
router.post('/user/signup',User.signup)

//signin
router.post('/user/signin',User.signin)

//show signup
router.get('/user/showsignup',User.showsignup)

//show signin
router.get('/user/showsignin',User.showsignin)

//loginout
router.get('/loginout',User.loginout)

//GET user list
router.get('/admin/user/list',User.signinRequired,User.adminRequired,User.list)

//user list delete
router.delete('/admin/user/list/:id',User.signinRequired,User.adminRequired, User.del)

//GET user update
router.get('/admin/user/update/:name',User.signinRequired,User.adminRequired,User.update)

//POST user update
router.post('/admin/user/update/',User.signinRequired,User.adminRequired,User.save)

/* GET detail page. */
router.get('/detail/:id', Movie.detail);

/* GET list page. */
router.get('/admin/movie/list', User.signinRequired,User.adminRequired,Movie.list);

/* GET admin page. */
router.get('/admin/movie/new', User.signinRequired,User.adminRequired,Movie.new);

//admi page submit
router.post('/admin/movie/new',User.signinRequired,User.adminRequired,Movie.savePoster, Movie.save);

//admin update page
router.get('/admin/movie/update/:id',User.signinRequired,User.adminRequired, Movie.update);

//movie list delete
router.delete('/admin/movie/list/:id',User.signinRequired,User.adminRequired, Movie.del)

//comment submit
router.post('/user/comment',User.signinRequired, Comment.save);

//category admin page
router.get('/admin/category',User.signinRequired, User.adminRequired, Category.new);

//category admin post page
router.post('/admin/category/new',User.signinRequired, User.adminRequired, Category.save);

//category list page
router.get('/admin/category/list',User.signinRequired, User.adminRequired, Category.list);

//get results
router.get('/results', Index.search);

module.exports = router;
