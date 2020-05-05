const mysql = require('mysql2');
const config = require('./../../config');

const mysqlConnection = mysql.createPool({
   host    : config.db.mysql.host,
   user    : config.db.mysql.user,
   database: config.db.mysql.database,
   password: config.db.mysql.password,
});

module.exports = mysqlConnection;
