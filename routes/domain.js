var express = require('express');
var router = express.Router();
const domainServer = require('../server/domain-server');


/**
 * 新增内容
 */
router.post('/domainAdd', (req, res, next) => {
    let domain = req.body.website,
        mark = req.body.mark,
        gid = req.body.gid,
        rand = req.body.rand,
        sort = req.body.sort,
        id = req.body.id;
    if(!sort){
        sort = 1;
    }
    domainServer.domainAdd(domain, mark, gid, rand, sort, id, result => {
        res.send(result);
    });
});

/**
 * 管理域名
 */
router.post('/domainList', (req, res, next) => {
    let keywords = req.body.keywords;
    domainServer.domainList(keywords, result => {
        res.send(result);
    });
});

/**
 * 删除域名
 */
router.post('/domainDelete', (req, res, next) => {
    let id = req.body.id;
    domainServer.domainDelete(id, result => {
        res.send(result);
    });
});

/**
 * 删除域名
 */
router.post('/operation', (req, res, next) => {
    let id = req.body.id,
        status = req.body.status;
    domainServer.operation(id, status, result => {
        res.send(result);
    });
});



module.exports = router;