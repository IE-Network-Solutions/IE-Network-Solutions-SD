const { getConnection } = require("typeorm");
const Comment = require("../../models/Comment");
const UserDAL = require("../users/dal");
const AppError = require("../../../utils/apperror");

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
      const { user, title, description, ticket } = data;

      // Form Connection
      const connection = getConnection();
      const commentRepository = connection.getRepository(Comment);

      // Create Comment
      const newComment = await commentRepository.create({
        title,
        description,
        ticket: ticket,
        created_by: user,
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
      const { user, title, description, ticket } = data;

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
        .select([
          "ticket.id",
          "ticket.subject",
          "comment.id",
          "comment.title",
          "comment.description",
          "comment.created_at",
          "comment.is_private",
          "created_by.id",
          "created_by.first_name",
          "created_by.last_name",
          "created_by.email",
        ])
        .where("ticket.id = :ticket_id", { ticket_id })
        .orderBy("comment.created_at", "DESC")
        .getMany();
      console.log(comments);
      //   return all
      return comments;
    } catch (error) {
      throw error;
    }
  }
  static async getAllClientCommentsOnTicket(ticket_id) {
    try {
      const is_private = false;
      // create connection
      const connection = getConnection();

      // create bridge
      const commentRepository = connection.getRepository(Comment);
      // get comments of the requested ticket
      const comments = await commentRepository
        .createQueryBuilder("comment")
        .leftJoin("comment.created_by", "created_by")
        .leftJoin("comment.ticket", "ticket")
        .select([
          "ticket.id",
          "ticket.subject",
          "comment.id",
          "comment.title",
          "comment.description",
          "comment.created_at",
          "comment.is_private",
          "created_by.id",
          "created_by.first_name",
          "created_by.last_name",
          "created_by.email",
        ])
        .where("ticket.id = :ticket_id", { ticket_id })
        .andWhere("comment.is_private = :is_private", { is_private })
        .orderBy("comment.created_at", "DESC")
        .getMany();
      // console.log(comments);
      //   return all
      return comments;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = CommentDAL;
