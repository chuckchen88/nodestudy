var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//获取商品接口
/*router.get('/goods', function(req, res, next) {
  	var goodsData = require('../mock/goods.json');
  	//=====跨域问题=========//
	res.header("Access-Control-Allow-Origin","*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With,Origin,Content-Type,Accept");  
	res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS"); 

  	res.json(goodsData);
});*/

module.exports = router;
