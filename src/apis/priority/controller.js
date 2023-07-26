const PriorityDAL = require("./dal")
const AppError = require("../../../utils/apperror");


exports.introduction = async (req, res, next) => {
    // Respond
    res.status(200).json({
      status: "Success",
      data: {},
    });
};


exports.getAllPriorities = async (req, res, next) => {
    try {
        // Get All Priorities
        let priorities = await PriorityDAL.getAllPriorities();
    
        // Respond
        res.status(200).json({
          status: "Success",
          data: priorities,
        });
    } catch (error) {
        throw error;
    }
}

exports.getPriority = async (req, res, next) => {
    // Get ID
    let id = req.params.id;
    let priority = await PriorityDAL.getPriority(id);

    // Return If Priority Isn't Set
    if (!priority) return next(new AppError("Ticket Does Not Have Any Priority", 404));

    // Respond
    res.status(200).json({
        status: "Success",
        data: priority,
    });
    
}

exports.createPriority = async (req, res, next) => {
    try {
        // Get Req Body
        let priority = req.body;

        // Create Priority
        let newPriority = await PriorityDAL.createPriority(priority);
    
        // Respond
        res.status(200).json({
          status: "Success",
          data: newPriority,
        });
    } catch (error) {
        throw error;
    }
}

exports.editPriority = async (req, res, next) => {
    try {
        // Get Req Body
        let id = req.body.id;
        let priority = req.body;
    
        // Check If Priority Exists
        let checkPriority = PriorityDAL.getPriority(id);
        if (!checkPriority) {
          return next(new AppError("Ticket Does Not Have Any Priority!", 404));
        }
    
        // Edit Priority
        let editedPriority = await PriorityDAL.editPriority(id, priority);
    
        // Respond
        res.status(200).json({
          status: "Success",
          data: editedPriority,
        });
    } catch (error) {
        throw error;
    }
}

exports.deletePriority = async (req, res, next) => {
    try {
        // Get Req Body
        const id = req.params.id;
        
        // Check If Priority Exists
        const priority = await PriorityDAL.getPriority(id);
        if (!priority) return next(new AppError("Priority Does Not Exist!"));

        // Delete Priority
        const deletedPriority = await PriorityDAL.deletePriority(id);
    
        // Respond
        res.status(200).json({
          status: "Success",
          data: null,
        });
    } catch (error) {
        throw error;
    }
}

exports.deleteAllPriorities = async (req, res, next) => {
    try {
        // Delete All Priorities
        let deletedPriorities = await PriorityDAL.deleteAllPriorities();
    
        // Respond
        res.status(200).json({
          status: "Success",
          data: deletedPriorities,
        });
    } catch (error) {
        throw error;
    }
}


