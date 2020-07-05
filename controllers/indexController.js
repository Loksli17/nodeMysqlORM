const crypto = require('crypto');

const DateModule = require('./../lib/date');

const UserModel = require('./../models/UserModel');

const User = new UserModel();


exports.actionIndex = async (req, res) => {

    let user = {
        firstname : 'Мой сосед',
        lastname  : 'Мудак',
        // email     : '@lol.ru',
        pass      : '123',
        group_id  : 1,
        role_id   : 1,
        smth      : {kek: 'lol'},
        azaza     : false,
        timetest  : DateModule.formatDbTime(new Date()),
        phone     : '89241098357',
    }

    let users = await User.find('all', {
        where: [
            {more: {id: 5}}
        ],
        sql: true,
    });

    await User.removeById(139);

    console.log(users);

    let result = await User.save({obj: user});
    if(!result){
        res.status(500);
        res.render('server/error', {
            layout : null,
            err    : 500,
            messege: "Iternal Server Error",
        });
        return;
    }

    // console.log(user);

    res.send(user);
    // res.render('index', {user: user});

}
