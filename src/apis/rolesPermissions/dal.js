const { getConnection } = require('typeorm');
const RolePermission = require('../../models/RolePermission');
const Permission = require('../../models/Permission');
const PermissionDAL = require('../../apis/permissions/dal');
const Role = require('../../models/Role');
class RolePermissonDAL {
    static async getAllRolePermission(){
        try{
            const connection = await getConnection();
            const RolePermissionRepo = await connection.getRepository(RolePermission);
            return RolePermissionRepo.find();

        }catch(error){
            throw error;
        }
    }
    
    static async getRolePermissionById(id){
        try{
            const conneciton = await getConnection();
            const RolePermissionRepo = await conneciton.getRepository(RolePermission);
            return await RolePermissionRepo.findOne({where : { id : id}});
        }catch(error){

        }
    }
      static async deleteRolePermissionById(id){
        try{
            const conneciton = await getConnection();
            const RolePermissionRepo = await conneciton.getRepository(RolePermission);
            return await RolePermissionRepo.delete({where : { id : id}});
        }catch(error){

        }
    }

    static async assignPermissionToRole(roleId, permissionId){
        try{
            const connection = await getConnection();

            const roleRepo = await connection.getRepository(Role);
            const role =  await roleRepo.findOne({where : { id: roleId }});

            const permissionRepo = await connection.getRepository(Permission);
            const permissionList = await permissionRepo.findByIds(permissionId);

            const RolePermissionRepo = await connection.getRepository(RolePermission);
            const rolePermission = permissionList.map((permission) => {
                const assignedPermission =  RolePermissionRepo.create({
                    role: role,
                    permission,
                })
                return assignedPermission;
        })
           return await RolePermissionRepo.save(rolePermission);
        }catch(error){
            throw error;
        }
    }

    static async updateRolePermissionBy(id, rolepermission){
        try{
                const connection = await getConnection();
                const PermissionRepo = await connection.getRepository(Permission);
                const data = await PermissionRepo.findOne({where : {id :id}});
                const permission = await PermissionRepo.merge(data, rolepermission)
                return await PermissionRepo.save(permission);
        }
        catch(error){

        }
}
}

module.exports = RolePermissonDAL;