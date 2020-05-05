const crypto = require('crypto');

const UserModel = require('./../models/UserModel');

const User = new UserModel();


exports.actionIndex = async (req, res) => {
    user = await User.find('all');
    res.send(user);
}
