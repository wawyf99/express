const connection = require('../common/db');
db = new connection('express');
var redis   = require('redis');
var client  = redis.createClient();


/* 暴露域名*/
exports.exportDomain = (callback) => {
    db.query("SELECT id, domain FROM express.T_Domain WHERE `status` != 0", {
        replacements: []
    }).spread((results) => {
        var result = {
            data:[]
        };
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
    });
};

/* 处理域名*/
exports.detectionDomain = (id, callback) => {
    db.query("UPDATE `express`.`T_Domain` SET `status` = 0 WHERE `id` = ?", {
        replacements: [id]
    }).spread((results) => {
        let result = {};
        if(results.affectedRows > 0){
            //更新redis
            result.status = true;
            callback(result);
        }
    });
};