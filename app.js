var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const session = require('express-session');
var index = require('./routes/index');
var wechat = require('./routes/wechat-controller');
const swig = require('swig');
require('body-parser-xml')(bodyParser);
var app = express();

/**
 * 跨域设置
 */
app.all('*', function (req, res, next) {
    //本地环境
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    //测试环境
    //res.header("Access-Control-Allow-Origin", "http://agent.test.sxmj.szdhkj.com.cn")
    //正式环境
    //res.header("Access-Control-Allow-Origin", "http://agent.sxmj.szdhkj.com.cn");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    if (req.method == "OPTIONS")
        res.send(200); /*让options请求快速返回*/
    else next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', swig.renderFile);


//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.xml({
    limit: "1MB", // Reject payload bigger than 1 MB
    xmlParseOptions: {
        normalize: true, // Trim whitespace inside text nodes
        normalizeTags: true, // Transform tags to lowercase
        explicitArray: false // Only put nodes in array if >1
    },
    verify: function (req, res, buf, encoding) {
        console.log(req);
        if (buf && buf.length) {
            // Store the raw XML
            req.rawBody = buf.toString(encoding || "utf8");
        }
    }
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public', express.static('public'));
/**
 * 微信请求过滤器
 */
// app.use('/wechat', wechatFilter.checkSignature());



app.use('/', index);
app.use('/wechat', wechat);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;