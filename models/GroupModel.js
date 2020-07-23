const modelMysql = require('../lib/mysqlOrm');

//model of tasks-mysql
function GroupModel(){
    tableName = 'group';
    modelMysql.call(this, tableName);
}

//наследование
GroupModel.prototype = Object.create(modelMysql.prototype);
GroupModel.prototype.constructor = GroupModel;

module.exports = GroupModel;
