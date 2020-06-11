const modelMysql = require('../lib/Orm/mysqlOrm');

//model of tasks-mysql
function UserModel(){
    tableName = 'user';
    modelMysql.call(this, tableName);
}

//наследование
UserModel.prototype = Object.create(modelMysql.prototype);
UserModel.prototype.constructor = UserModel;

UserModel.prototype.rules = {
    integer : ['role_id', ],
    string  : ['lastname', 'firstname', 'email', 'pass'],
    required: ['lastname', 'firstname', 'email', 'role_id'],
    json    : ['smth'],
};

UserModel.prototype.rulesMesseges = {
    string  : 'Поле должно быть строкой',
    integer : 'Поле должно быть числом',
    date    : 'Поле должно иметь формат : DD-MM-YYYY',
    // required: 'Данное поле является обязательным',
    // json    : 'Поле дожно быть формата json',
}

UserModel.prototype.fields = {
    id        : 'ID',
    last_name : 'Фамилия',
    first_name: 'Имя',
    email     : 'E-mail',
    pass      : 'Пароль',
    group_id  : 'Группа',
    role_id   : 'Роль пользователя',
    smth      : 'Проверка на json',
}

UserModel.prototype.validateMessege = 'Ошибка отправки формы';

module.exports = UserModel;
