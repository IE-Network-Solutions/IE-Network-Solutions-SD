const { getConnection } = require("typeorm");
const Role = require("../../models/Role");

class RoleDAL {
  static async getAllRoles(page = 1) {
    try {
      const pageSize = 10;
      const pageNumber = page;
      // get connection from the pool
      const connection = getConnection();

      // create connection bridge to the db
      const roleRepository = connection.getRepository(Role);
      const skip = page * pageSize;

      // get all roles
      const roles = roleRepository.find();

      return roles;
    } catch (error) {}
  }
  static async getSingleRole(id) {
    try {
      // get connection from the pool
      const connection = getConnection();

      // create connection bridge to the db
      const roleRepository = connection.getRepository(Role);
      const role = roleRepository.findOne({ where: { id: id } });

      // return all
      return role;
    } catch (error) {
      throw error;
    }
  }
  static async createRole(data) {
    try {
      const { roleName } = data;

      // get connection from the pool
      const connection = await getConnection();

      // create bridge to the db
      const roleRepository = await connection.getRepository(Role);

      // create role
      const newRole = await roleRepository.create({
        roleName,
      });
      await roleRepository.save(newRole);

      return newRole;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = RoleDAL;
