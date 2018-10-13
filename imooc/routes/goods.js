var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require('../models/goods');

var db = mongoose.connect("mongodb://localhost:27017/imooc",{ useNewUrlParser: true });
console.log(db);
mongoose.connection.on("error", function (error) {
	console.log("数据库连接失败：" + error);
});

mongoose.connection.on("open", function () {
	console.log("------数据库连接成功！------");
});
//商品列表
router.get('/',function(req,res,next){
	Goods.find({},function(err,doc){
		if(err){
			res.json({
				status:'1',
				message:err.message
			})
		}else{
			res.json({
				status:'0',
				message:'success',
				result:{
					count:doc.length,
					list:doc
				}
			})
		}
	});
})

module.exports = router
