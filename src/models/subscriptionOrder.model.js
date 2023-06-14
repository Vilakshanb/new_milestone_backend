import mongoose from "mongoose";
import { SUBS, SUB_VALID_TYPE } from "../helpers/constant";

let SubscriptionOrder = mongoose.Schema(
  {
    userId: String,
    subscriptionId: String,

    userDetails: {
      name: String,
      phone: String,
      email: String,
    },

    subscriptionDetails: {
      name: String,
      description: String,
      validityInDays: Number,

      amount: Number, // amount in ruppees

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

    amount: Number,

    paymentObj: {
      paymentId: String,
      gatwayPaymentObj: Object, // razorpay
      paymentChk: {
        // 0 means payment has not occured ,1 means payment successful, -1 means payment failed ,2 for cod,3,partial paid,4,paid by other
        type: Number, //  this will also be 1 if the payableamount is 0
        default: 0, // if payment is not 1 then it wont be able to proceed
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("SubscriptionOrder", SubscriptionOrder);
