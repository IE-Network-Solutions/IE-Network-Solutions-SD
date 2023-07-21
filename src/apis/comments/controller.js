const CommentDAL = require("./dal")
const AppError = require("../../../utils/apperror");

exports.introduction = async (req, res, next) => {
    // Respond
    res.status(200).json({
      status: "Success",
      data: {},
    });
};


exports.getAllComments = async (req, res, next) => {
    try {
        // Get All Comments
        let comments = await CommentDAL.getAllComments();
    
        // Respond
        res.status(200).json({
          status: "Success",
          data: comments,
        });
    } catch (error) {
        throw error;
    }
}

exports.getOneComment = async (req, res, next) => {
    // Get ID
    let id = req.params.id;
    let comment = await CommentDAL.getOneComment(id);

    // Return If User Doesn't Exist
    if (!comment) return next(new AppError("Comment does not exist", 404));

    // Respond
    res.status(200).json({
        status: "Success",
        data: comment,
    });
    
}

exports.createComment = async (req, res, next) => {
    try {
        // Get Req Body
        let comment = req.body;

        // Create Comment
        let newComment = await CommentDAL.createComment(comment);
    
        // Respond
        res.status(200).json({
          status: "Success",
          data: newComment,
        });
    } catch (error) {
        throw error;
    }
}

exports.editComment = async (req, res, next) => {
    try {
        // Get Req Body
        let id = req.body.id;
        let comment = req.body;
    
        // Check If Comment Exists
        let checkComment = CommentDAL.getOneComment(id);
        if (!checkComment) {
          return next(new AppError("Comment Does Not Exist!", 404));
        }
    
        // Edit User
        let editedComment = await CommentDAL.editUser(id, comment);
    
        // Respond
        res.status(200).json({
          status: "Success",
          data: editedComment,
        });
    } catch (error) {
        throw error;
    }
}

exports.deleteComment = async (req, res, next) => {
    try {
        // Get Req Body
        const id = req.params.id;
        
        // Check If Comment Exists
        const user = await CommentDAL.getOneComment(id);
        if (!user) return next(new AppError("Comment Does Not Exist!"));

        // Delete Comment
        const deletedComment = await CommentDAL.deleteComment(id);
    
        // Respond
        res.status(200).json({
          status: "Success",
          data: null,
        });
    } catch (error) {
        throw error;
    }
}

exports.deleteAllComments = async (req, res, next) => {
    try {
        // Delete All Comments
        let deletedComments = await CommentDAL.deleteAllComments();
    
        // Respond
        res.status(200).json({
          status: "Success",
          data: deletedComments,
        });
    } catch (error) {
        throw error;
    }
}


