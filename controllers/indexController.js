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
        group_id  : '1',
        role_id   : 1,
        smth      : {kek: 'lol'},
        azaza     : false,
        testtimme : DateModule.formatDbTime(new Date()),
        phone     : '89241098357',
    }

    let resu = User.remove({where: [{eq: {id: 138}}]});

    // d = new Date();
    // d = DateModule.formatDbDateTime(d);
    //
    let result = await User.save(user);
    console.log(result);

    // console.log(user);

    res.send(user);
    // res.render('index', {user: user});

}
