const CommentDAL = require("./dal");
const AppError = require("../../../utils/apperror");
const UserDAL = require("../../apis/users/dal");
const Comment = require("../../models/Comment");
const TicketDAL = require("../tickets/dal");
const config = require("../../../utils/configs");
const sendEmail = require("../../../utils/sendEmail");
const NotificationDAL = require("../notifications/dal");

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
};

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
};

exports.createComment = async (req, res, next) => {
  try {
    // Get Req Body
    const comment = req.body;
    const user = req.user;
    comment.user = user;
    const emailTo = comment.emailTo;
    const emailCc = comment.emailCc;
    const from = config.company_email;

    // check if ticket exist or not
    const ticket = await TicketDAL.getTicketById(comment.ticket_id);
    if (!ticket) {
      return next(new AppError("ticket does not exist", 404));
    }
    comment.ticket = ticket;
    assigned_users = ticket.assigned_users;

    // if user is client check there authority
    if (user.user_type == "client") {
      client_id = ticket.client.id;
      if (user.id !== client_id) {
        return next(
          new AppError("unauthorized to comment on the given ticket ")
        );
      }
    }

    if (user.user_type == "employee") {
      // check if the user is valid to comment on the ticket
      const objectExists = assigned_users.some((item) => item.id === user.id);

      if (!objectExists) {
        new AppError("unauthorized to comment on the given ticket ");
      }
    }

    // Create Comment
    const newComment = await CommentDAL.createComment(comment);
    const sendmail = await sendEmail(
      from,
      emailTo,
      newComment.title,
      newComment.description,
      emailCc
    );
    // Respond
    res.status(200).json({
      status: "Success",
      data: newComment,
    });
  } catch (error) {
    throw error;
  }
};

exports.createPrivateComment = async (req, res, next) => {
  try {
    // Get Req Body
    const comment = req.body;
    const user = req.user;
    comment.user = user;
    const emailTo = comment.emailTo;
    const emailCc = comment.emailCc;
    const from = config.company_email;

    // check if ticket exist or not
    const ticket = await TicketDAL.getTicketById(comment.ticket_id);
    if (!ticket) {
      return next(new AppError("ticket does not exist", 404));
    }
    comment.ticket = ticket;
    assigned_users = ticket.assigned_users;

    // if user is client check there authority
    if (user.user_type == "client") {
      return next(
        new AppError(
          "unauthorized to comment private replay on the given ticket"
        )
      );
    }

    if (user.user_type == "employee") {
      // check if the user is valid to comment on the ticket
      const objectExists = assigned_users.some((item) => item.id === user.id);

      if (!objectExists) {
        new AppError("unauthorized to comment on the given ticket ");
      }
    }

    // Create Comment
    const newComment = await CommentDAL.createPrivateComment(comment);
    const sendmail = await sendEmail(
      from,
      emailTo,
      newComment.title,
      newComment.description,
      emailCc
    );

    await NotificationDAL.createNotification({
      title: "Comment",
      from: from,
      to: emailTo,
      message: "This is Notification is concerned with private comment",
      type: "",
      isRead: false,
      created_at: new Date(),
      created_by: req.user.id,
      CCUsers: emailCc
    }
    )
    // Respond
    res.status(200).json({
      status: "Success",
      data: newComment,
    });
  } catch (error) {
    throw error;
  }
};

// create escalation on a ticket
exports.createEscalation = async (req, res, next) => {
  try {
    // Get Req Body
    const comment = req.body;
    const user = req.user;
    comment.user = user;
    const emailTo = comment.emailTo;
    const emailCc = comment.emailCc;
    const from = config.company_email;
    console.log("from email", from)
    // check if ticket exist or not
    const ticket = await TicketDAL.getTicketById(comment.ticket_id);
    if (!ticket) {
      return next(new AppError("ticket does not exist", 404));
    }

    comment.ticket = ticket;
    assigned_users = ticket.assigned_users;

    // if user is client check there authority
    if (user.user_type == "client") {
      return next(
        new AppError(
          "unauthorized to comment private replay on the given ticket"
        )
      );
    }

    if (user.user_type == "employee") {
      // check if the user is valid to comment on the ticket
      const objectExists = assigned_users.some((item) => item.id === user.id);

      if (!objectExists) {
        new AppError("unauthorized to comment on the given ticket ");
      }
    }

    // Create Comment
    const newComment = await CommentDAL.createEscalationComment(comment);
    const sendmail = await sendEmail(
      from,
      emailTo,
      newComment.title,
      newComment.description,
      emailCc
    );

    await NotificationDAL.createNotification({
      title: "Escalation",
      from: from,
      to: emailTo,
      message: "This is Notification is concerned with ticket escalation",
      type: "",
      isRead: false,
      created_at: new Date(),
      created_by: req.user.id,
      CCUsers: emailCc
    }
    )
    // Respond
    res.status(200).json({
      status: "Success",
      data: newComment,
    });
  } catch (error) {
    throw error;
  }
};

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
};

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
};

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
};

exports.getCommentByTicket = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = req.user;
    let comments = [];
    // check ticket
    const ticket = await TicketDAL.getTicketById(id);
    if (!ticket) {
      return next(new AppError("ticket does not exist", 404));
    }
    console.log(ticket);

    if (user.user_type == "client") {
      // get all comments for client
      comments = await CommentDAL.getAllClientCommentsOnTicket(id);
    } else {
      // get all comments
      comments = await CommentDAL.getAllCommentsOnTicket(id);
    }

    res.status(200).json({
      status: "Success",
      data: comments,
    });
  } catch (error) {
    throw error;
  }
};
