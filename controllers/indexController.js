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
    //     subquery: true
    // });
    // console.log(subquery);
    //
    // let users = await User.find('all', {
    //     where: [
    //         {eq: {group_id: {subquery: ['ANY', subquery]}}},
    //     ],
    // });
    //
    // // let subquery = await Group.find('all', {
    // //     select: ['title'],
    // //     where: {eq: {'user.group_id': {column: 'group.id'}}},
    // //     subquery: true,
    // // });
    // //
    // // console.log(subquery);
    // //
    // // let user = await User.find('all', {
    // //     select: ['lastname', 'firstname', {subquery: subquery, as: 'userGroup'}],
    // //     where : [
    // //         {less: {id: 20}},
    // //     ]
    // //     // sql: true,
    // // });
    // //
    // let testJoin = await User.find('all', {
    //     where: {less: {'user.id': 7}},
    //     join : ['inner', 'role', 'role.id = user.role_id'],
    //     // sql  : true,
    // });
    //
    // console.log(testJoin);
    //
    // let test = await User.find('one', {where: {eq: {id: 1}}});
    // console.log(test);
    //
    // res.send(users);

    let user = await User.findById(18);
    user.date = DateModule.formatDbDate(new Date());
    user.timetest = DateModule.formatDbDateTime(new Date());

    let result = await User.save({data: user, id: 18});
    res.send(result);
}
