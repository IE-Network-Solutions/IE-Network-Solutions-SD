const { compareSync } = require('bcryptjs');
const AppError = require('../../../utils/apperror');
const PermissionDAL = require('./dal');
const UserDAL = require('../users/dal');
exports.getAllPermissions = async (req, res, next)=>{
    try{
       
        const permission = await PermissionDAL.getAllPermissions();
        console.log(permission)
        if(permission.length == 0){
            return next(new AppError("Permission is Table is Empity", 404)) 
        }
       else{
         res.status(200).json({
                status : "Success",
                message : "Permission lists",
                data : permission,
                statusCode : 200
            })
        }
    }
    catch(error){
        console.log(error)
        return next(new AppError(`Server Error`, 500));
    }
}
exports.getPermissionById = async (req, res, next)=>{
     try{
        const id = req.params.id;
        const permission = await PermissionDAL.getPermissionById(id);
        console.log(permission);
        if(!permission){
            return next(new AppError(`User with id ${id} is NOT FOUND`))
        }
        else{
            res.status(200).json({
                status : "Success",
                message : "Permission Information",
                data : permission,
                statusCode : 200,
            })
        }
    }
    catch(error){
        console.log(error)
        return next(new AppError("Server Error", 500));
    }
}
exports.createPermission = async (req, res, next)=>{
     try{
        const data = req.body;
        const name = req.body.name;
        const checkPermissions = await PermissionDAL.getAllPermissions();
        if(checkPermissions.some(permission=> permission.name === name)){
            return next(new AppError("Permission is Already exist"));
        }
        const permission = await PermissionDAL.createPermission(data);

        if(permission.length == 0 ){
            return next(AppError("Permission is Not Created"));
        }
        else{
            res.status(201).json({  
                status : "Success", 
                message : "Permission is successfully created",
                data : permission,
                statusCode : 201
            })
        }
    }
    catch(error){
        console.log(error)
       return next(new AppError("Server Error", 500));
    }
}
exports.updatePermission = async (req, res, next)=>{
     try{
        const id = req.params.id;
        const data = req.body;
        const checkPermission = await PermissionDAL.getPermissionById(id);
        if(!checkPermission){
            return next(new AppError("Permission Id is Not Found"));
        }
        else{
            const permission = await PermissionDAL.updatePermission(id, data);
            if(!permission){
                return next(new AppError("Permission is Not Updated"))
            }
            else{
                res.status(200).json({
                    status : "Success",
                    message : "Permission is successfully updated",
                    data : permission,
                    statusCode : 201
                })
        }
        }
    }
    catch(error){
       return next(new AppError("Server Error", 500));
    }
}
exports.deletePermission = async (req, res, next)=>{
     try{
        const id = req.params.id;
        const permission = await PermissionDAL.getPermissionById(id);
        if(!permission){
            return next(new AppError("Permission not found"))
        }
        await PermissionDAL.deletePermission(id);
                res.status(200).json({
                    status : 200,
                    message : "Permission is Deleted Successfully",
                    statusCode : 200
                })
            }
    catch(error){
        console.log(error)
        return next(new AppError("Server Error", 500));
    }
}

exports.deleteSpecificUserPermission = async (req, res, next)=>{
    try{
        const userId = req.params.userId;
        const permissionId = req.params.permissionId;
        const users = await UserDAL.deletePermissionForSpecificUser(userId, permissionId);
        res.status(200).json({
            status:"Success",
            message : "User permission is deleted successfully"
        })

    }
    catch(error){
        console.log(error);
    }
}

