const { getConnection } = require("typeorm");
const Role = require("../../models/Role");
const { validate: isUUID } = require("uuid");

class RoleDAL {
  static async createRole(data) {
    try {
      const { roleName } = data;

      // Form connection.
      const connection = getConnection();
      const RoleRepository = connection.getRepository(Role);

      // Create new role
      const createdRole = await RoleRepository.create({
        roleName,
      });

      await RoleRepository.save(createdRole);

      return createdRole;
    } catch (error) {
      throw error;
    }
  }

  static async getAllRole() {
    try {
      // Form connection.
      const connection = await getConnection();
      const roleRepository = connection.getRepository(Role);

      // Get all roles.
      const roles = await roleRepository.find();

      // return all fetched data.
      return roles;
    } catch (error) {
      throw error;
    }
  }

  static async findOneRoleByName(roleName) {
    try {
      // Form connection
      const connection = getConnection();
      const roleRepository = connection.getRepository(Role);

      //  find role by the given role name.
      const role = await roleRepository.findOneBy({ roleName });

      return role;
    } catch (error) {
      throw error;
    }
  }

  static async getRoleById(id) {
    try {
      // check the validity of the id format.
      if (!isUUID(id)) {
        return null;
      }
      // Form connection
      const connection = getConnection();
      const roleRepository = connection.getRepository(Role);

      //  find role by the given role id.

      const role = await roleRepository.findOne({ where: { id } });

      return role;
    } catch (error) {
      throw error;
    }
  }

  static async updateRoleById(id, updatedFields) {
    try {
      // check the validity of the id format.
      if (!isUUID(id)) {
        return null;
      }
      // Form connection.
      const connection = getConnection();
      const roleRepository = connection.getRepository(Role);
      const role = await roleRepository.findOneBy({ id: id });
      updatedFields.updated_at = new Date();

      // update
      roleRepository.merge(role, updatedFields);
      await roleRepository.save(role);

      // return updated role data.
      return role;
    } catch (error) {
      throw error;
    }
  }

  static async deleteRoleById(id) {
    try {
      // check the validity of the id format.
      if (!isUUID(id)) {
        return null;
      }
      const connection = await getConnection();
      const roleRepository = await connection.getRepository(Role);
      const role = await roleRepository.findOne({ where: { id: id } });
      await roleRepository.remove(role);

      return "role deleted successfully";
    } catch (error) {
      throw error;
    }
  }
}

module.exports = RoleDAL;
