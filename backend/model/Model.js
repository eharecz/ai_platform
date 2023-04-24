const betterSqlite3 = require('better-sqlite3');
const database = betterSqlite3('./model/db.sqlite3');

function addModel(modelName, modelPath, authName, description) {
    if(modelName.length == 0 || modelPath.length == 0) return 0;
    if(getModelId(modelName) == 0) {
        result = database.prepare('insert into Model(modelName, modelPath, authName, description) values(?, ?, ?, ?)').run(modelName, modelPath, authName, description);
        return result.lastInsertRowid;
    }else {
        return 0;
    }
}

function removeModel(modelId) {
    if(getModel(modelId) != undefined) {
        result = database.prepare('delete from Model where modelId=?').run(modelId);
        return result != undefined && result.changes > 0;
    }
    return false;
}

function updateModel(modelId, modelName, modelPath, authName, description) {
    if(getModel(modelId) != undefined) {
        result = database.prepare('update Model set modelName=IFNULL(?, modelName), modelPath=IFNULL(?, modelPath), authName=IFNULL(?, authName), description=IFNULL(?, description) where modelId=?').run(modelName, modelPath, authName, description, modelId);
        return result != undefined && result.changes > 0;
    }
    return false;
}

function getModel(modelId) {
    result = database.prepare('select * from Model where modelId=?').get(modelId);
    return result;
}

function getModelId(modelName) {
    result = database.prepare('select * from Model where modelName=?').get(modelName);
    if(result != undefined) return result.modelId;
    return 0;
}

module.exports = {
    addModel: addModel,
    removeModel: removeModel,
    updateModel: updateModel,
    getModel: getModel,
    getModelId: getModelId,
};