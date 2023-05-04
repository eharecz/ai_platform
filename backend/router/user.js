// 第三方模块引入
const express = require('express');
const router = express.Router();

const userModel = require('../model/user');

// 用户注册
router.post('/register', function(request, response) {
  var params = request.body;
  // var userId = userModel.addUser(params.username, params.password, 'admin', params.email, params.phone);
  var userId = userModel.addUser(params.username, params.password, 'normal', params.email, params.phone);

  if(userId == 0) {
    response.json({code: 1, message: '输入格式不正确或账户已存在！请重新检测注册信息'});
    return ;
  }

  response.json({code: 0, userId: userId, message: '注册成功！请进行登录！'});
});

// 用户登录
router.post('/login', function(request, response) {
  var params = request.body;
  var userInfo = userModel.getUser(userModel.getUserId(params.username));

  if(userInfo == undefined) {
    response.json({code: 1, message: '登录失败！请检查用户名是否存在!'});
    return ;
  }

  if(userInfo.password != params.password) {
    response.json({code: 2, message: '登录失败！请检查密码是否正确!'});
    return ;
  }

  response.cookie('userId', userInfo.userId, {maxAge: 1000*60*60*3});
  response.cookie('username', userInfo.username, {maxAge: 1000*60*60*3});
  response.json({code: 0, message: '登录成功！'});
});

// 添加用户，不同于注册用户
router.post('/addUser', function(request, response) {
  var params = request.body;
  var userId = userModel.addUser(params.username, params.password, params.role, params.email, params.phone);

  if(userId == 0) {
    response.json({result: false});
  }

  response.json({result: true});
});

// 删除用户，返回布尔值
router.post('/removeUser', function(request, response) {
  var params = request.body;
  var result = userModel.removeUser(params.userId);

  response.json({result: result});
});

// 更新用户信息，不改动内容可略
router.post('/updateUser', function(request, response) {
  var params = request.body;
  var result = userModel.updateUser(params.userId, params.username, params.password, params.role, params.email, params.phone);

  response.json({result: result});
});

// 获取用户信息
router.get('/getUser', function(request, response) {
  var cookies = request.cookies;
  var result = userModel.getUser(cookies.userId);

  response.json(result);
});

// 获取所有用户信息
router.get('/getAllUser', function(request, response) {
  var result = userModel.getAllUser();

  response.json(result);
});

// 基于用户名取用户Id
router.get('/getUserId', function(request, response) {
  var params = request.body;
  var userId = userModel.getUserId(params.username);

  response.json({userId: userId});
});

module.exports = router;
