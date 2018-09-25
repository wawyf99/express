var express = require('express');
var router = express.Router();
const chartServer = require('../server/chart-server');



/**
 * 测试接口
 */
router.post('/', (req, res, next) => {
    res.send('qwertyu');
});

/**
 * 测试接口
 */
router.post('/get-title', (req, res, next) => {
    chartServer.getTitle(result => {
        res.send(result);
    });
});

module.exports = router;