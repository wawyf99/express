const connection = require('../common/db');
db = new connection('express');


//新增内容
exports.domainAdd = (domain, mark, gid, rand, sort, id, callback) => {
    if(id){
        /*db.query("UPDATE `express`.`T_Chart_Info` SET `title` = ?, `img` = ?, `enrollment` = ?, `invitor` = ? WHERE `id` = ?", {
            replacements: [title, img, enrollment, invitor, id],
        }).spread((res) => {
            let result = {};
            result.status = true;
            result.msg = '更新成功';
            result.data = res;
            callback(result);
        });*/
    }else{
        db.query("SELECT * FROM express.T_Domain WHERE domain = ?", {
            replacements: [domain]
        }).spread((results) => {
            let result = {};
            if(results.length > 0){
                result.status = false;
                result.msg = '该域名已存在';
                result.data = '';
                callback(result);
            }else{
                db.query("INSERT INTO `express`.`T_Domain`(`domain`, `mark`, `gid`, `rand`, `sort`, `create_time`, `status`) VALUES (?, ?, ?, ?, ?, NOW(), 1)", {
                    replacements: [domain, mark, gid, rand, sort],
                }).spread((res) => {
                    result.status = true;
                    result.msg = '新增域名成功';
                    result.data = res;
                    callback(result);
                });
            }
        });
    }
};
//管理域名
exports.domainList = (keywords, callback) => {
    let _sql = '';
    if(keywords){
        _sql = "SELECT * FROM express.T_Domain WHERE domain LIKE '%"+keywords+"%' ORDER BY id ASC";
    }else{
        _sql = "SELECT * FROM express.T_Domain ORDER BY id ASC";
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

//删除内容
exports.domainDelete = (id, callback) => {
    db.query("DELETE FROM `express`.`T_Domain` WHERE `id` = ?", {
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

//禁用启用
exports.operation = (id, status, callback) => {
    db.query("UPDATE `express`.`T_Domain` SET `status` = ? WHERE `id` = ?", {
        replacements: [status, id]
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