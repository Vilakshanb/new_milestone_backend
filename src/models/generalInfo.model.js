import mongoose from "mongoose";
import { INFO_TYPE } from "../helpers/constant";
let generalInfo = mongoose.Schema(
  {
    orgId : String,
    name: String,
    description: String,
    infoType: {
      type: String,
      default: INFO_TYPE.COMPANY_NAME,
    },
  },
  { timestamps: true }
);
export default mongoose.model("GeneralInfo", generalInfo);
