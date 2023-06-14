import questionModel from "../models/question.model";

export const getAllQuestionData = async (req, res, next) => {
  try {
    let allData = await questionModel.find().exec();
    res.json({ message: "all Data", data: allData });
  } catch (error) {
    next(error);
  }
};

export const getQuestionById = async (req, res, next) => {
  try {
    let question = await questionModel.findById(req.params.id).exec();
    if (!question) throw new Error("Question not found");
    res.json({ message: "Question get", data: question });
  } catch (error) {
    next(error);
  }
};

export const updateQuestionById = async (req, res, next) => {
  try {
    let Question = await questionModel.findByIdAndUpdate(req.params.id, req.body).exec();
    if (!Question) throw new Error("Question not found");
    res.json({ message: "Question Updated" });
  } catch (error) {
    next(error);
  }
};

export const deleteQuestionById = async (req, res, next) => {
  try {
    let question = await questionModel.findByIdAndDelete(req.params.id).exec();
    if (!question) throw new Error("Question not found");
    res.json({ message: "Question deleted" });
  } catch (error) {
    next(error);
  }
};

export const addQuestion = async (req, res, next) => {
  try {
    await new questionModel(req.body).save();
    res.status(201).json({ message: "Question Created" });
  } catch (error) {
    next(error);
  }
};
