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
            // Create Comment Object
            const comment = data;

            // Form Connection
            const connection = getConnection();

            // get user 
            const user = UserDAL.getOneUser(user_id);
            if(!user) return next(new AppError("user does not exist",404));

            
            const commentRepository = connection.getRepository(Comment);

            // Create Comment
            const newComment = await commentRepository.create({comment,created_by: user});
            await commentRepository.save(newComment);
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

}

module.exports = CommentDAL;