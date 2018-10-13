/**
 * api 接口路由 v1
 * by chuckchen 2018.10.13
 */

var express = require('express');
var router = express.Router();


var articleController = require('../api/v1/article')   //文章

/* 文章 */
router.get('/articlelist', articleController.show); //列表
router.post('/article/create', articleController.create); //创建

module.exports = router;