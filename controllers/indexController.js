const crypto = require('crypto');

const DateModule = require('./../lib/date');

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

    // let user = {
    //     firstname : 'Мой сосед',
    //     lastname  : 'Мудак',
    //     // email     : '@lol.ru',
    //     pass      : '123',
    //     group_id  : '1',
    //     role_id   : 1,
    //     smth      : {kek: 'lol'},
    //     azaza     : false,
    //     testtimme : DateModule.formatDbTime(new Date()),
    //     phone     : '89241098357',
    // }

    // d = new Date();
    // d = DateModule.formatDbDateTime(d);
    //
    // let result = await User.save(user);
    // console.log(result);

    let user = await User.find('all', {
        // newWhere: [
        //     "(id < $id) AND timetest = $time",
        //     {
        //         id  : 5,
        //         time: DateModule.formatDbTime(new Date()),
        //     }
        // ],
        // newWhere: [
        //     'id = $id', {id: 5},
        // ],
        // newWhere: [
        //     'id IN ($array)', {array: [1, 3, 5]},
        // ],
        // newWhere: ['email LIKE $val', {val: '%kek%'}],
        newWhere: ['id BETWEEN $val1 AND $val2', {val1: 1, val2: 5}],
        // sql: true,
    });

    res.send(user);
    // res.render('index', {user: user});

}
