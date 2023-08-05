const { getConnection } = require("typeorm");
const Comment = require("../../models/Comment");
const UserDAL = require("../users/dal");
const AppError = require("../../../utils/apperror");
const sendEmail = require("../../../utils/sendEmail");

class CommentDAL {
  // Get All Comments
  static async getAllComments() {
    try {
      // Form Connection
      const connection = getConnection();
      const commentRepository = connection.getRepository(Comment);

      // Get Data
      const comments = await commentRepository.find();
      return comments;
    } catch (error) {
      throw error;
    }
  }

  // Get One Comment
  static async getOneComment(data) {
    const id = data;
    try {
      // Form Connection
      const connection = getConnection();
      const commentRepository = connection.getRepository(Comment);

      // Get Data
      const foundComment = await commentRepository.findBy({ id: id });
      return foundComment;
    } catch (error) {
      throw error;
    }
  }

  // Create New Comment
  static async createComment(data) {
    try {
      // Get User
      const { user, title, description, ticket, emailTo, emailCc } = data;

      // Form Connection
      const connection = getConnection();
      const commentRepository = connection.getRepository(Comment);

      // Create Comment
      const newComment = await commentRepository.create({
        title,
        description,
        ticket: ticket,
        created_by: user,
        emailTo: emailTo,
        emailCc: emailCc,
      });
      await commentRepository.save(newComment);

      // return new comment
      return newComment;
    } catch (error) {
      throw error;
    }
  }

  // Create Private Comment
  static async createPrivateComment(data) {
    try {
      // Get User
      const { user, title, description, ticket, emailTo, emailCc } = data;

      // Form Connection
      const connection = getConnection();
      const commentRepository = connection.getRepository(Comment);

      // Create Comment
      const newComment = await commentRepository.create({
        title,
        description,
        is_private: true,
        ticket: ticket,
        created_by: user,
        emailTo: emailTo,
        emailCc: emailCc,
      });
      await commentRepository.save(newComment);

      // return new comment
      return newComment;
    } catch (error) {
      throw error;
    }
  }

  // Create escalation
  static async createEscalationComment(data) {
    try {
      // Get User
      const { user, title, description, ticket, emailTo, emailCc } = data;

      // Form Connection
      const connection = getConnection();
      const commentRepository = connection.getRepository(Comment);

      // Create Comment
      const newComment = await commentRepository.create({
        title,
        description,
        is_escalation: true,
        ticket: ticket,
        created_by: user,
        emailTo: emailTo,
        emailCc: emailCc,
      });
      await commentRepository.save(newComment);

      // return new comment
      return newComment;
    } catch (error) {
      throw error;
    }
  }

  // Edit Comment
  static async editUser(id, data) {
    try {
      // Create Comment Objects
      const idComment = id;
      const updatedFields = data;

      // Form Connection
      const connection = getConnection();
      const commentRepository = connection.getRepository(Comment);

      const comment = await commentRepository.findOneBy({ id: idComment });

      // Update User
      // Update only the specified fields in the updatedFields object
      Object.keys(updatedFields).forEach((field) => {
        if (field in comment) {
          comment[field] = updatedFields[field];
        }
      });
      await commentRepository.save(comment);

      return comment;
    } catch (error) {
      throw error;
    }
  }

  // Delete One Comment
  static async deleteComment(id) {
    try {
      // Form Connection
      const connection = getConnection();
      const commentRepository = connection.getRepository(Comment);

      // Delete User
      const deletedUser = await commentRepository.delete({ id: id });

      return "Comment Deleted Successfully!";
    } catch (error) {
      throw error;
    }
  }

  // Delete All Comments
  static async deleteAllComments() {
    try {
      // Form Connection
      const connection = getConnection();
      const commentRepository = connection.getRepository(Comment);

      // Get All Comments
      const allComments = await commentRepository.find();

      // Delete All Comments
      const deletedComments = await commentRepository.delete(allComments);
      return deletedComments;
    } catch (error) {
      throw error;
    }
  }

  // get all comments
  static async getAllCommentsOnTicket(ticket_id) {
    try {
      // create connection
      const connection = getConnection();

      // create bridge
      const commentRepository = connection.getRepository(Comment);
      // get comments of the requested ticket
      const comments = await commentRepository
        .createQueryBuilder("comment")
        .leftJoin("comment.created_by", "created_by")
        .leftJoin("comment.ticket", "ticket")
        .leftJoin("ticket.client", "client")
        .select([
          "ticket.id",
          "ticket.subject",
          "client.id",
          "client.first_name",
          "client.last_name",
          "client.email",
          "comment.id",
          "comment.title",
          "comment.description",
          "comment.created_at",
          "comment.is_private",
          "comment.is_escalation",
          "comment.emailTo",
          "comment.emailCc",
          "comment.emailCc",
          "created_by.id",
          "created_by.first_name",
          "created_by.last_name",
          "created_by.email",
        ])
        .where("ticket.id = :ticket_id", { ticket_id })
        .orderBy("comment.created_at", "DESC")
        .getMany();
      return comments;
    } catch (error) {
      throw error;
    }
  }

  // get all comments except private ones
  static async getAllClientCommentsOnTicket(ticket_id) {
    try {
      const is_private = false;
      const is_escalation = false;
      // create connection
      const connection = getConnection();

      // create bridge
      const commentRepository = connection.getRepository(Comment);
      // get comments of the requested ticket
      const comments = await commentRepository
        .createQueryBuilder("comment")
        .leftJoin("comment.created_by", "created_by")
        .leftJoin("comment.ticket", "ticket")
        .leftJoin("ticket.client", "client")
        .select([
          "ticket.id",
          "ticket.subject",
          "client.id",
          "client.first_name",
          "client.last_name",
          "client.email",
          "comment.id",
          "comment.title",
          "comment.description",
          "comment.created_at",
          "comment.is_private",
          "comment.is_escalation",
          "comment.emailTo",
          "comment.emailCc",
          "created_by.id",
          "created_by.first_name",
          "created_by.last_name",
          "created_by.email",
        ])
        .where("ticket.id = :ticket_id", { ticket_id })
        .andWhere("comment.is_private = :is_private", { is_private })
        .andWhere("comment.is_escalation = :is_escalation", { is_escalation })
        .orderBy("comment.created_at", "DESC")
        .getMany();
      // console.log(comments);
      //   return all
      return comments;
    } catch (error) {
      throw error;
    }
  }

  // get only escalations
  static async getAllTicketEscalations(ticket_id) {
    try {
      const is_escalation = true;
      // create connection
      const connection = getConnection();

      // create bridge
      const commentRepository = connection.getRepository(Comment);
      // get comments of the requested ticket
      const comments = await commentRepository
        .createQueryBuilder("comment")
        .leftJoin("comment.created_by", "created_by")
        .leftJoin("comment.ticket", "ticket")
        .leftJoin("ticket.client", "client")
        .select([
          "ticket.id",
          "ticket.subject",
          "client.id",
          "client.first_name",
          "client.last_name",
          "client.email",
          "comment.id",
          "comment.title",
          "comment.description",
          "comment.created_at",
          "comment.is_private",
          "comment.is_escalation",
          "comment.emailTo",
          "comment.emailCc",
          "created_by.id",
          "created_by.first_name",
          "created_by.last_name",
          "created_by.email",
        ])
        .where("ticket.id = :ticket_id", { ticket_id })
        .andWhere("comment.is_escalation = :is_escalation", { is_escalation })
        .orderBy("comment.created_at", "DESC")
        .getMany();
      return comments;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = CommentDAL;
