import mongoose from "mongoose";

let UserAnswers = mongoose.Schema(
  {
    orgId: String,
    name: String,
    email: String,
    phone: String,
    answerArr: [
      {
        question: String,
        answer: String,
        score: Number,
      },
    ],
    score: Number,
    maxPossibleScore: Number,
    percentage: Number,
    riskStatus: String,
  },
  { timestamps: true }
);

export default mongoose.model("UserAnswers", UserAnswers);
