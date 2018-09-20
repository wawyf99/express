const connection = require('../common/db'),
db = new connection('express');

exports.test = (callback) => {
    db.query(" SELECT * FROM express.T_User ", {
        replacements: [],
        type: db.QueryTypes.SELECT
    }).spread((results) => {
        callback(results);
    });
}