var User = require('./../models/user')
var _ = require('underscore')

exports.signup = function(req,res,next){
  var _user = req.body.user;
  
  User.findOne({name:_user.name},function(err,user){
    if(err){
        console.log(err)
    }
    if(user){
        res.redirect('/user/showsignin')
    }else{
      var user = new User(_user);
      user.save(function(err,user){
        if(err){
          console.log(err)
        }
        res.redirect('/');
      })
    }
  })
  
}

exports.signin = function(req,res,next){
    var user = req.body.user
    var name = user.name
    var password = user.password

    User.findOne({name:name},function(err,user){
      if(err){
        console.log(err)
      }

      if(!user){
        return res.redirect('/user/showsignup')
      }

      user.comparePassword(password,function(err,isMatch){
        if(err){
            console.log(err)
        }
        if(isMatch){
            req.session.user = user
            return res.redirect('/')
        }else{
            console.log('Password is not Matched')
        }
      })
    })
}

exports.showsignup = function(req,res,next){
    res.render('pages/user/signup', { 
      title: 'user 注册页'
    })
}

exports.showsignin = function(req,res,next){
    res.render('pages/user/signin', { 
      title: 'user 登录页'
    })
}

exports.loginout = function(req,res){
    delete req.session.user

    res.redirect('/')
}

exports.list = function(req,res,next){
  User.fetch(function(err,users){
    if(err){
        console.log(err)
    }
    res.render('pages/user/list', { 
      title: 'user 列表页' ,
      users: users
    });
  })
}

exports.update = function(req,res,next){
    var name = req.params.name

    if(name){
        User.findOne({name:name},function(err,user){
            if(err){
                console.log(err)
            }

            res.render('pages/user/user',{
                title: 'user 修改页',
                user: user
            })
        })
    }
}

exports.save = function(req,res,next){
  var userObj = req.body.user
  console.log(userObj)
  var password = userObj.password
  var id = userObj._id
  var _user
  User.findById(id,function(err,user){
      if(err){
        console.log(err)
      }

      user.comparePassword(password,function(err,isMatch){
        if(err){
            console.log(err)
        }
        if(isMatch){
            _user = _.extend(user,userObj)
            _user.save(function(err,user){
              if(err){
                console.log(err)
              }
              res.redirect('/admin/user/list')
            })
        }else{
            console.log('密码错误，请重新输入！')
            res.redirect('/admin/user/update/'+userObj.name)
        }
      })
    })
}

exports.signinRequired = function(req,res,next){
    var user = req.session.user

    if(!user){
        res.redirect('/user/showsignin')
    }

    next()
}

exports.adminRequired = function(req,res,next){
    var user = req.session.user

    if(user.role <= 10){
        res.redirect('/user/showsignin')
    }

    next()
}

exports.del = function(req,res){
  var user = req.session.user
  var id = req.params.id;
  if(id){
    if(user._id === id){
      return
    }
    User.remove({_id:id},function(err,user){
      if(err){
        console.log(err)
      }else{
        res.json({success:1})
      }
    })
  }
}