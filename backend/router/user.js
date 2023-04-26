const express = require('express');
const router = express.Router();

const userModel = require('../model/user');

// 用户注册
router.post('/register', function(request, response) {
  var params = request.body;
  // var userId = userModel.addUser(params.username, params.password, 'admin', params.email, params.phone);
  var userId = userModel.addUser(params.username, params.password, 'normal', params.email, params.phone);
  response.send(userId);
});

// 用户登录
router.post('/login', function(request, response) {
  var params = request.body;
  var userInfo = userModel.getUser(userModel.getUserId(params.username));

  if(userInfo == undefined) response.json({code: 1, response: '登录失败！请检查用户名是否存在!'});
  if(userInfo.password != params.password) response.json({code: 2, response: '登录失败！请检查密码是否正确!'});

  response.cookie('userId', userInfo.userId, {maxAge: 1000*60*60*3});
  response.json({code: 0, response: '登录成功！'});
});

module.exports = router;
