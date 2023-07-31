const { getConnection } = require('typeorm');
const RolePermission = require('../../models/RolePermission');
const Permission = require('../../models/Permission');
const UserDAL = require("../../models/UserPermissions");
const Role = require('../../models/Role');
const User = require('../../models/User');
const UserPermission = require('../../models/UserPermissions');
class UserPermissonDAL {
    static async getAllUserPermission(){
        try{
            const connection = await getConnection();
            const UserPermissionRepo = await connection.getRepository(UserPermission);
            return await UserPermissionRepo.find({relations : ['permission']});

        }catch(error){
            throw error;
        }
    }
    
    static async getUserPermissionById(id){
        try{
            const conneciton = await getConnection();
            const UserPermissionRepo = await conneciton.getRepository(UserPermission);
            return await UserPermissionRepo.find({ where : { user_id : id}, relations : ['permission'] });
        }catch(error){
            console.log(error)
            throw error
        }
    }
    static async deleteUserPermissionById(user_id){
        try{
            const conneciton = await getConnection();
            const UserPermissionRepo = await conneciton.getRepository(UserPermissonDAL);
            return await UserPermissionRepo.delete({ user_id : user_id });
        }catch(error){

        }
    }

    static async assignPermissionToUser(userId, permissionId){
        try{
            const connection = await getConnection();

            const userRepo = await connection.getRepository(User);
            const user =  await userRepo.findOne({where : { id: userId }});

            const permissionRepo = await connection.getRepository(Permission);
            const permissionList = await permissionRepo.findByIds(permissionId);

            const UserPermissionRepo = await connection.getRepository(UserPermission);
            const userPermission = permissionList.map((permission) => {
                const assignedPermission =  UserPermissionRepo.create({
                    user: user,
                    permission,
                })
                return assignedPermission;
        })
           return await UserPermissionRepo.save(userPermission);
        }catch(error){
            throw error;
        }
    }

    static async updateUserPermissionById(id, userpermission){
        try{
                const connection = await getConnection();
                const PermissionRepo = await connection.getRepository(Permission);
                const data = await PermissionRepo.findOne({where : {id :id}});
                const permission = await PermissionRepo.merge(data, userpermission)
                return await PermissionRepo.save(permission);
        }
        catch(error){

        }
}
}

module.exports = UserPermissonDAL;