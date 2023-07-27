const StatusDAL = require("./dal")
const AppError = require("../../../utils/apperror");


exports.introduction = async (req, res, next) => {
    // Respond
    res.status(200).json({
      status: "Success",
      data: {},
    });
};


exports.getAllStatuses = async (req, res, next) => {
    try {
        // Get All Priorities
        let statuses = await StatusDAL.getAllStatuses();
    
        // Respond
        res.status(200).json({
          status: "Success",
          data: statuses,
        });
    } catch (error) {
        throw error;
    }
}

exports.getStatus = async (req, res, next) => {
    // Get ID
    let id = req.params.id;
    let status = await StatusDAL.getStatus(id);

    // Return If Status Isn't Set
    if (!status) return next(new AppError("Ticket Does Not Have Any Status", 404));

    // Respond
    res.status(200).json({
        status: "Success",
        data: status,
    });
    
}

exports.createStatus = async (req, res, next) => {
    try {
        // Get Req Body
        let status = req.body;

        // Create Status
        let newStatus = await StatusDAL.createStatus(status);
    
        // Respond
        res.status(200).json({
          status: "Success",
          data: newStatus,
        });
    } catch (error) {
        throw error;
    }
}

exports.editStatus = async (req, res, next) => {
    try {
        // Get Req Body
        let id = req.body.id;
        let status = req.body;
    
        // Check If Status Exists
        let checkStatus = StatusDAL.getStatus(id);
        if (!checkStatus) {
          return next(new AppError("Ticket Does Not Have Any Status!", 404));
        }
    
        // Edit Status
        let editedStatus = await StatusDAL.editStatus(id, status);
    
        // Respond
        res.status(200).json({
          status: "Success",
          data: editedStatus,
        });
    } catch (error) {
        throw error;
    }
}

exports.deleteStatus = async (req, res, next) => {
    try {
        // Get Req Body
        const id = req.params.id;
        
        // Check If Status Exists
        const status = await StatusDAL.getStatus(id);
        if (!status) return next(new AppError("Status Does Not Exist!"));

        // Delete Status
        const deletedStatus = await StatusDAL.deleteStatus(id);
    
        // Respond
        res.status(200).json({
          status: "Success",
          data: null,
        });
    } catch (error) {
        throw error;
    }
}

exports.deleteAllStatuses = async (req, res, next) => {
    try {
        // Delete All Statuses
        let deletedStatuses = await StatusDAL.deleteAllStatuses();
    
        // Respond
        res.status(200).json({
          status: "Success",
          data: deletedStatuses,
        });
    } catch (error) {
        throw error;
    }
}


