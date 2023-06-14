// this is the subscriptioin that was brought by the user
import mongoose from "mongoose";
import { SUBS } from "../helpers/constant";

let UserSubscription = mongoose.Schema(
  {
    orgId: String, // user  of role type org
    subscriptionId: String,
    subscriptionOrderId: String,

    name: String,
    description: String,

    validityInDays: Number,
    validFrom: Date,
    validTill: Date,

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

export default mongoose.model("UserSubscription", UserSubscription);
