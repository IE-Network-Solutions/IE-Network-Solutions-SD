const AppError = require("../../../utils/apperror");
const TestDAL = require("./dal");

exports.allTests = async (req, res, next) => {
  try {
    //   get all tests
    const tests = await TestDAL.getTest();

    // check if tests data exist
    if (!tests) {
      // return custom error
      return next(new AppError("No test data found"));
    }

    // response
    res.status(200).json({
      status: "Success",
      data: tests,
    });
  } catch (error) {
    throw error;
  }
};

exports.singleTest = async (req, res, next) => {
  try {
    const id = req.params.id;

    // get test with the given id
    const test = await TestDAL.getTestById(id);

    if (!test) return next(new AppError("Test with the given id not found"));

    res.status(200).json({
      status: "Success",
      data: test,
    });
  } catch (error) {
    throw error;
  }
};

exports.createTest = async (req, res, next) => {
  try {
    const data = req.body;

    // Check required fields
    if (!data.name || !data.email || !data.age) {
      return next(new AppError("Please fill all required fields", 400));
    }

    //   create new test
    const test = await TestDAL.createTest(data);

    res.status(201).json({
      status: "Success",
      data: test,
    });
  } catch (error) {
    throw error;
  }
};

exports.updateTests = async (req, res, next) => {
  try {
    const id = req.params.id;
    const updatedFields = req.body;

    // check if test exist or not
    const testData = await TestDAL.getTestById(id);

    if (!testData)
      return next(new AppError("Test with the given id not found"));

    const test = await TestDAL.updateTest(id, updatedFields);

    res.status(200).json({
      status: "Success",
      data: test,
    });
  } catch (error) {
    throw error;
  }
};

exports.deleteTest = async (req, res, next) => {
  try {
    const id = req.params.id;

    // validate if test exist or not
    const testData = await TestDAL.getTestById(id);

    if (!testData)
      return next(new AppError("Test with the given id not found"));

    await TestDAL.deleteTest(id);

    res.status(200).json({
      status: "Success",
      data: null,
    });
  } catch (error) {
    throw error;
  }
};
