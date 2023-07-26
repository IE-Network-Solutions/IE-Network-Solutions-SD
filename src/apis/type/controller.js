const AppError = require("../../../utils/apperror");
const TypeDAL = require("./dal");

exports.introduction = async (req, res, next) => {
    // Respond
    res.status(200).json({
      status: "Success",
      data: {},
    });
};


exports.getAllTypes = async (req, res, next) => {
    try {
        // Get All Types
        let types = await TypeDAL.getAllTypes();
    
        // Respond
        res.status(200).json({
          status: "Success",
          data: types,
        });
    } catch (error) {
        throw error;
    }
}

exports.getOneType = async (req, res, next) => {
    // Get ID
    let id = req.params.id;
    let type = await TypeDAL.getOneType(id);

    // Return If Type Doesn't Exist
    if (!type) return next(new AppError("Type does not exist", 404));

    // Respond
    res.status(200).json({
        status: "Success",
        data: type,
    });
    
}

exports.createType = async (req, res, next) => {
    try {
        // Get Req Body
        let type = req.body;
        let userID = req.body.userID;

        // Create Type
        let newType = await TypeDAL.createType(type, userID);
    
        // Respond
        res.status(200).json({
          status: "Success",
          data: newType, 
        });
    } catch (error) {
        throw error;
    }
}

exports.editType = async (req, res, next) => {
    try {
        // Get Req Body
        let id = req.body.id;
        let type = req.body;
    
        // Check If Type Exists
        let checkType = TypeDAL.getOneType(id);
        if (!checkType) {
          return next(new AppError("Type Does Not Exist!", 404));
        }
    
        // Edit Note
        let editedType = await TypeDAL.editType(id, type);
    
        // Respond
        res.status(200).json({
          status: "Success",
          data: editedType,
        });
    } catch (error) {
        throw error;
    }
}

exports.deleteType = async (req, res, next) => {
    try {
        // Get Req Body
        const id = req.params.id;
        
        // Check If Note Exists
        const type = await TypeDAL.getOneType(id);
        if (!type) return next(new AppError("Type Does Not Exist!"));

        // Delete Note
        const deletedType = await TypeDAL.deleteType(id);
    
        // Respond
        res.status(200).json({
          status: "Success",
          data: null,
        });
    } catch (error) {
        throw error;
    }
}

exports.deleteAllTypes = async (req, res, next) => {
    try {
        // Delete All Types
        let deletedTypes = await TypeDAL.deleteAllTypes();
    
        // Respond
        res.status(200).json({
          status: "Success",
          data: deletedTypes,
        });
    } catch (error) {
        throw error;
    }
}


