const connection = require('../common/db'),
db = new connection('express');
const redisController = require('../common/redis');
const crypto = require('crypto');



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
        let wxid = '';
        for( var i in data ){
            let _arr = [];
            _arr.push(i);
            _arr.push(JSON.parse(data[i]).domain);
            _arr.push(JSON.parse(data[i]).rand);
            _arr.push(JSON.parse(data[i]).gid);
            arr.push(_arr);
        }

        var index = Math.floor((Math.random()*arr.length));
        var _randWord = this.getRandWords(false, 4);

        var _pwd = this.aesEncrypt(Date.now()+'RouterA', 'router');

        if(arr[index][2] == 2){
            //随机
            _str = "https://"+_randWord+"."+arr[index][1]+"/"+_pwd;
        }else{
            //不随机
            _str = "https://"+arr[index][1]+"/"+_pwd;
        }
        wxid = arr[index][3];
        if(_str){
            redisController.redisController.getWxShareConfig().then(sss => {
                let result = {
                    data:[]
                }
                let data = sss;
                let arr = [];

                //对象转数组
                for (var i in data) {
                    arr.push(data[i]);
                }

                //打乱数组
                arr = this.shuffle(arr);

                //从数组中随机取出一个
                let data1 = JSON.parse(arr.splice(0, 1)[0]);
                let _one = this.createArr(_str, wxid, data1);
                result.data.push(_one);

                let data2 = JSON.parse(arr.splice(0, 1)[0]);
                let _two = this.createArr(_str, wxid, data2);
                result.data.push(_two);

                let data3 = JSON.parse(arr.splice(0, 1)[0]);
                let _three = this.createArr(_str, wxid, data3);
                result.data.push(_three);

                let data4 = JSON.parse(arr.splice(0, 1)[0]);
                let _four = this.createArr(_str, wxid, data4);
                result.data.push(_four);

                let data5 = JSON.parse(arr.splice(0, 1)[0]);
                let _five = this.createArr(_str, wxid, data5);
                result.data.push(_five);

                let data6 = JSON.parse(arr.splice(0, 1)[0]);
                let _six = this.createArr(_str, wxid, data6);
                result.data.push(_six);

                callback(result);

            })
        }

    })
};

//加密算法
exports.aesEncrypt = (data, key) => {
    const cipher = crypto.createCipher('aes192', key);
    var crypted = cipher.update(data, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
};
//解密算法
exports.aesDecrypt = (encrypted, key) => {
    const decipher = crypto.createDecipher('aes192', key);
    var decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};


//拼装数组
exports.createArr = (_str, wxid, arr, callback) => {
    let _arr = {
        'url': _str,
        'wxid': wxid,
        'id' : '',
        'title' : '',
        'describe' : '',
        'logo' : '',
        'flock_title' : '',
        'flock_logo' : '',
    };

    _arr.id = arr.id;
    _arr.title = arr.title;
    _arr.describe = arr.describe;
    _arr.logo = arr.logo;
    _arr.flock_title = arr.flock_title;
    _arr.flock_logo = arr.flock_logo;

    return _arr;
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
//打乱数组
exports.shuffle = (a, callback) => {
    var len = a.length;
    for(var i=0;i<len;i++){
        var end = len - 1 ;
        var index = (Math.random()*(end + 1)) >> 0;
        var t = a[end];
        a[end] = a[index];
        a[index] = t;
    }
    return a;
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
                    _str = "http://"+_randWord+"."+arr[index][1]+"/mark2";
                }else{
                    //不随机
                    _str = "http://"+arr[index][1]+"/mark2";
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
                var _pwd = this.aesEncrypt(Date.now()+'RouterB', 'router');
                if(arr[index][2] == 2){
                    //随机
                    _str = "http://"+_randWord+"."+arr[0][1]+"/"+_pwd;
                }else{
                    //不随机
                    _str = "http://"+arr[0][1]+"/"+_pwd;
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
                var _pwd = this.aesEncrypt(Date.now()+'RouterC', 'router');
                if(arr[index][2] == 2){
                    //随机
                    _str = "http://"+_randWord+"."+arr[0][1]+"/"+_pwd;
                }else{
                    //不随机
                    _str = "http://"+arr[0][1]+"/"+_pwd;
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
            redisController.redisController.updateShareRedis();
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
                    redisController.redisController.updateShareRedis();
                    result.status = true;
                    result.msg = '新增成功';
                    result.data = res;
                    callback(result);
                });
            }
        });
    }
};


//获取微信自定义分享列表

exports.wxShareList = (keywords, callback) => {

    let _sql = '';
    if(keywords){
        _sql = "SELECT * FROM express.T_Wx_Share WHERE title LIKE '%"+keywords+"%' ORDER BY id ASC";
    }else{
        _sql = "SELECT * FROM express.T_Wx_Share ORDER BY id ASC";
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

//微信自定义禁用
exports.wxShareOperation = (id, sort, callback) => {
    db.query("UPDATE `express`.`T_Wx_Share` SET `sort` = ? WHERE `id` = ?", {
        replacements: [sort, id]
    }).spread((results) => {
        let result = {};

        if(results.affectedRows > 0){
            //更新redis
            redisController.redisController.updateShareRedis();
            result.status = true;
            result.msg = '更改状态成功';
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

//获取单条记录
exports.wxShareOne = (id, callback) => {
    db.query("SELECT * FROM express.T_Wx_Share WHERE `id` = ?", {
        replacements: [id]
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

//删除
exports.wxShareDelete = (id, callback) => {
    db.query("DELETE FROM `T_Wx_Share` WHERE `id`= ?", {
        replacements: [id]
    }).spread((results) => {
        let result = {};
        if(results.affectedRows > 0){
            //更新redis
            redisController.redisController.updateShareRedis();
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


//新增微信分享自定义
exports.wxShareAdd = (title, describe, logo, flock_title, flock_logo, id, callback) => {
    if(id){
        db.query("UPDATE `express`.`T_Wx_Share` SET `title` = ?, `describe` = ?, `logo` = ?, `flock_title` = ?, `flock_logo` = ? WHERE `id` = ?", {
            replacements: [title, describe, logo, flock_title, flock_logo, id],
        }).spread((res) => {
            redisController.redisController.updateShareRedis();
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
                db.query("INSERT INTO `express`.`T_Wx_Share`(`title`, `describe`, `logo`, `flock_title`, `flock_logo`, `sort`, `create_time`) VALUES (?, ?, ?, ?, ?, ?, NOW())", {
                    replacements: [title, describe, logo, flock_title, flock_logo, 1],
                }).spread((res) => {
                    redisController.redisController.updateShareRedis();
                    result.status = true;
                    result.msg = '新增成功';
                    result.data = res;
                    callback(result);
                });
            }
        });
    }
};
