const AppError = require("../../../utils/apperror");
const KnowledgeBaseDAL = require("./dal");

exports.getAllKnowledgeBase = async (req, res, next) => {
  try {
    // get all knowledgeBase.
    const knowledgeBase = await KnowledgeBaseDAL.getAllKnowledgeBase();

    // check if knowledgeBase doesn't exist.
    if (!knowledgeBase) {
      // return custom error
      return next(new AppError("No knowledgeBase data found.", 404));
    }

    res.status(200).json({
      status: "Success",
      data: knowledgeBase,
    });
  } catch (error) {
    throw error;
  }
};

exports.createKnowledgeBase = async (req, res, next) => {
  try {
    // get input data.
    const data = req.body;
    //   create new knowledgeBase
    const knowledgeBase = await KnowledgeBaseDAL.createKnowledgeBase(data);

    res.status(201).json({
      status: "Success",
      data: knowledgeBase,
    });
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

exports.updateOneKnowledgeBase = async (req, res, next) => {
  try {
    const id = req.params.id;
    const updatedFields = req.body;

    // check if knowledgeBase with the given id is found or not?
    const checkKnowledgeBase = await KnowledgeBaseDAL.getKnowledgeBaseById(id);

    if (!checkKnowledgeBase) {
      return next(
        new AppError("KnowledgeBase with the given id is not found.", 404)
      );
    }

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

exports.deleteOneKnowledgeBase = async (req, res, next) => {
  try {
    const id = req.params.id;

    // check if knowledgeBase with the given id is found or not?
    const checkKnowledgeBase = await KnowledgeBaseDAL.getKnowledgeBaseById(id);

    if (!checkKnowledgeBase) {
      return next(
        new AppError("KnowledgeBase with the given id is not found.", 404)
      );
    }

    await KnowledgeBaseDAL.deleteOneKnowledgeBase(id);

    res.status(200).json({
      status: "Success",
      data: null,
    });
  } catch (error) {
    throw error;
  }
};
