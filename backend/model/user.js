// user表数据交互

// 第三方模块引入
const betterSqlite3 = require('better-sqlite3');
const database = betterSqlite3('./model/db.sqlite3');

// 添加用户，email、phone可略，返回自增userId，失败返回0
function addUser(username, password, role, email, phone) {
    if(username.length == 0 || password.length == 0 || role.length == 0) return 0;
    if(getUserId(username) == 0) {
        result = database.prepare('insert into User(username, password, role, email, phone) values(?, ?, ?, ?, ?)').run(username, password, role, email, phone);
        return result.lastInsertRowid;
    }else {
        return 0;
    }
}

// 删除用户，返回布尔值
function removeUser(userId) {
    if(getUser(userId) != undefined) {
        result = database.prepare('delete from User where userId=?').run(userId);
        return result != undefined && result.changes > 0;
    }
    return false;
}

// 更新用户信息，不改动内容可略
function updateUser(userId, username, password, role, email, phone) {
    if(getUser(userId) != undefined) {
        result = database.prepare('update User set username=IFNULL(?, username), password=IFNULL(?, password), role=IFNULL(?, role), email=IFNULL(?, email), phone=IFNULL(?, phone) where userId=?').run(username, password, role, email, phone, userId);
        return result != undefined && result.changes > 0;
    }
    return false;
}

// 获取用户信息
function getUser(userId) {
    result = database.prepare('select * from User where userId=?').get(userId);
    return result;
}

// 获取所有用户信息
function getAllUser() {
    result = database.prepare('select * from User').all();
    return result;
}

// 基于用户名取用户Id
function getUserId(username) {
    result = database.prepare('select * from User where username=?').get(username);
    if(result != undefined) return result.userId;
    return 0;
}

// 模块导出
module.exports = {
    addUser: addUser,
    removeUser: removeUser,
    updateUser: updateUser,
    getUser: getUser,
    getAllUser: getAllUser,
    getUserId: getUserId,
};
