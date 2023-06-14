import mongoose from "mongoose";
import { SUBS } from "../helpers/constant";

let Subscription = mongoose.Schema(
  {
    name: String,
    description: String,
    // validityInMonths: Number,
    validityInDays: Number,

    amount: Number, // amount in ruppees

    // validType: {
    //   type: String,
    //   default: SUB_VALID_TYPE.DAYS,
    // },
    subType: {
      type: String,
      default: SUBS.ONBOARDING_ALLOWED,
    },
    // onboardingAllowed: {
    //   type: Boolean,
    //   default: false,
    // },
    // crmAllowed: {
    //   type: Boolean,
    //   default: false,
    // },
    // financeAllowed: {
    //   type: Boolean,
    //   default: false,
    // },
  },
  { timestamps: true }
);

export default mongoose.model("Subscription", Subscription);
