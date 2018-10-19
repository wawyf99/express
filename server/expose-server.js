const connection = require('../common/db');
db = new connection('express');

/* 暴露域名*/
exports.exposeDomain = (callback) => {
    let results = {
        data:[1,2,3],
        status:true
    };
    callback(results);
};