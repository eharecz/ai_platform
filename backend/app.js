// 库模块引入
const https = require('https');
const path = require('path');
const fs = require('fs');

// 第三方模块引入
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dockerode = require('dockerode');

// 路由引入
const userRouter = require('./router/user');
const modelRouter = require('./router/model');

// docker管理模块引入
const docker = require('./controller/docker');

// express应用及中间件使用
const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 路由使用
app.use('/user', userRouter);
app.use('/model', modelRouter);

docker.resumeAllModel();

// 开启https监听
const ssl_options = {
    key: fs.readFileSync('./ssl/private.key'),
    cert: fs.readFileSync('./ssl/certificate.crt')
};
const server = https.createServer(ssl_options, app);
server.listen(8000, () => {
    console.log(`Server listening on port ${server.address().port}`);
});
