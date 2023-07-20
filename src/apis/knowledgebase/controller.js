const AppError = require("../../../utils/apperror");
const KnowledgeBaseDAL = require("./dal");
const { v4: uuidv4 } = require("uuid");

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
      status: "Success",
      data: knowledgebase,
    });
  } catch (error) {
    throw error;
  }
};

exports.createKnowledgebase = async (req, res, next) => {
  try {
    // generate uuid.
    const uuid = uuidv4();
    // get input data.
    const data = req.body;
    // merge uuid to input data.
    data.id = uuid;
    //   create new knowlegebase
    const knowledgebase = await KnowledgeBaseDAL.createKnowledgebase(data);

    res.status(201).json({
      status: "Success",
      data: knowledgebase,
    });
  } catch (error) {
    throw error;
  }
};

exports.getKnowlegebaseById = async (req, res, next) => {
  try {
    const id = req.params.id;

    const knowledgebase = await KnowledgeBaseDAL.getKnowlegebaseById(id);

    if (!knowledgebase)
      return next(new AppError("Knowledgebase with the given id is not found"));

    res.status(200).json({
      status: "Success",
      data: knowledgebase,
    });
  } catch (error) {
    throw error;
  }
};

exports.updateOneKnowledgebase = async (req, res, next) => {
  try {
    const id = req.params.id;
    const updatedFields = req.body;

    // check if knowledgebase with the given id is found or not?
    const checkKnowledgebase = await KnowledgeBaseDAL.getKnowlegebaseById(id);

    if (!checkKnowledgebase) {
      return next(
        new AppError("Knowledgebase with the given id is not found.")
      );
    }

    const knowledgebase = await KnowledgeBaseDAL.updateOneKnowledgebase(
      id,
      updatedFields
    );

    res.status(200).json({
      status: "Success",
      data: knowledgebase,
    });
  } catch (error) {
    throw error;
  }
};

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

    await KnowledgeBaseDAL.deleteOneKnowledgebase(id);

    res.status(200).json({
      status: "Success",
      data: null,
    });
  } catch (error) {
    throw error;
  }
};
