import mongoose from "mongoose";

let Question = mongoose.Schema(
  {
    orgId : String,
    question: String,
    answerArr: [
      {
        answer: String,
        score: Number,
      },
    ],
    // correctAnswer: String,
  },
  { timestamps: true }
);

export default mongoose.model("Question", Question);
