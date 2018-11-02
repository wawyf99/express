const connection = require('../common/db'),
db = new connection('express');
const redisController = require('../common/redis');


//获取群聊信息
exports.getTitle = (callback) => {
    db.query("SELECT * FROM express.T_Chart_Info ORDER BY RAND() LIMIT 1", {
        replacements: [],
        type: db.QueryTypes.SELECT
    }).spread((results) => {
        callback(results);
    });
};
//获取群聊分享链接A1
exports.getWxShare = (callback) => {
    redisController.redisController.getRedisA1().then(res => {
        let data = res;
        let arr = [];
        let _str = '';
        for( var i in data ){
            let _arr = [];
            _arr.push(i);
            _arr.push(JSON.parse(data[i]).domain);
            _arr.push(JSON.parse(data[i]).rand);
            arr.push(_arr);
        }
        var index = Math.floor((Math.random()*arr.length));
        var _randWord = this.getRandWords(false, 4);
        if(arr[index][2] == 2){
            //随机
            _str = "https://"+_randWord+"."+arr[index][1]+"/?wxid=";
        }else{
            //不随机
            _str = "https://"+arr[index][1]+"/?wxid=";
        }
        callback(_str);
    })
};

//获取随机字符串
exports.getRandWords = (randomFlag, min, max, callback) => {
    var str = "",
        pos = "",
        range = min,
        arr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

    // 随机产生
    if(randomFlag){
        range = Math.round(Math.random() * (max-min)) + min;
    }
    for(var i=0; i<range; i++){
        pos = Math.round(Math.random() * (arr.length-1));
        str += arr[pos];
    }
    return str;
};

//管理群聊信息
exports.manageTitle = (keywords, callback) => {
    let _sql = '';
    if(keywords){
        _sql = "SELECT * FROM express.T_Chart_Info WHERE title LIKE '%"+keywords+"%' ORDER BY id ASC";
    }else{
        _sql = "SELECT * FROM express.T_Chart_Info ORDER BY id ASC";
    }
    db.query(_sql, {
        replacements: [keywords],
    }).spread((results) => {
        //callback(results);
        let result = [];
        for (key in results) {
            if (results.hasOwnProperty(key)) {
                result.push(results[key]);
            }
        }
        callback(result);
    });
};

//删除内容&更新内容
exports.deleteTitle = (id, callback) => {

    db.query("DELETE FROM `express`.`T_Chart_Info` WHERE `id` = ?", {
        replacements: [id]
    }).spread((results) => {
        let result = {};
        if(results.affectedRows > 0){
            result.status = true;
            result.msg = '删除成功';
            result.data = '';
            callback(result);
        }else{
            result.status = false;
            result.msg = '请勿重复操作';
            result.data = '';
            callback(result);
        }
    });

};

//获取单条内容
exports.getTitles = (id, callback) => {
    db.query("SELECT * FROM express.T_Chart_Info WHERE id = ?", {
        replacements: [id],
    }).spread((results) => {
        let result = {};
        if(results){
            result.status = true;
            result.msg = '';
            result.data = results;
            callback(result);
        }
    });
};
//匹配当前域名
exports.domainSkip = (type, callback) => {
    switch (type) {
        case 'A2':
            redisController.redisController.getRedisA2().then(res => {
                let data = res;
                let arr = [];
                let _str = '';
                for( var i in data ){
                    let _arr = [];
                    _arr.push(i);
                    _arr.push(JSON.parse(data[i]).domain);
                    _arr.push(JSON.parse(data[i]).rand);
                    arr.push(_arr);
                }
                var index = Math.floor((Math.random()*arr.length));
                var _randWord = this.getRandWords(false, 4);
                if(arr[index][2] == 2){
                    //随机
                    _str = "https://"+_randWord+"."+arr[index][1]+"/mark2?wxid=";
                }else{
                    //不随机
                    _str = "https://"+arr[index][1]+"/mark2?wxid=";
                }
                callback(_str);
            })
            break;
        case 'B1':
            redisController.redisController.getRedisB1().then(res => {
                let data = res;
                let arr = [];
                let _str = '';
                for( var i in data ){
                    let _arr = [];
                    _arr.push(i);
                    _arr.push(JSON.parse(data[i]).domain);
                    _arr.push(JSON.parse(data[i]).rand);
                    arr.push(_arr);
                }
                var index = Math.floor((Math.random()*arr.length));
                var _randWord = this.getRandWords(false, 4);
                if(arr[index][2] == 2){
                    //随机
                    _str = "https://"+_randWord+"."+arr[index][1]+"/mark3?wxid=";
                }else{
                    //不随机
                    _str = "https://"+arr[index][1]+"/mark3?wxid=";
                }
                callback(_str);
            })
            break;
        case 'C1':
            redisController.redisController.getRedisC1().then(res => {
                let data = res;
                let arr = [];
                let _str = '';
                for( var i in data ){
                    let _arr = [];
                    _arr.push(i);
                    _arr.push(JSON.parse(data[i]).domain);
                    _arr.push(JSON.parse(data[i]).rand);
                    arr.push(_arr);
                }
                var index = Math.floor((Math.random()*arr.length));
                var _randWord = this.getRandWords(false, 4);
                if(arr[index][2] == 2){
                    //随机
                    _str = "https://"+_randWord+"."+arr[index][1]+"/mark4?wxid=";
                }else{
                    //不随机
                    _str = "https://"+arr[index][1]+"/mark4?wxid=";
                }
                callback(_str);
            })
            break;
    }

};


//新增内容
exports.addTitle = (title, img, enrollment, invitor, id, callback) => {
    if(id){
        db.query("UPDATE `express`.`T_Chart_Info` SET `title` = ?, `img` = ?, `enrollment` = ?, `invitor` = ? WHERE `id` = ?", {
            replacements: [title, img, enrollment, invitor, id],
        }).spread((res) => {
            let result = {};
            result.status = true;
            result.msg = '更新成功';
            result.data = res;
            callback(result);
        });
    }else{
        db.query("SELECT * FROM express.T_Chart_Info WHERE title = ?", {
            replacements: [title]
        }).spread((results) => {
            let result = {};
            if(results.length > 0){
                result.status = false;
                result.msg = '该名称已存在';
                result.data = '';
                callback(result);
            }else{
                db.query("INSERT INTO `express`.`T_Chart_Info`(`title`, `img`, `enrollment`, `invitor`) VALUES (?, ?, ?, ?)", {
                    replacements: [title, img, enrollment, invitor],
                }).spread((res) => {
                    result.status = true;
                    result.msg = '新增成功';
                    result.data = res;
                    callback(result);
                });
            }
        });
    }
};

