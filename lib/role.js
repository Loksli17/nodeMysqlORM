const PermissionModel = require('./../models/PermissionModel');
const RoleHasPermissionModel = require('./../models/RoleHasPermissionModel');


//@return false or true of allow
module.exports.checkPermission = async function(req, permissionAction){
    let user = req.cookies.userIndentity;
    const RoleHasPermission = new RoleHasPermissionModel();

    //getting relations
    let relations = await RoleHasPermission.find('all', {
        where: [
            ['role_id = ', user.role_id, ''],
        ],
    });


    //getting array of ids
    let permissionIds = new Array();
    for(let i = 0; i < relations.length; i++){
         permissionIds.push(relations[i].permission_id);
    }

    //getting premissions for User
    const Permission = new PermissionModel();
    let permissions = await Permission.find('all', {
        select: ['title'],
        whereIn: ['id', permissionIds],
    });

    //checking Premission
    for(let i = 0; i < permissions.length; i++){
        if(permissions[i].title == permissionAction){
            return true;
        }
    }
    return false;
}


module.exports.checkAuth = function(req){
    let user = req.cookies.userIndentity;

    if(req.cookies.userIndentity == undefined){
        return false;
    }
    return true;
}


module.exports.checkRole = function(req, roleIds){
    let roleUser = req.cookies.userIndentity.role_id;

    for(let i = 0; i < roleIds.length; i++){
        if(roleIds[i] == roleUser){
            return true;
        }
    }

    return false;
}
