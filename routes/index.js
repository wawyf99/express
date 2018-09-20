var express = require('express');
var router = express.Router();
const wecaht = require('../common/wechat/wechat-oath');
const indexServer = require('../server/index-server');

/* GET home page. */
router.post('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

/**
 * 测试接口
 */
router.post('/test', (req, res, next) => {
    indexServer.test(result => {
        res.send(result);
    });
});


module.exports = router;