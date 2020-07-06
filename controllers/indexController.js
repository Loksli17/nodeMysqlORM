const crypto = require('crypto');

const DateModule = require('./../lib/date');

const UserModel  = require('./../models/UserModel');
const GroupModel = require('./../models/GroupModel');

User  = new UserModel();
Group = new GroupModel();


exports.actionIndex = async (req, res) => {

    // let subquery = await Group.find('all', {
    //     select : ['id'],
    //     where: [
    //         {in: {title: ['931', '933']}},
    //     ],
    //     join: [
    //         ['inner', 'user', 'user.group_id = group.id'],
    //     ],
    //     subquery: true
    // });
    // console.log(subquery);
    //
    // let users = await User.find('all', {
    //     where: [
    //         {eq: {group_id: {subquery: ['ALL', subquery]}}},
    //     ],
    //     // sql: true,
    // });

    let subquery = await Group.find('all', {
        select: ['title'],
        where: [
            {eq: {'user.group_id': {column: 'group.id'}}},
        ],
        subquery: true,
    });

    console.log(subquery);

    let user = await User.find('all', {
        select: ['lastname', 'firstname', {subquery: subquery, as: 'userGroup'}],
        where : [
            {less: {id: 20}},
        ]
        // sql: true,
    });

    res.send(user);

}
