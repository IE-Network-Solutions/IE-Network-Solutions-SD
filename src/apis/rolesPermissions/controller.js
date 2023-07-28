const RolePermissionDAL = require('./dal');
const RoleDAL = require('../role/dal');
const PermissionDAL = require('../permissions/dal');
const AppError = require('../../../utils/apperror');
const uuidValidator = require("uuid-validate");
exports.getAllRolePermission = async (req, res, next)=>{
    try{
        const rolePermissions = await RolePermissionDAL.getAllRolePermission();
        if(rolePermissions.length == 0){
            return next(new AppError("Role Permission table is Empty"))
        }
        else{
            res.status(200).json({
                status : "Success",
                message : "List of Role with permissions",
                data : rolePermissions,
                statusCode : 200
            })
        }
    }catch(error){
        console.log(error)
        return next(new AppError("Server Error", 500));
    }
}

exports.getRolePermissionById = async (req, res, next)=>{
    try{
        const id = req.params.id;
        const data = await RolePermissionDAL.getRolePermissionById(id);
        if(!data){
            return next(new AppError("Role Permission id is Not Found"));
        }
        res.status(200).json({
            status : "Success",
            message : "List of Role and permission",
            data : data,
            statusCode : 200
        })
    }
    catch(error){
        return next(new AppError("Server Error", 500));
    }
}

exports.deleteRolePermissionById = async (req, res, next)=>{
    try{
        const id = req.params.id;
        const data = await RolePermissionDAL.deleteRolePermissionById(id);
        if(!data){
            return next(new AppError("Role Permission id is Not Found"));
        }
        res.status(200).json({
            status : "Success",
            message : "Role and permission is Deleted successfully",
        })
    }
    catch(error){
        return next(new AppError("Server Error", 500));
    }
}

exports.assignPermissionToRole = async (req, res, next)=>{
    try{
        const roleId = req.params.id;
        const permissionsId = req.body.permissions;

        permissionsId.map((uuid) => {
            if (!uuidValidator(uuid)) {
                return next(new AppError("Invalid Permission Id", 500));
            }
        });
        const checkRoleId = await RoleDAL.getRoleById(roleId);
        if(!checkRoleId){
            return next(new AppError("Role Id NOT FOUND"));
        }

        const checkPermissions = await PermissionDAL.getPermissionsId(permissionsId);
        if(!checkPermissions){
            return next(new AppError("Permission Id NOT FOUND"));
        }

        const rolePermission = await RolePermissionDAL.assignPermissionToRole(roleId, permissionsId );
        res.status(200).json({
            status : "Success",
            message : "List of assigned permissions to Role",
            data : rolePermission,
            statusCode : 201
        })
    }catch(error){
        return next(new AppError("Server Error", 500));
    }
}
exports.updateRolePermissionById = async (req, res, next)=>{
    try{
        const id = req.params.id;
        const data = req.body;
        const rolePermission = await RolePermissionDAL.updateRolePermissionBy(id, data);
        if(!rolePermission){
            return next(new AppError("Role Permission not found"));
        }
        else{
            res.status(200).json({
                status :"Success",
                message : "Role permission is update successfully",
                data : rolePermission,
                statusCode : 201
            })
        }
        
    }catch(error){
        return next(new AppError("Server error", 500));
    }
}

