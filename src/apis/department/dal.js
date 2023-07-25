const { getConnection } = require("typeorm");
const Department = require("../../models/Department");

class DepartmentDAL {
  // Get All Departments
  static async getAllDepartments() {
    try {
      // Form Connection
      const connection = getConnection();
      const departmentRepository = connection.getRepository(Department);

      // Get Data
      const departments = await departmentRepository.find();
      return departments;
    } catch (error) {
      throw error;
    }
  }

  // Get Department of Ticket
  static async getDepartment(data) {
    const id = data;
    try {
      // Form Connection
      const connection = getConnection();
      const departmentRepository = connection.getRepository(Department);

      // Get Data
      const foundDepartment = await departmentRepository.findOne({
        where: { id: id },
      });
      return foundDepartment;
    } catch (error) {
      throw error;
    }
  }

  // Create New Department
  static async createDepartment(data) {
    try {
      // Create Department Object
      const department = data;

      // Form Connection
      const connection = getConnection();
      const departmentRepository = connection.getRepository(Department);

      // Create Department
      const newDepartment = await departmentRepository.create(department);
      await departmentRepository.save(newDepartment);
      return newDepartment;
    } catch (error) {
      throw error;
    }
  }

  // Edit Department
  static async editDepartment(id, data) {
    try {
      // Create Department Objects
      const idDepartment = id;
      const updatedFields = data;

      // Form Connection
      const connection = getConnection();
      const departmentRepository = connection.getRepository(Department);

      const department = await departmentRepository.findOneBy({
        id: idDepartment,
      });

      // Update User
      // Update only the specified fields in the updatedFields object
      Object.keys(updatedFields).forEach((field) => {
        if (field in department) {
          department[field] = updatedFields[field];
        }
      });
      await departmentRepository.save(department);

      return department;
    } catch (error) {
      throw error;
    }
  }

  // Delete One Department
  static async deleteDepartment(id) {
    try {
      // Form Connection
      const connection = getConnection();
      const departmentRepository = connection.getRepository(Department);

      // Delete Priority
      const deletedDepartment = await departmentRepository.delete({ id: id });

      return "Department Deleted Successfully!";
    } catch (error) {
      throw error;
    }
  }

  // Delete All Departments
  static async deleteAllDepartments() {
    try {
      // Form Connection
      const connection = getConnection();
      const departmentRepository = connection.getRepository(Department);

      // Get All Departments
      const allDepartments = await departmentRepository.find();

      // Delete All Departments
      const deletedDepartments = await departmentRepository.delete(
        allDepartments
      );
      return deletedDepartments;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = DepartmentDAL;
