const CommentDAL = require("./dal")
const AppError = require("../../../utils/apperror");
const NoteDAL = require("./dal");

exports.introduction = async (req, res, next) => {
    // Respond
    res.status(200).json({
      status: "Success",
      data: {},
    });
};


exports.getAllNotes = async (req, res, next) => {
    try {
        // Get All Notes
        let notes = await NoteDAL.getAllNotes();
    
        // Respond
        res.status(200).json({
          status: "Success",
          data: notes,
        });
    } catch (error) {
        throw error;
    }
}

exports.getOneNote = async (req, res, next) => {
    // Get ID
    let id = req.params.id;
    let note = await NoteDAL.getOneNote(id);

    // Return If Note Doesn't Exist
    if (!note) return next(new AppError("Note does not exist", 404));

    // Respond
    res.status(200).json({
        status: "Success",
        data: note,
    });
    
}

exports.createNote = async (req, res, next) => {
    try {
        // Get Req Body
        let note = req.body;
        let userID = req.body.userID;

        // Create Note
        let newNote = await NoteDAL.createNote(note, userID);
    
        // Respond
        res.status(200).json({
          status: "Success",
          data: newNote, 
        });
    } catch (error) {
        throw error;
    }
}

exports.editNote = async (req, res, next) => {
    try {
        // Get Req Body
        let id = req.body.id;
        let note = req.body;
    
        // Check If Note Exists
        let checkNote = NoteDAL.getOneNote(id);
        if (!checkNote) {
          return next(new AppError("Note Does Not Exist!", 404));
        }
    
        // Edit Note
        let editedNote = await NoteDAL.editNote(id, note);
    
        // Respond
        res.status(200).json({
          status: "Success",
          data: editedNote,
        });
    } catch (error) {
        throw error;
    }
}

exports.deleteNote = async (req, res, next) => {
    try {
        // Get Req Body
        const id = req.params.id;
        
        // Check If Note Exists
        const note = await NoteDAL.getOneNote(id);
        if (!note) return next(new AppError("Note Does Not Exist!"));

        // Delete Note
        const deletedNote = await NoteDAL.deleteNote(id);
    
        // Respond
        res.status(200).json({
          status: "Success",
          data: null,
        });
    } catch (error) {
        throw error;
    }
}

exports.deleteAllNotes = async (req, res, next) => {
    try {
        // Delete All Notes
        let deletedNotes = await NoteDAL.deleteAllNotes();
    
        // Respond
        res.status(200).json({
          status: "Success",
          data: deletedNotes,
        });
    } catch (error) {
        throw error;
    }
}


