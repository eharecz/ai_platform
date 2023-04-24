const betterSqlite3 = require('better-sqlite3');
const database = betterSqlite3('./model/db.sqlite3');

function addTrain(dockerId, volumePath, state, modelId, userId) {
    if(dockerId.length == 0 || volumePath.length == 0 || state.length == 0 || modelId == 0 || userId == 0) return 0;
    if(getTrainId(dockerId) == 0) {
        result = database.prepare('insert into Train(dockerId, volumePath, state, modelId, userId) values(?, ?, ?, ?, ?)').run(dockerId, volumePath, state, modelId, userId);
        return result.lastInsertRowid;
    }else {
        return 0;
    }
}

function removeTrain(trainId) {
    if(getTrain(trainId) != undefined) {
        result = database.prepare('delete from Train where trainId=?').run(trainId);
        return result != undefined && result.changes > 0;
    }
    return false;
}

function updateTrainState(trainId, state) {
    if(getTrain(trainId) != undefined) {
        result = database.prepare('update Train set state=? where trainId=?').run(state, trainId);
        return result != undefined && result.changes > 0;
    }
    return false;
}

function getTrain(trainId) {
    result = database.prepare('select * from Train where trainId=?').get(trainId);
    return result;
}

function getTrainId(dockerId) {
    result = database.prepare('select * from Train where dockerId=?').get(dockerId);
    if(result != undefined) return result.trainId;
    return 0;
}

module.exports = {
    addTrain: addTrain,
    removeTrain: removeTrain,
    updateTrainState: updateTrainState,
    getTrain: getTrain,
    getTrainId: getTrainId,
};
