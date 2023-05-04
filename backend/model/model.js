// Model表数据交互

// 第三方模块引入
const betterSqlite3 = require('better-sqlite3');
const database = betterSqlite3('./model/db.sqlite3');

// 添加模型，authName、description可略，返回自增modelId，失败返回0
function addModel(modelName, modelPath, modelType, authName, description) {
    if(modelName.length == 0 || modelPath.length == 0 || modelType.length == 0) return 0;
    if(getModelId(modelPath) == 0) {
        var result = database.prepare('insert into Model(modelName, modelPath, modelType, authName, description) values(?, ?, ?, ?, ?)').run(modelName, modelPath, modelType, authName, description);
        return result.lastInsertRowid;
    }else {
        return 0;
    }
}

// 删除训练模型，返回布尔值
function removeModel(modelId) {
    if(getModel(modelId) != undefined) {
        var result = database.prepare('delete from Model where modelId=?').run(modelId);
        return result != undefined && result.changes > 0;
    }
    return false;
}

// 更新训练模型信息，不改动内容可略
function updateModel(modelId, modelName, modelPath, modelType, authName, description, containerId, containerPort) {
    if(getModel(modelId) != undefined) {
        var result = database.prepare('update Model set modelName=IFNULL(?, modelName), modelPath=IFNULL(?, modelPath), modelType=IFNULL(?, modelType), authName=IFNULL(?, authName), description=IFNULL(?, description), containerId=IFNULL(?, containerId), containerPort=IFNULL(?, containerPort) where modelId=?').run(modelName, modelPath, modelType, authName, description, containerId, containerPort, modelId);
        return result != undefined && result.changes > 0;
    }
    return false;
}

// 获取训练模型信息
function getModel(modelId) {
    var result = database.prepare('select * from Model where modelId=?').get(modelId);
    return result;
}

// 获取所有展示模型信息
function getAllModel() {
    var result = database.prepare('select * from Model').all();
    return result;
}

// 基于训练模型路径取模型Id
function getModelId(modelPath) {
    var result = database.prepare('select * from Model where modelPath=?').get(modelPath);
    if(result != undefined) return result.modelId;
    return 0;
}

// 模块导出
module.exports = {
    addModel: addModel,
    removeModel: removeModel,
    updateModel: updateModel,
    getModel: getModel,
    getAllModel: getAllModel,
    getModelId: getModelId,
};
