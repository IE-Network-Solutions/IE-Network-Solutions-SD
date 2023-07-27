const { getConnection } = require("typeorm");
const Note = require("../../models/Note");
const UserDAL = require("../users/dal");

class NoteDAL {
    // Get All Notes
    static async getAllNotes() {
        try {
            // Form Connection
            const connection = getConnection();
            const noteRepository = connection.getRepository(Note);

            // Get Data
            const notes = await noteRepository.find();
            return notes;
        } catch (error) {
            throw error;
        }
    }

    // Get One Note
    static async getOneNote(data) {
        const id = data;
        try {
            // Form Connection
            const connection = getConnection();
            const noteRepository = connection.getRepository(Note);

            // Get Data
            const foundNote = await noteRepository.findBy({ id: id });
            return foundNote;
        } catch (error) {
            throw error;
        }
    }

    // Create New Note
    static async createNote(data, userID) {
        try {
            // Get User 
            const user_ID = userID;
            const user = await UserDAL.getOneUser(user_ID);
            if(!user) return next(new AppError("User Does Not Exist",404));

            // Create Note Object
            const note = data;
            note.created_by = user;

            // Form Connection
            const connection = getConnection();
            const noteRepository = connection.getRepository(Note);

            // Create Note
            const newNote = await noteRepository.create(note);
            await noteRepository.save(newNote);
            return newNote;
        } catch (error) {
            throw error;
        }
    }

    // Edit Note
    static async editNote(id, data) {
        try {
            // Create Note Objects
            const idNote = id;
            const updatedFields = data;

            // Form Connection
            const connection = getConnection();
            const noteRepository = connection.getRepository(Note);

            const note = await noteRepository.findOneBy({ id: idNote });

            // Update User
            // Update only the specified fields in the updatedFields object
            Object.keys(updatedFields).forEach((field) => {
                if (field in note) {
                    note[field] = updatedFields[field];
                }
            });
            await noteRepository.save(note);

            return note;
        } catch (error) {
            throw error;
        }
    }

    // Delete One Note
    static async deleteNote(id) {
        try {
            // Form Connection
            const connection = getConnection();
            const noteRepository = connection.getRepository(Note);

            // Delete User
            const deletedUser = await noteRepository.delete({ id: id });

            return "Note Deleted Successfully!";
        } catch (error) {
            throw error;
        }
    }

    // Delete All Notes
    static async deleteAllNotes() {
        try {
            // Form Connection
            const connection = getConnection();
            const noteRepository = connection.getRepository(Note);

            // Get All Notes
            const allNotes = await noteRepository.find();

            // Delete All Notes
            const deletedNotes = await noteRepository.delete(allNotes);
            return deletedNotes;
        } catch (error) {
            throw error;
        }
    }

}

module.exports = NoteDAL;