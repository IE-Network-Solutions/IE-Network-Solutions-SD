const AppError = require("../../../utils/apperror");
const catagoryDAL = require("./dal");

//This method implements to get all catagories
exports.getAllCatagories = async (req, res, next) => {
  try {
    // get all catagories.
    const catagories = await catagoryDAL.getAllCatagories();

    res.status(200).json({
      status: "Success",
      data: catagories,
    });
  } catch (error) {
    throw error;
  }
};

// This method implements to create new catagories
exports.createCatagory = async (req, res, next) => {
  try { 
    // get catagory request body
    const data = req.body; 

    // Create new catagory
    const catagory = await catagoryDAL.createCatagory(data);

    res.status(201).json({
      status: "Success",
      data: catagory,
    });
  } catch (error) {
    throw error;
  }
};

// This method implements to get catagaory with id
exports.getCatagoryById = async (req, res, next) => {
  try {

    // get catagory id
    const id = req.params.id;

    const catagory = await catagoryDAL.getCatagoryById(id);

    if (!catagory){
      return next(
        new AppError("Catagory with the given id is not found", 404));
    }
    res.status(200).json({
      status: "Success",
      data: catagory,
    });
  } catch (error) {
    throw error;
  }
};

//This method implements to update catagory by id
exports.updateCatagory = async (req, res, next) => {
  try {
    const id = req.params.id;

    const updatedFields = req.body;

   const catagory = await catagoryDAL.updateCatagory( id, updatedFields );

    if (!catagory) {
      return next(new AppError("Catagory with the given id is not found."));
    }

    res.status(200).json({
      status: "Success",
      data: catagory,
    });
  } catch (error) {
    throw error;
  }
};

//This method implements to delete catagories by id
exports.deleteCatagory = async (req, res, next) => {
  try {
    const id = req.params.id;

    const  catagaory = await catagoryDAL.getCatagoryById(id);

    if (!catagaory) {
      return next(new AppError("Catagory with the given id is not found."));
    }

    res.status(200).json({
      status: "Success",
      data: catagaory,
    });
  } catch (error) {
    throw error;
  }
};
