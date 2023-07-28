const Permission = require('../../models/Permission');
const { getConnection } = require("typeorm");

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
    return await PermissionRepo.delete(id);
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
}

module.exports = PermissionDAL;