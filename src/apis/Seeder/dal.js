
const { getConnection } = require('typeorm');
const Permission = require('../../models/Permission');
const permissionConstants = require('../../../utils/permissionConstants');

class PermissionSeederDAl {
    static async permissionSeeder() {
        const connection = getConnection();
        const permissionRepository = connection.getRepository(Permission);
        try {
            return await permissionRepository.insert(permissionConstants);
        }
        catch (error) {
            return error;
        }
    }
}

module.exports = PermissionSeederDAl;
