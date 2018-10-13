var express = require('express');
var crypto = require('crypto');
var router = express.Router();
var mongoose = require('mongoose');
var LeaveWords = require('../models/leave-words');///加载留言模块
var User = require('../models/user');///加载用户模块
var PostArticle = require('../models/postArticle');///加载文章模块
var Comment = require('../models/comment');///加载文章模块
var PostAna = require('../models/postAna');///加载文章模块
var jquery = require('jquery');
var uuid = require('node-uuid');

///////emitter.setMaxListeners(15);


/* GET home page. */

function checkLogin(req, res, next){
	if(!req.session.user){
		res.redirect('/login');
	}
	next();
}
function checkNotLogin(req, res, next){
	if(req.session.user){
		res.redirect('back')
	}
	next();
}

function replace_em(str){
	str = str.replace(/\</g,'&lt;');
	str = str.replace(/\>/g,'&gt;');
	str = str.replace(/\n/g,'<br/>');
	str = str.replace(/\[em_([0-9]*)\]/g,'<img src="/images/face/$1.gif" border="0" />');
	return str;
}

router.get('/', function(req, res, next) {
  res.render('index',{
  	user: req.session.user
  });
});

/* GET about page. */
router.get('/about', function(req, res, next) {
  res.render('about',{
  	user: req.session.user
  });
});

/* GET about page. */
router.get('/works', function(req, res, next) {
  res.render('works',{
  	user: req.session.user
  });
});


//获取当前页
router.get('/blog-article/:page', function(req, res, next) {
	var page = req.params.page;
	var topFive = [];
	PostArticle.getTopFive(null, function(err, top_articles){
		if(err){
			top_articles = [];
		}
		topFive = top_articles;
		
		PostArticle.getSix(null, page, function(err, articles, total){
			if(err){
				articles = [];
			}
			res.render('blog-article',{
			  	user: req.session.user,
			  	articles : articles,
			  	total:total,
			  	page: parseInt(page),
			  	topFive: topFive
			});
		})
	})
	
	/**/
});

/* GET blog page. */
router.get('/blog-ana', function(req, res, next) {
	var topFive = [];
	PostArticle.getTopFive(null, function(err, top_articles){
		if(err){
			top_articles = [];
		}
		topFive = top_articles;
		PostAna.readTen( null, 1, function(err, anas){
			if(err){
				anas = [];
			}
			res.render('blog-ana',{
				anas : anas,
				user: req.session.user,
				topFive: topFive,
				page: 1
			});
		})
	})
});  

//ajax获取数据
router.get('/blog-ana/:page', function(req, res, next) {
	PostAna.readTen( null, req.query.page, function(err, anas){
		if(err){
			anas = [];
		}
		console.log(anas);
		res.send(anas);
	})
});
/* GET blog page. */
router.post('/blog-ana', function(req, res, next) {
	var postAna = new PostAna(req.session.user.name, req.body.picUrl, req.body.anas);
	
	postAna.save(function(err){
		if(err){
			return res.redirect('/blog-ana');
		}
		res.redirect('/blog-ana');
	})
});
/* GET blog page. */
router.get('/blog-ana/remove/:id', function(req, res, next) {
	var _id = mongoose.Types.ObjectId(req.params.id);   //转化成对象
	PostAna.remove(_id, function(err){
		if(err){
			return res.redirect('back');
		}
		console.log(req.params.id);
		res.redirect('back');
	})
});
/* GET about page. */
router.get('/resume', function(req, res, next) {
  res.render('resume',{
  	user: req.session.user
  });
});
/* GET about page. */
router.get('/leave-words', function(req, res, next) {
 	LeaveWords.readTen( null,1, function(err, users){
		if(err){
			users = [];
		}
		var messages=[];
		for(var i=0;i< users.length;i++){
			messages.push(replace_em(users[i].message));
			users[i].message = messages[i];
		}
		res.render('leave-words',{
			users : users,
			user: req.session.user
		});
	})
});


router.post('/leave-words', function(req, res, next){
	var leaveWords = new LeaveWords(req.body.name, req.body.messages);
	
	leaveWords.save(function(err){
		if(err){
			return res.redirect('/leave-words');
		}
		res.redirect('/leave-words');
	})
})

//chuck发表文章
router.post('/blog-article',function(req, res, next){
	var content = req.body.content;
	var thum = content.substr(0,200)+'...';
	var title = req.body.title;
	var thumTitle = title.substr(0,20)+'...';
	var user = req.session.user,
		picUrl= req.body.picUrl,
		postArticle = new PostArticle('chuck', picUrl, thum, thumTitle, req.body.title, content);
	postArticle.save(function(err){
		if(err){
			return res.redirect('/');
		}
		res.redirect('/blog-article/1');
	})
})



router.get('/leave-words/:page', function(req, res, next) {
 	var page = req.query.page;
 	LeaveWords.readTen( null, page, function(err, users){
		if(err){
			users = [];
		}
		res.send(users)
	})
});

/* GET login page. */
router.get('/login', checkNotLogin);
router.get('/login', function(req, res, next) {
  res.render('login',{
  	user: req.session.user,
  	err: 'correct',
  	status:''
  });
});

router.post('/login', checkNotLogin);
router.post('/login', function(req, res, next) {
	var md5 = crypto.createHash('md5'),
		password = md5.update(req.body.password).digest('hex');

	User.get(req.body.name, function(err, user){

		if(!user){
			//用户不存在
			return res.render('login',{
				err: 'err',
				user: null,
				status: '用户不存在'
			});
		}

		if(user.password != password){
			//密码错误
			return res.render('login',{
				err: 'err',
				user: null,
				status: '密码错误'
			});
		}
		var thumName;
		if(user.name.length>6){
			thumName = user.name.substr(0,5)+'...';
		}else{
			thumName = user.name;
		}
		user.thumName = thumName;
		req.session.user = user;
		//登录成功
		
		res.redirect('/');
	})
});

/* GET logout page. */
router.get('/logout', function(req, res, next) {
 	req.session.user = null;
 	res.redirect('/');
});
/* GET reg page. */
router.get('/reg', checkNotLogin);
router.get('/reg', function(req, res, next) {
  res.render('reg', {
  	err : 'correct',
  	errInfo:'',
  	user: req.session.user
  });
});

/* 注册 */
router.post('/reg', checkNotLogin);
router.post('/reg', function(req, res, next) {
	var name = req.body.name,
		headImgNum = parseInt(30*Math.random()),  //0-30的随机整数
		password = req.body.password,
		password_re = req.body['pasword-repeat'];
	if(password_re != password){
		return res.render('reg', {
			err : 'err',
			errInfo: '两次密码输入不一致',
			user: req.session.user
		});
	}
	var md5 = crypto.createHash('md5'),
		password = md5.update(req.body.password).digest('hex');
	var newUser = new User({
		name: req.body.name,
		password: password,
		email:req.body.email,
		headImgNum : headImgNum
	});
	User.get(newUser.name, function(err, user){

		if(err){
			return res.redirect('/');
		}
		if(user){
			return res.render('reg',{
				err: 'err',
				errInfo: '用户名已存在',
				user: req.session.user
			})
		}
		newUser.save(function(err, user){
			
			if(err){
				return res.redirect('/reg');
				
			}
			var thumName;
			if(user.name.length>6){
				thumName = user.name.substr(0,5)+'...';
			}else{
				thumName = user.name;
			}
			user.thumName = thumName;
			req.session.user = user;
			res.redirect('/');
			
		})
	})
});




/* GET article-details page. */
router.get('/blog-article/:page/:id', function(req, res, next) {
	var _id = mongoose.Types.ObjectId(req.params.id);   //转化成对象
	var topFive = [];
	PostArticle.getTopFive(null, function(err, top_articles){
		if(err){
			top_articles = [];
		}
		topFive = top_articles;
		PostArticle.getOne(_id , function(err, article){
			if(err){
				return res.redirect('back')
			}
			var contents=[];
			for(var i=0;i< article.comments.length;i++){
				contents.push(replace_em(article.comments[i].content));
				article.comments[i].content = contents[i];
			}
		
		    res.render('blog-article-details',{
		    	user: req.session.user,
		    	article: article,
		    	topFive: topFive,
		    	page: 1
		    });
		})
	})
});

router.get('/changeHeadImg/:headNum',function(req, res, next){
	User.updateHeadImg(req.session.user.name, req.params.headNum, function(err){
		if(err){
			return res.redirect('back');
		}
		//Comment.updateHeadImg(null, req.session.user.name, req.params.headNum, function(err){
			//if(err){
			//	return res.redirect('back');
			//}
			req.session.user.headImgNum = req.params.headNum;
			res.redirect('back');
		//})
	})
})



router.post('/blog-article/:page/:id',function(req, res, next){     ///用户发表文章的评论
	var _id = mongoose.Types.ObjectId(req.params.id); 
	var date = new Date(),
		time = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate() + " " + date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
	var Uid = uuid.v1();
	var comment = {
		name: req.session.user.name,
		email:req.session.user.email,
		time: time,
		content: req.body.comments,
		uuid: Uid,
		headImgNum : req.session.user.headImgNum
	};
	var newComment = new Comment(_id, comment);
	newComment.save(function(err){
		if(err){
			return res.redirect('back');//失败
		}
		res.redirect('back');//成功
	})
	
})
//用户删除文章评论
router.get('/blog-article-details-comment/remove/:id/:uuid', function(req, res, next){
	var _id = mongoose.Types.ObjectId(req.params.id); 

	PostArticle.removeComment(_id, req.params.uuid, function(err){
		if(err){
			return res.redirect('back');
		}
		res.redirect('back');
	})
})
//管理员编辑文章
router.get('/blog-article/page/edit/:id', function(req, res, next){

	var _id = mongoose.Types.ObjectId(req.params.id); 
	PostArticle.edit(_id, function(err, oldArticle){
		if(err){
			return res.redirect('back');
		}
		res.send(oldArticle);
	})
})
router.post('/blog-article/page/edit/:id', function(req, res, next){
	var _id = mongoose.Types.ObjectId(req.params.id); 
	var content = req.body.content;
	var thum = content.substr(0,200)+'...';
	var title = req.body.title;
	var thumTitle = title.substr(0,20)+'...';

	PostArticle.update(_id, thum, thumTitle, req.body.title, req.body.picUrl, req.body.content, function(err){
		if(err){
			return res.redirect('back');
		}
		res.redirect('back');
	})
})

router.get('/remove/:id', function(req, res, next){

	var _id = mongoose.Types.ObjectId(req.params.id); 
	PostArticle.remove(_id, function(err){
		if(err){
			return res.redirect('back');
		}
		res.redirect('/blog-article/1');
	})
})


//加载更多文章的评论
router.get('/add-more-comments/:id/:n',function(req, res, next){

	var _id = mongoose.Types.ObjectId(req.params.id); 
	Comment.readFive(_id, req.params.n, function(err, comments){
		if(err){
			return res.redirect('back');
		}
		res.send(comments);
		console.log(comments);
	})
})


//图片上传
router.post('/blog-article/uploadPic', checkLogin)
router.post('/blog-article/uploadPic', function(req, res){
	console.log(req.body)
	res.redirect('back')
})


module.exports = router;
