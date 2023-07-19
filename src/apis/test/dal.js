const { getConnection } = require("typeorm");
const Test = require("../../models/Test");

class TestDAL {
  static async getTest() {
    try {
      // get connection from the pool
      const connection = await getConnection();

      // create a bridg
      const testRepository = await connection.getRepository(Test);

      // find all test data
      const tests = await testRepository.find();

      // return all fetched data
      return tests;
    } catch (error) {
      throw error;
    }
  }

  static async getTestById(id) {
    try {
      // get connection from the pool
      const connection = await getConnection();

      // create a bridge between the entity and the database
      const testRepository = await connection.getRepository(Test);

      // get data
      const test = await testRepository.findOneBy({
        id: id,
      });

      // return single data
      return test;
    } catch (error) {
      throw error;
    }
  }

  static async createTest(data) {
    try {
      const { name, email, age } = data;
      // get connection from the pool
      const connection = getConnection();

      // create bridge
      const testRepository = connection.getRepository(Test);

      // create test
      const newTest = await testRepository.create({ name, email, age });
      await testRepository.save(newTest);
      // console.log(newTest);
      return newTest;
    } catch (error) {
      throw error;
    }
  }

  static async updateTest(id, updatedFields) {
    // get connection from the pool
    const connection = getConnection();

    // create bridge
    const testRepository = connection.getRepository(Test);
    const test = await testRepository.findOneBy({ id: id });
    if (!test) {
      throw new Error("test not found");
    }

    testRepository.merge(test, updatedFields);
    await testRepository.save(test);

    return test;
  }

  static async deleteTest(id) {
    // get connection from the pool
    const connection = getConnection();

    // create bridge
    const testRepository = connection.getRepository(Test);

    await testRepository.delete(id);

    return "Test deleted Successfully";
  }
}

module.exports = TestDAL;
