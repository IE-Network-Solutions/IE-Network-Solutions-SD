const AppError = require("../../../utils/apperror");
const KnowledgeBaseDAL = require("./dal");

//This method implements to get all knowledge base values
exports.getAllKnowledgebase = async (req, res, next) => {
  try {
    // get all knowledgeBase.
    const knowledgeBase = await KnowledgeBaseDAL.getAllKnowledgeBase();

    // check if knowlegebasee doen't exist.
    if (!knowledgeBase) {

      // return custom error
      return next(new AppError("No knowledgeBase data found.", 404));
    }

    res.status(200).json({
      status: "List of Knowledge base",
      data: knowledgeBase,
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
      data: knowledgeBase,
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

    //   create new knowledgeBase
    const knowledgeBase = await KnowledgeBaseDAL.createKnowledgebase(data);

    //Create knowledge base and return the data
    res.status(201).json({
      status: "Success",
      data: knowledgeBase  });
  } catch (error) {
    throw error;
  }
};

exports.getKnowledgeBaseById = async (req, res, next) => {
  try {
    const id = req.params.id;

    const knowledgeBase = await KnowledgeBaseDAL.getKnowledgeBaseById(id);

    if (!knowledgeBase)
      return next(
        new AppError("KnowledgeBase with the given id is not found", 404)
      );

    res.status(200).json({
      status: "Success",
      data: knowledgeBase,
    });
  } catch (error) {
    throw error;
  }
};

// This method implements to update knowledge base 
exports.updateOneKnowledgebase = async (req, res, next) => {
try{
    //get knowledge base id
    const id = req.params.id;

    // get request body of knowledge base
    const updatedFields = req.body;

    // check if knowledgeBase with the given id is found or not?
    const checkKnowledgeBase = await KnowledgeBaseDAL.getKnowledgeBaseById(id);

    if (!checkKnowledgeBase) {
      return next(
        new AppError(`Knowledgebase with ID  ${id} is not found.`)
      );
    }

    res.status(200).json({
      status: "Success",
      data: await KnowledgeBaseDAL.updateOneKnowledgebase( id, updatedFields ),
    }
      );
  

    const knowledgeBase = await KnowledgeBaseDAL.updateOneKnowledgeBase(
      id,
      updatedFields
    );

    res.status(200).json({
      status: "Success",
      data: knowledgeBase,
    });
  } catch (error) {
    throw error;
  }
};

// This method implements to delete knowledge base by id
exports.deleteOneKnowledgebase = async (req, res, next) => {

  try {
    const id = req.params.id;

    // check if knowledgeBase with the given id is found or not?
    const checkKnowledgeBase = await KnowledgeBaseDAL.getKnowledgeBaseById(id);

    if (!checkKnowledgeBase) {
      return next(
        new AppError("KnowledgeBase with the given id is not found.", 404)
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
