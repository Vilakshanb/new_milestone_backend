import questionModel from "../models/question.model";
import riskScoreRelationshipModel from "../models/riskScoreRelationship.model";

export const generateRiskFromScore = async (percentage) => {
  let riskData = await riskScoreRelationshipModel.findOne({});
  console.log(percentage);
  let riskObj = riskData.riskArray.find((el) => el.endPercentage >= percentage); // this is already sorted since that is how it is being stored
  console.log(riskObj);
  let risk = riskObj?.risk ? riskObj?.risk : "";
  return risk;
};

const getMaxFromScoreArray = (arr) => {
  return arr.reduce((acc, el) => (acc > el.score ? acc : el.score), arr[0].score);
};

export const getMaxPossibleScore = async (orgId = "") => {
  let findObj = {};
  const questions = await questionModel.find();
  return questions.reduce((acc, el) => acc + getMaxFromScoreArray(el.answerArr), 0);
};
