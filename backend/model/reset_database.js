// 库模块引入
const fs = require('fs');
const path = require('path');

// 第三方模块引入
const betterSqlite3 = require('better-sqlite3');
const database = betterSqlite3(path.join(__dirname, 'db.sqlite3'));

// 从 SQL 文件中读取内容
const sql = fs.readFileSync(path.join(__dirname, 'build.sql'), 'utf8');

// 执行 SQL 命令
database.exec(sql);
