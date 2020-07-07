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
    integer : ['role_id'],
    string  : ['lastname', 'firstname', 'pass'],
    required: ['lastname', 'firstname', 'role_id', 'timetest'],
    json    : ['smth'],
    max     : [{lastname: 255}, ],
    min     : [{lastname: 1}, ],
    boolean : ['azaza'],
    unique  : ['email'],
    date    : ['date'],
    email   : ['email'],
    phone   : ['phone'],
};

UserModel.prototype.rulesMesseges = {
    string  : 'Поле должно быть строкой',
    integer : 'Поле должно быть числом',
    date    : 'Поле должно иметь формат : DD-MM-YYYY',
    max     : 'Значение данного поля больше максимально допустимого',
    min     : 'Значение данного поля меньше минимально допустимого',
    // required: 'Данное поле является обязательным',
    // json    : 'Поле дожно быть формата json',
    phone   : 'Введите номер телефона в следущем формате: 89005553535'
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
    phone     : 'Телефон',
}

UserModel.prototype.validateMessege = 'Ошибка отправки формы';

module.exports = UserModel;
