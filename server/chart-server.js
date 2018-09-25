const connection = require('../common/db'),
db = new connection('express');

exports.getTitle = (callback) => {
    db.query("SELECT * FROM express.T_Chart_Info ORDER BY RAND() LIMIT 1", {
        replacements: [],
        type: db.QueryTypes.SELECT
    }).spread((results) => {
        callback(results);
    });
}