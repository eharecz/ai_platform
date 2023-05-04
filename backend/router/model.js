// 库模块引入
const path = require('path');

// 第三方模块引入
const express = require('express');
const multer = require('multer');
const admZip = require('adm-zip');
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const modelModel = require('../model/model');
const docker = require('../controller/docker');

// 添加训练模型，authName、description可略，返回自增modelId，失败返回0
router.post('/addModel', upload.fields([{ name: 'file' }, { name: 'model' }]), function(request, response) {
  var file = request.files['file'][0];
  var model = JSON.parse(request.body.model);
  var modelPath = 'model_storage/' + path.parse(file.originalname).name + '/';
  var modelId = modelModel.addModel(model.modelName, modelPath, model.modelType, model.authName, model.description);
  var zip = new admZip(file.buffer);

  if(modelId == 0) {
    response.json({modelId: modelId});
    return ;
  }

  // 解压代码文件并释放缓存
  zip.extractAllTo('model_storage/', true);
  file.buffer = null;

  // 异步构建模型镜像并启动容器
  docker.runModel(modelId);

  response.json({modelId: modelId});
});

router.post('/removeModel', function(request, response) {
  var params = request.body;

  // 异步关闭容器、移除镜像并删除目录
  docker.stopModel(params.modelId);

  response.json({result: result});
});

// 更新训练模型信息，不改动内容可略
router.post('/updateModel', function(request, response) {
  var params = request.body;
  var result = modelModel.updateModel(params.modelId, params.modelName, params.modelPath, params.modelType, params.authName, params.description, params.containerId, params.containerPort);

  response.json({result: result});
});

// 获取训练模型信息
router.get('/getModel', function(request, response) {
  var params = request.body;
  var result = modelModel.getModel(params.modelId);

  response.json(result);
});

// 获取所有训练模型信息
router.get('/getAllModel', function(request, response) {
  response.json(modelModel.getAllModel());
});

// 基于训练模型名称取模型Id
router.get('/getModelId', function(request, response) {
  var params = request.body;
  var modelId = modelModel.getModel(params.modelName);

  response.json({modelId: modelId});
});

// 路由导出
module.exports = router;
