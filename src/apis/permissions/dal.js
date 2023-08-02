const Permission = require('../../models/Permission');
const { getConnection } = require("typeorm");
const User = require('../../models/User');
const UserDAL = require('../users/dal');

class PermissionDAL  {
    static async getAllPermissions(){
        try{
            const connection = await getConnection();
            const PermissionRepo = await connection.getRepository(Permission);
            return await PermissionRepo.find();
        }catch(error){
            throw error.message
        }
}
static async getPermissionById(id){
    const connection = await getConnection();
    const PermissionRepo = await connection.getRepository(Permission);
    return await PermissionRepo.findOne({where:{id : id }});
}
static async createPermission(permissions){
    const { name } = permissions;
    const connection = await getConnection();
    const PermissionRepo = await connection.getRepository(Permission);
    const permission = await PermissionRepo.create({ name });
    return await PermissionRepo.save(permission);

}
static async updatePermission(id, permissions){
    const connection = await getConnection();
    const PermissionRepo = await connection.getRepository(Permission);
    const data = await PermissionRepo.findOne({where : {id :id}});
    const permission = await PermissionRepo.merge(data, permissions)
    return PermissionRepo.save(permission);
}
static async deletePermission(id){
    const connection = await getConnection();
    const PermissionRepo = await connection.getRepository(Permission);
    const permission = await PermissionRepo.find({where : { id : id}});
    return await PermissionRepo.remove(permission);
}
static async getPermissionsId(permissionId) {
        try {
            const connection = await getConnection();
            const PermissionRepo = await connection.getRepository(Permission);
            return await PermissionRepo.findByIds({permissionId});
        } catch (error) {
        throw error;
        }
  }

  static async deletePermissionForSpecificUser(userId) {
        try {
            const user = await UserDAL.getOneUser(userId);
            
        } catch (error) {
        throw error;
        }
  }
}

module.exports = PermissionDAL;