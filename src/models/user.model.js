import mongoose from "mongoose";
import { ROLES } from "../helpers/constant";

let User = mongoose.Schema(
  {
    orgId: String, // the users under the org will have this
    name: String,
    email: String,
    phone: Number,
    password: String,
    parentUserId: String,
    parentUserIdArr: [
      {
        userId: String,
      },
    ],
    role: {
      type: String,
      default: ROLES.USER,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", User);
