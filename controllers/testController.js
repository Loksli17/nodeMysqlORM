const crypto = require('crypto');

// let dataBaseConnection =  require('./../lib/database/newDatabase');
// connetion = new dataBaseConnection();
// connetion.disconection();


exports.actionIndex = async (req, res) => {
    //--------FIND--------
    roles = await Role.find('all', {sql: true});
    // @query: SELECT * from `role` ;


    //-------WHERE--------
    roles = await Role.find('all', {
        sql: true,
        where: {eq: {id: 5}}, //id = 5
    });
    // @query SELECT * from `role`  WHERE  id = '5' ;

    roles = await Role.find('all', {
        sql: true,
        where: [
            {and: [
                {eq   : {id: 5}}, //id = 5
                {less : {id: 5}}, //id < 5
                {more : {id: 5}}, //id > 5
                {noteq: {id: 5}}, //id != 5
            ]},
        ]
    });
    // @query: SELECT * from `role`  WHERE  ( id = '5' AND id < '5' AND id > '5' AND id != '5' )

    roles = await Role.find('all', {
        sql: true,
        where: [
            {and: [
                {like      : {title: '%админ%'}}, //title LIKE '%админ%'
                {notLike   : {title: '%админ%'}}, //title not LIKE '%админ%'
                {between   : {id: [1, 2]}},       //id BETWEEN '1' AND '2'
                {notBetween: {id: [1, 2]}},       //id not BETWEEN '1' AND '2'
                {in        : {id: [1, 2, 3]}},    //id IN (1, 2, 3)
                {notIn     : {id: [1, 2, 3]}},    //id not IN(1, 2, 3)
            ]},
        ]
    });
    // @query: SELECT * from `role`  WHERE  ( title LIKE '%админ%' AND title not LIKE '%админ%' AND id BETWEEN '1' AND '2' AND id not BETWEEN '1' AND '2' AND id IN ('1', '2', '3') AND id not IN ('1', '2', '3') ) ;

    roles = await Role.find('all', {
        // sql: true,
        where: [
            {or: [
                {and: [
                    {less: {id: 5}},
                    {more: {id: 2}},
                ]},
                {or: [
                    {and: [
                        {eq  : {id: 3}},
                        {less: {id: 4}},
                    ]},
                    {in: {id: [1, 5, 17]}},
                ]},
            ]}
        ]
    });
    // @query: SELECT * from `role`  WHERE  ( ( id < '5' AND id > '2' ) OR ( ( id = '3' AND id < '4' ) OR id IN ('1', '5', '17') ) ) ;


    //--------JOIN----------
    roles = await Role.find('all', {
        sql: true,
        join: ['inner', 'role_has_permission', 'role.id = role_has_permission.id'],
    });
    // @query: SELECT * from `role`  inner JOIN `role_has_permission` ON role.id = role_has_permission.id;

    roles = await Role.find('all', {
        sql: true,
        join: [
            ['inner', 'role_has_permission', 'role.id = role_has_permission.id'],
            ['inner', 'permission', 'permission.id = role_has_permission.id'],
        ],
    });
    // @query SELECT * from `role`  inner JOIN `role_has_permission` ON role.id = role_has_permission.id inner JOIN `permission` ON permission.id = role_has_permission.id;


    //---------SELECT---------
    roles = await Role.find('all', {
        sql: true,
        select: ['id', 'title'],
    });
    // @query SELECT id, title from `role` ;


    //--------LIMIT---------
    roles = await Role.find('all', {
        sql: true,
        limit: '5',
    });
    // @query SELECT * from `role`  LIMIT 5;

    roles = await Role.find('all', {
        sql: true,
        limit: '5, 2',
    });
    // @query SELECT * from `role`  LIMIT 5, 2;


    //--------GROUP---------
    roles = await Role.find('all', {
        sql: true,
        group: 'id',
    })
    // @query SELECT * from `role`  GROUP BY id

    roles = await Role.find('all', {
        sql: true,
        group: 'id',
        groupDesc: true,
    })
    // @query SELECT * from `role`  GROUP BY id DESC


    //--------HAVING---------
    roles = await Role.find('all', {
        sql: true,
        select: ['id, MAX(count_result)'],
        having: 'SUM(count_result)'
    });
    // @query SELECT id, MAX(count_result) from `role`  HAVING SUM(count_result);


    //--------ORDER---------
    roles = await Role.find('all', {
        sql: true,
        order: 'id',
        orderDesc: true,
    });
    // query SELECT * from `role`  ORDER BY id DESC;


    //--------UNION---------
    roles = await Role.find('all', {
        sql: true,
    });

    permission = await Permission.find('all', {
        sql: true,
        union: roles
    });
    // @return SELECT * from `Permission`  UNION SELECT * from `role` ;




    //findById
    role = await Role.findById(1);
    // @return SELECT * FROM `role` WHERE id = 1; TextRow { id: 1, title: 'Главный администратор' }





    //diffcount
    //считает количество разрешений в каждо по каждой роли
    diffcount = await Permission.find('all', {
        sql: true,
        select: ['role.title', 'COUNT(*) as countPermission'],
        group : ['role.id'],
        join  : [
            ['inner', 'role_has_permission', 'role_has_permission.permissionId = permission.id'],
            ['inner', 'role', 'role.id = role_has_permission.roleId'],
        ],
    });

    // @return SELECT role.title, COUNT(*) as countPermission from `Permission`  inner JOIN `role_has_permission` ON role_has_permission.permissionId = permission.id inner JOIN `role` ON role.id = role_has_permission.roleId GROUP BY role.id;
    // [
    //     TextRow { title: 'Главный администратор', countPermission: 7 },
    //     TextRow { title: 'Администратор', countPermission: 7 }
    // ]




    //count
    count = await Role.count('*', {sql: true});
    // @return SELECT COUNT(*) FROM role TextRow { 'COUNT(*)': 4 }

    count = await Role.count(['*', 'count'], {sql: true});
    // @return SELECT COUNT(*) FROM role TextRow { count: 4 }

    count = await Role.count(['*', 'count'], {where: {more: {id: 2}}});
    // @return SELECT COUNT(*) AS count FROM role   WHERE  id > '2' TextRow { count: 2 }




    //removeById
    result = await Role.removeById(1, true);
    // @return DELETE FROM `role` WHERE id = 1;

    result = await Role.remove({where: {more: {id: 1}}, sql: true});
    // @return DELETE FROM `role`  WHERE  id > '1' ;




    //save
    //---------INSERT---------
    role = {title: 'новая роль кек'};
    result = await Role.save({data: role, sql: true});
    // @return INSERT `role` SET title = 'новая роль кек';


    //---------UPDATE---------
    role = await Role.findById(4);
    role.title = 'Новая роль еще раз';
    result = await Role.save({data: role, id: role.id, sql: true});
    // @return UPDATE role SET id = 5, title = 'Новая роль еще раз' WHERE id = 5;




    //subquery
    //---------разрешения для ролей с названиями администратор и главный администратор-------
    roles = await Role.find('all', {
        select: ['id'],
        where: {in: {title: ['Администратор', 'Главный администратор']}},
        subquery: true,
    });
    //данный запрос должен содержать subquery: true обязательно

    permission = await Permission.find('all', {
        join : ['inner', 'role_has_permission', 'role_has_permission.permissionId'],
        where: {in: {'role_has_permission.roleId': {subquery: roles}}},
        sql  : true,
    });
    // @return SELECT * from `Permission`  inner JOIN `role_has_permission` ON role_has_permission.permissionId WHERE  role_has_permission.roleId IN (SELECT id from `role`  WHERE  title IN ('Администратор', 'Главный администратор') ) ;


    //----------ANY, SOME---------
    subquery = await Role.find('all', {
        select  : ['id'],
        where   : {in: {title: ['Администратор', 'Главный администратор']}},
        subquery: true,
    })

    permission = await RoleHasPermission.find('all', {
        where: {eq: {roleId: {subquery: ['ANY', subquery]}}},
        sql: true,
    });
    // @return SELECT * from `role_has_permission`  WHERE  roleId = ANY (SELECT id from `role`  WHERE  title IN ('Администратор', 'Главный администратор') ) ;


    //-------subquery in select------------
    subquery = await Role.find('all', {
        select  : ['title'],
        where   : {eq: {'role_has_permission.roleId': {column: 'role.id'}}},
        subquery: true,
    });

    console.log(subquery);

    permission = await Permission.find('all', {
        select: ['description', 'title', {subquery: subquery, as: 'role'}],
        join  : ['inner', 'role_has_permission', 'role_has_permission.permissionId = permission.id'],
        sql   : true,
    });

    console.log(permission);
    // @return SELECT description, title, ( SELECT title from `role`  WHERE  role_has_permission.roleId = role.id ) AS role from `Permission`  inner JOIN `role_has_permission` ON role_has_permission.permissionId = permission.id;


    // console.log(permission);
    res.send('check console');

}

// console.log(connetion.disconection());
