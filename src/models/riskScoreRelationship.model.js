import mongoose from "mongoose";

let RiskScoreRelationship = mongoose.Schema(
  {
    orgId : String,
    riskArray: [
      {
        endPercentage: Number,
        risk: {
          type: String,
          default: "Moderate",
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("RiskScoreRelationship", RiskScoreRelationship);
