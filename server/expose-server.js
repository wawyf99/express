const connection = require('../common/db');
db = new connection('express');
const redisController = require('../common/redis');


/* 暴露域名*/
exports.exportDomain = (callback) => {
    //从redis中获取域名
    redisController.redisController.getRedis().then(res =>{
        var results = res.data;
        var result = {
            data:[]
        };
        //console.log(res);
        if(res.status){
            for (key in results) {
                if (results.hasOwnProperty(key)) {
                    var _b = {
                        'id' : '',
                        'url' : ''
                    };
                    _b.id = results[key]['id'];
                    var _data = JSON.parse(results[key].url);
                    _b.url = _data.domain;
                    result.data.push(_b);
                }
            }
            callback(result);
        }else{
            //更新redis
            redisController.redisController.updateRedis();
        }
    });

    //redisController.redisController.updateRedis();

    //从数据库直接区;
    /*db.query("SELECT id, domain FROM express.T_Domain WHERE `status` != 0", {
        replacements: []
    }).spread((results) => {
        var result = {
            data:[]
        };
        console.log(results);
        if(results){
            result.status = true;
            for (key in results) {
                if (results.hasOwnProperty(key)) {
                    var _a = result.data;

                    var _b = {
                        'id' : '',
                        'url' : ''
                    };
                    _b.id = results[key]['id'].toString();
                    _b.url = results[key]['domain'];
                    _a.push(_b);
                }
            }
            callback(result);
        }
    });*/
};

/* 处理域名*/
exports.detectionDomain = (id, callback) => {
    db.query("UPDATE `express`.`T_Domain` SET `status` = 0, `close_time` = now() WHERE `id` = ?", {
        replacements: [id]
    }).spread((results) => {
        let result = {};
        if(results.affectedRows > 0){
            //更新redis
            redisController.redisController.updateRedis();
            result.status = true;
            callback(result);
        }
    });
};

/*暴露一个B1域名*/
exports.exportA1 = (callback) => {
    redisController.redisController.getRedisA1().then(res=>{
        let data = res;
        let arr = [];
        let _str = '';
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
        if(arr[index][2] == 2){
            //随机
            _str = "https://"+_randWord+"."+arr[index][1]+"/?wxid="+arr[index][3];
        }else{
            //不随机
            _str = "https://"+arr[index][1]+"/?wxid="+arr[index][3];
        }
        callback(_str);
    });
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