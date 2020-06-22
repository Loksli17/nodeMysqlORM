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
    required: ['lastname', 'firstname', 'role_id', 'date'],
    json    : ['smth'],
    max     : [{lastname: 255}, ],
    min     : [{lastname: 1}, ],
    boolean : ['azaza'],
    // unique  : ['email'],
    date    : ['date'],
    email   : ['email'],
};

UserModel.prototype.rulesMesseges = {
    string  : 'Поле должно быть строкой',
    integer : 'Поле должно быть числом',
    date    : 'Поле должно иметь формат : DD-MM-YYYY',
    max     : 'Значние данного поля больше максимально допустимого',
    min     : 'Значние данного поля меньше минимально допустимого',
    // required: 'Данное поле является обязательным',
    // json    : 'Поле дожно быть формата json',
}

UserModel.prototype.fields = {
    id        : 'ID',
    lastname  : 'Фамилия',
    firstname : 'Имя',
    email     : 'E-mail',
    date      : 'Дата',
    pass      : 'Пароль',
    group_id  : 'Группа',
    role_id   : 'Роль пользователя',
    smth      : 'Проверка на json',
}

UserModel.prototype.validateMessege = 'Ошибка отправки формы';

module.exports = UserModel;
