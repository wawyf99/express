var express = require('express');
var router = express.Router();
const Domain = require('../common/domain');
const exposeServer = require('../server/expose-server');

/* 暴露域名*/
router.get('/exportDomain', function(req, res, next) {
    exposeServer.exposeDomain(result => {
        res.send(result.data);
    });
});

/*检测域名*/
router.get('/importDomain', function(req, res, next) {
    exposeServer.importDomain(result => {
        var results = result.data;
        var resultData = {
            status :'2',
            data:[]
        };
        for (var key in results) {
            exposeServer.detectionDomain(results[key]['id'],results[key]['domain'], results => {
                if(results.data == '1'){
                    console.log(results.domain);
                }else{
                    //console.log();
                    resultData.data.push('2')
                }

            })
        }
        res.send(resultData);
    });
});




/*对接域名检测*/


module.exports = router;