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
        //     {
        //         and: [
        //             {like    : {email: '%kek%'}},
        //             {between: {id: [1, 4]}},
        //         ]
        //     },
        //     {like      : {email: '%kek%'}},
        //     {between   : {id: [1, 4]}},
        //     {notBetween: {id: [2, 3]}},
        //     {notlike   : {email: '%azaza%'}},
        //     {eq        : {id: 5}},
        //     {noteq     : {id: 4}},
        //     {more      : {id: 5}},
        //     {less      : {id: 5}},
        //     {in        : {id: [1, 2, 3]}},
        //     {notIn     : {id: [1, 2, 3]}},
        // ],
        newWhere: [
            {and: [
                {noteq: {id: 5}},
                {or: [
                    {more   : {id: 5}},
                    {less   : {id: 7}},
                    {in     : {last_name: ['Дима', 'Мой сосед']}},
                    {notBetween: {id: [1, 4]}},
                ]},
                {notLike: {email: '%kek%'}},
                {and: [
                    {noteq: {last_name: 'Дима'}},
                    {noteq: {last_name: 'Дима'}},
                ]},
            ]},

            // SELECT * FROM 'user' WHERE (id = 7) and (id > 5 or id < 7) and (id = 5);

        ],
        // sql: true,
    });

    res.send(user);
    // res.render('index', {user: user});

}
