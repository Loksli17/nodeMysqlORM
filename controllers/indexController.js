const crypto = require('crypto');

const UserModel = require('./../models/UserModel');

const User = new UserModel();


exports.actionIndex = async (req, res) => {

    // let user = await User.find('all', {
    //     where:[
    //         ['id = ', 5, ''],
    //     ],
    //     whereIn: ['id', false, [1, 3], 'and',],
    //     whereBetween: ['id', true, 2, 4, 'or'],
    //     sql: true,
    // });

    let user = {
        firstname : 'Мой сосед',
        lastname  : 'Мудак',
        email     : '1@mail.ru',
        pass      : '123',
        group_id  : '1',
        role_id   : '1',
        smth      : {kek: 'lol'},
        azaza     : false,
    }

    let result = await User.save(user);

    console.log(result);
    res.send(user);

}
