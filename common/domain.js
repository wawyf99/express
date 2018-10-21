/*
* 处理域名
* */
const request = require('request');


const Domain = {
    getDomainStatus: function (id, domain) {
        return new Promise(function (resolve, reject) {
            request('http://dsf.ravenol-bj.com/index.php/Saomiao/index?url='+domain, function (error, response, body) {
                let result = {
                    status : '',
                    data : '',
                    domain : domain,
                    id : id
                };

                result.status = response && response.statusCode;
                result.data = body;
                resolve(result);
            });
        })
    },
};

module.exports = {
    Domain
};