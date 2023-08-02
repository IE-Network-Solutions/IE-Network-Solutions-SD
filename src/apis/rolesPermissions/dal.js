const { getConnection } = require('typeorm');
const RolePermission = require('../../models/RolePermission');
const Permission = require('../../models/Permission');
const Role = require('../../models/Role');
class RolePermissonDAL {
    static async getAllRolePermission() {
        try {
            const connection = await getConnection();
            const RolePermissionRepo = await connection.getRepository(RolePermission);
            return await RolePermissionRepo.find({ relations: ['permission'] });

        } catch (error) {
            throw error;
        }
    }

    static async getRolePermissionById(id) {
        try {
            const conneciton = await getConnection();
            const RolePermissionRepo = await conneciton.getRepository(RolePermission);
            return await RolePermissionRepo.find({ where: { role_id: id }, relations: ['permission'] });
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    static async assignPermissionToRole(roleId, permissionId) {
        try {
            const connection = await getConnection();
            const roleRepo = await connection.getRepository(Role);
            const role = await roleRepo.findOne({ where: { id: roleId } });
            const permissionRepo = await connection.getRepository(Permission);
            const permissionList = await permissionRepo.findByIds(permissionId);

            const RolePermissionRepo = await connection.getRepository(RolePermission);
            const rolePermission = permissionList.map((permission) => {
                const assignedPermission = RolePermissionRepo.create({ role: role, permission })
                return assignedPermission;
            })
            return await RolePermissionRepo.save(rolePermission);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = RolePermissonDAL;