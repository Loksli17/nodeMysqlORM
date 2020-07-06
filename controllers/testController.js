const crypto = require('crypto');

const DateModule = require('./../lib/date');
const UserModel = require('./../models/UserModel');
const User = new UserModel();

exports.actionIndex = async (req, res) => {
    let users = [];
    let fuck = req.query.id;
     
    console.log(req.query.id);
    if (req.query.id != undefined){
        users = await User.find ('all', {
            newWhere: [
                'id = $id',
                 {id : req.query.id}
            ],
        });
        res.send(users);
        return;
    }else{
        users = await User.find('all');
        res.send(users);
        return;
    }
}
