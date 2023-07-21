const AppError = require("../../../utils/apperror");
const KnowledgeBaseDAL = require("./dal");

//This method implements to get all knowledge base values
exports.getAllKnowledgebase = async (req, res, next) => {
  try {
    // get all knowledgebase.
    const knowledgebase = await KnowledgeBaseDAL.getAllKnowledgebase();

    // check if knowlegebasee doen't exist.
    if (!knowledgebase) {

      // return custom error
      return next(new AppError("No knowledgebase data found."));
    }

    res.status(200).json({
      status: "List of Knowledge base",
      data: knowledgebase,
    });
  } catch (error) {
    throw error;
  }
};

// This method implements to get knowledge base by id
exports.getKnowlegebaseById = async (req, res, next) => {
  try {

    //get id of knowledge base
    const id = req.params.id;

    // Fetch all knowledge base values by id and check if exist
    const knowledgebase = await KnowledgeBaseDAL.getKnowledgebaseById(id);

    if (!knowledgebase){
      return next(new AppError(`Knowledgebase with ID ${id} is not found`, 404));
    }

    res.status(200).json({
      status: "Success",
      data: knowledgebase,
    });
  } catch (error) {
    throw error
  }
};

// This method implements create new knowledge base
exports.createKnowledgebase = async (req, res, next) => {
  try { 
    // get input data.
    const data = req.body; 

    //Create knowledge base and return the data
    res.status(201).json({
      status: "Success",
      data: await KnowledgeBaseDAL.createKnowledgebase(data),
    });
  } catch (error) {
    throw error;
  }
};

// This method implements to update knowledge base 
exports.updateOneKnowledgebase = async (req, res, next) => {
  try {
    //get knowledge base id
    const id = req.params.id;

    // get request body of knowledge base
    const updatedFields = req.body;

    // check if knowledgebase with the given id is found or not?
    const checkKnowledgebase = await KnowledgeBaseDAL.getKnowledgebaseById(id);

    if (!checkKnowledgebase) {
      return next(
        new AppError(`Knowledgebase with ID  ${id} is not found.`)
      );
    }

    res.status(200).json({
      status: "Success",
      data: await KnowledgeBaseDAL.updateOneKnowledgebase( id, updatedFields ),
    });
  } catch (error) {
    throw error;
  }
};

// This method implements to delete knowledge base by id
exports.deleteOneKnowledgebase = async (req, res, next) => {
  try {
    const id = req.params.id;

    // check if knowledgebase with the given id is found or not?
    const checkKnowledgebase = await KnowledgeBaseDAL.getKnowledgebaseById(id);

    if (!checkKnowledgebase) {
      return next(
        new AppError("Knowledgebase with the given id is not found.")
      );
    }
    res.status(200).json({
      status: "Knowledge base is successfully deleted",
      data: await KnowledgeBaseDAL.deleteOneKnowledgebase(id),
    });
  } catch (error) {
    throw error;
  }
};
