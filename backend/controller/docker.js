// 库模块引入
const path = require('path');

// 第三方模块引入
const fsExtra = require('fs-extra');
const dockerode = require('dockerode');
const portfinder = require('portfinder');
portfinder.basePort = 31400;
portfinder.highestPort = 31499;

// model引入
const modelModel = require('../model/model');

// 异步构建镜像并启动容器
async function runModel(modelId) {
  var model = modelModel.getModel(modelId);
  var docker = new dockerode();
  var buildPath = './' + model.modelPath;
  var imageName = path.basename(model.modelPath);

  // 构建镜像
  var stream = await docker.buildImage({ context: buildPath, src: ['./'] }, { t: imageName });
  stream.on('data', function(chunk) { console.log(chunk.toString('utf8')); });

  // 寻找可用端口并启动容器，写入数据库
  stream.on('end', function() {
    portfinder.getPort(function (error, port) {
      if (error) {
        console.error(error);
      }else {
        docker.createContainer({Image: imageName, ExposedPorts:{'443/tcp':{}}, Hostconfig:{PortBindings:{'443/tcp':[{HostPort: port.toString()}]}}}, function (error, container) {
          if (error) {
            console.error(error);
          }else {
            modelModel.updateModel(modelId, null, null, null, null, null, container.id, port);
            container.start();
          }
        });
      }
    });
  });
}

// 异步删除容器并删除模型
async function stopModel(modelId) {
  var model = modelModel.getModel(modelId);
  var container = docker.getContainer(model.containerId);
  var imageName = path.basename(model.modelPath);
  var image = docker.getImage(imageName);

  // 停止容器并删除镜像
  container.stop(function () {
    container.remove().then(function () {image.remove();});
  });

  // 删除目录
  fsExtra.remove('./' + model.modelPath);

  // 移除数据库记录
  modelModel.removeModel(modelId);
}

async function resumeAllModel() {
  var models = modelModel.getAllModel();
  var docker = new dockerode();

  console.log('resumeAllModel: ');
  console.log(models);

  for(let i = 0; i < models.length; i++) {
    if(models[i].containerId == null) {
      await runModel(models[i].modelId);
    }else {
      var container = docker.getContainer(models[i].containerId);

      container.inspect((error, data) => {
        if(data.State.Status !== 'running') container.start();
      });
    }
  }
}

// 模块导出
module.exports = {
    runModel: runModel,
    stopModel: stopModel,
    resumeAllModel: resumeAllModel,
};
