var express = require('express');
var router = express.Router();
const wecaht = require('../common/wechat/wechat-oath');
const indexServer = require('../server/index-server');

/* GET home page. */
router.get('/a', function (req, res, next) {
    res.send('123456');
});

/**
 * 测试接口
 */
router.get('/test', (req, res, next) => {
    indexServer.test(result => {
        res.send(result);
    });
});


module.exports = router;