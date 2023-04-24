const betterSqlite3 = require('better-sqlite3');
const database = betterSqlite3('./model/db.sqlite3');

function addUser(username, password, role, email, phone) {
    if(username.length == 0 || password.length == 0 || role.length == 0) return 0;
    if(getUserId(username) == 0) {
        result = database.prepare('insert into User(username, password, role, email, phone) values(?, ?, ?, ?, ?)').run(username, password, role, email, phone);
        return result.lastInsertRowid;
    }else {
        return 0;
    }
}

function removeUser(userId) {
    if(getUser(userId) != undefined) {
        result = database.prepare('delete from User where userId=?').run(userId);
        return result != undefined && result.changes > 0;
    }
    return false;
}

function updateUser(userId, username, password, role, email, phone) {
    if(getUser(userId) != undefined) {
        result = database.prepare('update User set username=IFNULL(?, username), password=IFNULL(?, password), role=IFNULL(?, role), email=IFNULL(?, email), phone=IFNULL(?, phone) where userId=?').run(username, password, role, email, phone, userId);
        return result != undefined && result.changes > 0;
    }
    return false;
}

function getUser(userId) {
    result = database.prepare('select * from User where userId=?').get(userId);
    return result;
}

function getUserId(username) {
    result = database.prepare('select * from User where username=?').get(username);
    if(result != undefined) return result.userId;
    return 0;
}

module.exports = {
    addUser: addUser,
    removeUser: removeUser,
    updateUser: updateUser,
    getUser: getUser,
    getUserId: getUserId,
};
