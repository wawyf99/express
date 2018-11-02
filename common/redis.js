/*
* 处理redis
* */
var Redis = require('ioredis');
var redis = new Redis();
//var client  = redis.createClient();
const connection = require('../common/db');
db = new connection('express');

const redisController = {
    results : {
        status : false,
        data : [],
    },
    //更新redis
    updateRedis: function (domain) {
        return new Promise(function (resolve, reject) {
            db.query("SELECT id, domain, rand, gid, mark FROM express.T_Domain WHERE `status` = 1", {
                replacements: []
            }).spread((results) => {
                //清空整个redis库

                redis.select(0);
                redis.flushdb();
                redis.select(1);
                redis.flushdb();
                redis.select(2);
                redis.flushdb();
                redis.select(3);
                redis.flushdb();

                for (key in results) {
                    if (results.hasOwnProperty(key)) {
                        let _id = '',
                            _url = '',
                            _mark = results[key]['mark'],
                            _data = {
                                'domain' : '',
                                'rand' : '',
                                'gid' : '',
                            },
                            _name = '';

                        switch (_mark) {
                            case 1:
                                _name = 'A1';
                                _id = results[key]['id'].toString();
                                _data.domain = results[key]['domain'];
                                _data.rand = results[key]['rand'];
                                _data.gid = results[key]['gid'];
                                break;
                            case 2:
                                _name = 'A2';
                                _id = results[key]['id'].toString();
                                _data.domain = results[key]['domain'];
                                _data.rand = results[key]['rand'];
                                _data.gid = results[key]['gid'];
                                break;
                            case 3:
                                _name = 'B1';
                                _id = results[key]['id'].toString();
                                _data.domain = results[key]['domain'];
                                _data.rand = results[key]['rand'];
                                _data.gid = results[key]['gid'];
                                break;
                            case 4:
                                _name = 'C1';
                                _id = results[key]['id'].toString();
                                _data.domain = results[key]['domain'];
                                _data.rand = results[key]['rand'];
                                _data.gid = results[key]['gid'];
                                break;
                        }

                        //更新redis
                        redis.select(_mark-1);
                        redis.hmset(_name, _id, JSON.stringify(_data),function (err, result) {
                            console.log(result);
                        });
                    }
                }
            });
        })
    },
    getRedis:function () {
        //results.data = [];
        redisController.results.data = [];
        redisController.results.status = false;
        return new Promise(function (resolve, reject) {
            var res = '';
            for(var i = 0; i <= 3; i ++){
                switch (i) {
                    case 0:
                        _name = 'A1';
                        break;
                    case 1:
                        _name = 'A2';
                        break;
                    case 2:
                        _name = 'B1';
                        break;
                    case 3:
                        _name = 'C1';
                        break;
                }
                redis.select(i);
                redis.hgetall(_name, function (err, result) {
                    if(result){
                        redisController.assemblyRedis(result).then(resss=>{
                            if(redisController.results.data.length > 0){
                                redisController.results.status = true;
                            }
                            resolve(redisController.results);
                        });
                    }else{
                        console.log(err);
                    }
                });
            }

        })
    },
    assemblyRedis:function (result) {
        return new Promise(function (resolve, reject) {
            for (var t in result) {
                if (result.hasOwnProperty(t)) {
                    var arr = {
                        id : '',
                        url : '',
                    };
                    arr.id = t;
                    arr.url = result[t];
                    redisController.results.data.push(arr);
                }
            }
            resolve(redisController.results.data);
        });
    },
    //获取A1
    getRedisA1:function (result) {
        return new Promise(function (resolve, reject) {
            redis.select(0);
            redis.hgetall('A1', function (err, result) {
                if(result){
                    resolve(result);
                }
            });
        })
    },
    //获取A2
    getRedisA2:function (result) {
        return new Promise(function (resolve, reject) {
            redis.select(1);
            redis.hgetall('A2', function (err, result) {
                if(result){
                    resolve(result);
                }
            });
        })
    },
    //获取B1
    getRedisB1:function (result) {
        return new Promise(function (resolve, reject) {
            redis.select(2);
            redis.hgetall('B1', function (err, result) {
                if(result){
                    resolve(result);
                }
            });
        })
    },
    //获取C1
    getRedisC1:function (result) {
        return new Promise(function (resolve, reject) {
            redis.select(3);
            redis.hgetall('C1', function (err, result) {
                if(result){
                    resolve(result);
                }
            });
        })
    }
};

module.exports = {
    redisController: redisController
};