const { getConnection } = require('typeorm');
const RolePermission = require('../../models/RolePermission');
const Permission = require('../../models/Permission');
const UserDAL = require("../../models/UserPermissions");
const Role = require('../../models/Role');
const User = require('../../models/User');
const UserPermission = require('../../models/UserPermissions');
class UserPermissonDAL {
    static async getAllUserPermission() {
        try {
            const connection = await getConnection();
            const UserPermissionRepo = await connection.getRepository(UserPermission);
            return await UserPermissionRepo.find({ relations: ['permission'] });

        } catch (error) {
            throw error;
        }
    }

    static async getUserPermissionById(id) {
        try {
            const connecition = await getConnection();
            const UserPermissionRepo = await connecition.getRepository(UserPermission);
            return await UserPermissionRepo.find({ where: { user_id: id }, relations: ['permission'] });
        } catch (error) {
            console.log(error)
            throw error
        }
    }
    static async deleteUserPermissionById(id) {
        try {
            const connection = await getConnection();
            const UserPermissionRepo = connection.getRepository(UserPermission);
            const permissions = await UserPermissionRepo.find({ where: { user_id: id } });

            if (!permissions.length) {
                return;
            }

            await UserPermissionRepo.remove(permissions);

        } catch (error) {
            console.error(`Error deleting user permissions for user ${id}: ${error.message}`);
            throw error;
        }
    }


    static async assignPermissionToUser(userId, permissionId) {
        try {
            const connection = await getConnection();

            const userRepo = await connection.getRepository(User);
            const user = await userRepo.findOne({ where: { id: userId } });

            const permissionRepo = await connection.getRepository(Permission);
            const permissionList = await permissionRepo.findByIds(permissionId);

            const UserPermissionRepo = await connection.getRepository(UserPermission);
            const userPermission = permissionList.map((permission) => {
                const assignedPermission = UserPermissionRepo.create({
                    user: user,
                    permission,
                })
                return assignedPermission;
            })
            return await UserPermissionRepo.save(userPermission);
        } catch (error) {
            throw error;
        }
    }

    static async updateUserRolePermissionByUserId(id, userRolepermission) {
        try {
            const { roleId, permissionsId } = userRolepermission;
            const connections = getConnection();
            const userRepo = connections.getRepository(User);
            const userPermissionRepo = connections.getRepository(UserPermission);

            await userRepo.update(id, { role: roleId });

            const existingUserPermissions = await this.getUserPermissionById(id);

            await Promise.all(existingUserPermissions.map(async (user) => {
                await this.deleteUserPermissionById(user.user_id);
            }));

            const incommingUserPermissions = await permissionsId?.map(permissionId => {
                return userPermissionRepo.create({
                    user_id: id,
                    permission_id: permissionId
                });
            });

            return await userPermissionRepo.save(incommingUserPermissions);

        } catch (error) {
            console.error(`Error updating user role and permissions for user ${id}: ${error.message}`);
            throw error;
        }
    }

}

module.exports = UserPermissonDAL;