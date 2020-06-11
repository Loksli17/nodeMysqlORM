const crypto = require('crypto');

const UserModel = require('./../models/UserModel');

const User = new UserModel();


exports.actionIndex = async (req, res) => {

    let user = await User.find('all', {
        where:[
            ['id = ', 5, ''],
        ],
        whereIn: ['id', false, [1, 3], 'and', '('],
        whereBetween: ['id', true, 2, 4, 'or', ')'],
        sql: true,
    });

    res.send(user);

}
