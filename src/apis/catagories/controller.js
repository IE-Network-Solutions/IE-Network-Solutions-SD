const AppError = require("../../../utils/apperror");
const catagoryDAL = require("./dal");

exports.getAllCatagories = async (req, res, next) => {
  try {
    // get all catagories.
    const catagories = await catagoryDAL.getAllCatagories();

    // check if catagories doen't exist.
    if (!catagories) {
      // return custom error
      return next(new AppError("No catagory data found."));
    }

    res.status(200).json({
      status: "Success",
      data: catagories,
    });
  } catch (error) {
    throw error;
  }
};

exports.createCatagory = async (req, res, next) => {
  try { 
    // get input data.
    const data = req.body; 
    //   create new knowlegebase
    const catagory = await catagoryDAL.createCatagory(data);

    res.status(201).json({
      status: "Success",
      data: catagory,
    });
  } catch (error) {
    throw error;
  }
};

exports.getCatagoyById = async (req, res, next) => {
  try {
    const id = req.params.id;

    const catagory = await catagoryDAL.getCatagoryById(id);

    if (!catagory)
      return next(new AppError("Catagory with the given id is not found", 404));

    res.status(200).json({
      status: "Success",
      data: catagory,
    });
  } catch (error) {
    throw error;
  }
};

exports.updateCatagory = async (req, res, next) => {
  try {
    const id = req.params.id;
    const updatedFields = req.body;

    // check if catagory with the given id is found or not?
    const isCatagoryExist = await catagoryDAL.getCatagoryById(id);

    if (!isCatagoryExist) {
      return next(
        new AppError("Catagory with the given id is not found.")
      );
    }

    const catagory = await catagoryDAL.updateCatagory(
      id,
      updatedFields
    );

    res.status(200).json({
      status: "Success",
      data: catagory,
    });
  } catch (error) {
    throw error;
  }
};

exports.deleteCatagory = async (req, res, next) => {
  try {
    const id = req.params.id;

    // check if catagory with the given id is found or not?
    const isCatagoryExist = await catagoryDAL.getCatagoyById(id);

    if (!isCatagoryExist) {
      return next(
        new AppError("Catagory with the given id is not found.")
      );
    }

    await catagoryDAL.deleteCatagory(id);

    res.status(200).json({
      status: "Success",
      data: null,
    });
  } catch (error) {
    throw error;
  }
};
