const mysql = require('mysql2');
const config = require('./../../config');


function getConnection () {
    this.connect = mysql.createPool({
      host    : config.db.mysql.host,
      user    : config.db.mysql.user,
      database: config.db.mysql.database,
      password: config.db.mysql.password,
  });
  console.log('connected to database');
}

getConnection.prototype.disconection = function (){
    this.connect.end(function(){
        console.log('connetion lost detected');
    })
}

getConnection.prototype.constructor = getConnection;
module.exports = getConnection;
