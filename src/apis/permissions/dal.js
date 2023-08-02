const Permission = require('../../models/Permission');
const { getConnection } = require("typeorm");

class PermissionDAL {
    static async getAllPermissions() {
        try {
            const connection = await getConnection();
            const PermissionRepo = await connection.getRepository(Permission);
            return await PermissionRepo.find();
        } catch (error) {
            throw error.message
        }
    }
    static async getPermissionById(id) {
        try {
            const connection = await getConnection();
            const PermissionRepo = await connection.getRepository(Permission);
            return await PermissionRepo.findOne({ where: { id: id } });
        } catch (error) {
            throw error;
        }
    }
    static async createPermission(permissions) {
        try {
            const { name } = permissions;
            const connection = await getConnection();
            const PermissionRepo = await connection.getRepository(Permission);
            const permission = await PermissionRepo.create({ name });
            return await PermissionRepo.save(permission);
        } catch (error) {
            throw error;
        }
    }
    static async updatePermission(id, permissions) {
        try {
            const connection = await getConnection();
            const PermissionRepo = await connection.getRepository(Permission);
            const data = await PermissionRepo.findOne({ where: { id: id } });
            const permission = await PermissionRepo.merge(data, permissions)
            return PermissionRepo.save(permission);
        } catch (error) {

        }
    }
    static async deletePermission(id) {
        try {
            const connection = await getConnection();
            const PermissionRepo = await connection.getRepository(Permission);
            const permission = await PermissionRepo.find({ where: { id: id } });
            return await PermissionRepo.remove(permission);
        } catch (error) {
            throw error;
        }
    }
    static async getPermissionsId(permissionId) {
        try {
            const connection = await getConnection();
            const PermissionRepo = await connection.getRepository(Permission);
            return await PermissionRepo.findByIds({ permissionId });
        } catch (error) {
            throw error;
        }
    }
}

module.exports = PermissionDAL;