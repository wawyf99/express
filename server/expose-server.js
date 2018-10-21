const connection = require('../common/db');
const request = require('request');
const Domain = require('../common/domain');
db = new connection('express');

/* 暴露域名*/
exports.exposeDomain = (callback) => {
    db.query("SELECT id, domain FROM express.T_Domain WHERE `status` != 0", {
        replacements: []
    }).spread((results) => {
        callback(results);
    });
};

/* 获取域名*/
exports.importDomain = (callback) => {
    db.query("SELECT id, domain FROM express.T_Domain WHERE `status` != 0", {
        replacements: []
    }).spread((results) => {
        var result = {
            status:'',
            data:[]
        };
        if(results){
            result.status = true;
            //result.data = results;
            for (key in results) {
                if (results.hasOwnProperty(key)) {
                    result.data.push(results[key]);
                }
            }
            callback(result);
        }
    });
};

/*
* 检测域名
* */
exports.detectionDomain = (id, domain, callback) => {
    Domain.Domain.getDomainStatus(id, domain).then(res =>{
        callback(res);
    });
};
