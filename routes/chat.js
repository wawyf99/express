var express = require('express');
var router = express.Router();
const chatServer = require('../server/chat-server');

/**
 * 测试接口
 */
router.get('/', (req, res, next) => {
    res.send('qwertyu');
});

/**
 * 获取群聊标题-前台
 */
router.post('/get-title', (req, res, next) => {
    chatServer.getTitle(result => {
        res.send(result);
    });
});

/*
* 微信自定义分享列表
* */
router.post('/wxShareList', (req, res, next) => {
    let keywords = '';
    chatServer.wxShareList(keywords, result => {
        res.send(result);
    });
})


/*
* 微信自定义分享 新增
* */

router.post('/wxShareAdd', (req, res, next) => {
    let title = req.body.title,
        describe = req.body.describe,
        logo = req.body.logo,
        flock_title = req.body.flock_title,
        flock_logo = req.body.flock_logo,
        id = req.body.id;
    chatServer.wxShareAdd(title, describe, logo, flock_title, flock_logo, id, result => {
        res.send(result);
    });
})

/*
* 微信自定义分享 禁用
* */
router.post('/wxShareOperation', (req, res, next) => {
    let id = req.body.id,
        sort = req.body.sort;
    chatServer.wxShareOperation(id, sort,  result => {
        res.send(result);
    });
})

/*
* 查询记录
* */
router.post('/wxShareOne', (req, res, next) => {
    let id = req.body.id;
    chatServer.wxShareOne(id, result => {
        res.send(result);
    });
})

/*
* 删除
* */
router.post('/wxShareDelete', (req, res, next) => {
    let id = req.body.id;
    chatServer.wxShareDelete(id, result => {
        res.send(result);
    });
})


/*
* 获取微信分享链接A1
* */
router.post('/getWxShare', (req, res, next) => {
    chatServer.getWxShare(result => {
        res.send(result);
    });
});


/*
* 获取域名
* */
router.post('/domainSkip', (req, res, next) => {
    let type = req.body.type;
    chatServer.domainSkip(type, result => {
        res.send(result);
    });
});


/**
 * 管理群聊信息
 */
router.post('/manageTitle', (req, res, next) => {
    let keywords = req.body.keywords;
    chatServer.manageTitle(keywords, result => {
        res.send(result);
    });
});

/**
 * 新增内容
 */
router.post('/addTitle', (req, res, next) => {
    let title = req.body.title,
        img = req.body.img,
        enrollment = req.body.enrollment,
        invitor = req.body.invitor,
        id = req.body.id;
    chatServer.addTitle(title, img, enrollment, invitor, id, result => {
        res.send(result);
    });
});

/*
* 获取单条内容
* */
router.post('/getTitle', (req, res, next) => {

    var ip = req.headers['x-forwarded-for'] ||
        req.ip ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress || '';
    if(ip.split(',').length>0){
        ip = ip.split(',')[0]
    }
   console.log(ip);

    let id = req.body.id;
    chatServer.getTitles(id, result => {
        res.send(result);
    });
});

/**
 * 删除内容&更新内容
 */
router.post('/deleteTitle', (req, res, next) => {
    let id = req.body.id;
    chatServer.deleteTitle(id, result => {
        res.send(result);
    });
});

module.exports = router;