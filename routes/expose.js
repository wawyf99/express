var express = require('express');
var router = express.Router();
const exposeServer = require('../server/expose-server');

/* 暴露域名*/
router.get('/exposeDomain', function(req, res, next) {
    exposeServer.exposeDomain(result => {
        res.send(result);
    });
});

module.exports = router;