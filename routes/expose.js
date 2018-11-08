var express = require('express');
var router = express.Router();
const exposeServer = require('../server/expose-server');

/* 暴露域名*/
router.get('/exportDomain', function(req, res, next) {
    //console.log(req.body);
    let id = req.query.id;
    if(id){
        exposeServer.detectionDomain(id, result => {
            res.send(result.data);
        });
    }else{
        exposeServer.exportDomain(result => {
            res.send(result.data);
        });
    }

});

/*暴露一个B域名*/
router.get('/exportA1', function(req, res, next) {
    exposeServer.exportA1(result => {
        let results = {
            "url":result
        }
        res.send(results);
    });
});

module.exports = router;