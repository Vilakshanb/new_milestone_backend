import questionModel from "../models/question.model";
import userAnswersModel from "../models/userAnswers.model";
import { generateRiskFromScore, getMaxPossibleScore } from "../utils/userAnswers.util";

export const getAllAnswerData = async (req, res, next) => {
  try {
    let allData = await userAnswersModel.find().exec();
    res.json({ message: "all Data", data: allData });
  } catch (error) {
    next(error);
  }
};

/**
 *
 * @param { answers : [{questionId : string, answerId:string, }], userName : string, email:string } req
 * @param {*} res
 * @param {*} next
 */
export const submitAnswer = async (req, res, next) => {
  try {
    console.log(req.body);
    let questions = await questionModel.find({ _id: { $in: req.body.answerArr.map((el) => el.questionId) } }).exec();

    let answerArr = req.body.answerArr.map((el) => {
      let obj = {
        question: "",
        answer: "",
        score: 0,
      };

      let questionObj = questions.find((elx) => `${elx._id}` == el.questionId);

      if (questionObj) {
        obj.question = questionObj.question;
        let answerObj = questionObj.answerArr.find((ele) => `${ele._id}` == el.answerId);
        if (answerObj) {
          obj.answer = answerObj.answer;
          obj.score = answerObj.score;
        }
      }

      return obj;
    });

    let score = answerArr.reduce((acc, el) => acc + el.score, 0);
    let maxPossibleScore = await getMaxPossibleScore();

    let percentage = parseFloat((score / maxPossibleScore).toPrecision(2)) * 100;
    let riskStatus = await generateRiskFromScore(percentage);

    let finalObj = {
      ...req.body,
      answerArr,
      score,
      percentage,
      maxPossibleScore,
      riskStatus,
    };

    new userAnswersModel(finalObj).save();

    res.json({ message: "Answers Submitted" });
  } catch (error) {
    next(error);
  }
};
