import { createPaymentOrder } from "../helpers/razorpay";
import subscriptionModel from "../models/subscription.model";
import subscriptionOrderModel from "../models/subscriptionOrder.model";
import userModel from "../models/user.model";
import usersubscriptionModel from "../models/usersubscription.model";

export const addOrder = async (req, res, next) => {
  try {
    let userObj = await userModel.findById(req.body.userId).lean().exec();
    if (!userObj) {
      throw new Error("User Not Found");
    }

    let subscriptionObj = await subscriptionModel.findById(req.body.subscriptionId).lean().exec();
    if (!subscriptionObj) {
      throw new Error("Subscription Not Found");
    }

    let finalObj = {
      userId: userObj._id,
      subscriptionId: subscriptionObj._id,

      userDetails: {
        name: userObj.name,
        phone: userObj.phone,
        email: userObj.email,
      },

      amount: subscriptionObj.amount,

      subscriptionDetails: {
        name: subscriptionObj.name,
        description: subscriptionObj.description,
        validityInDays: subscriptionObj.validityInDays,
        amount: subscriptionObj.amount, // amount in ruppees
        subType: subscriptionObj.subType,
        // onboardingAllowed: subscriptionObj.onboardingAllowed,
        // crmAllowed: subscriptionObj.crmAllowed,
        // financeAllowed: subscriptionObj.financeAllowed,
      },
    };

    finalObj.amount = subscriptionObj.amount;

    let orderObj = await new subscriptionOrderModel(finalObj).save();

    if (!orderObj) {
      throw new Error("Could not place order something went wrong !");
    }

    let options = {
      amount: finalObj.amount * 100,
      currency: "INR",
      receipt: new Date().getTime(),
    };

    await subscriptionOrderModel.findByIdAndUpdate(orderObj._id, { "paymentObj.gatwayPaymentObj": orderPaymentObj }).lean().exec();
    let orderPaymentObj = await createPaymentOrder(options);
    res.status(200).json({ message: "Order Created", data: orderPaymentObj, orderId: orderObj._id, success: true });
  } catch (err) {
    next(err);
  }
};

export const paymentCallback = async (req, res, next) => {
  try {
    /**
     *
     *
     *
     *
     *  if there is no payment id throw error
     *
     *
     *
     */

    // send all details in the req.query
    console.log(req.params, req.query);
    let orderObj = await subscriptionOrderModel
      .findByIdAndUpdate(req.params.orderId, { "paymentObj.paymentChk": 1, $push: { "paymentObj.gatewayPaymentArr": req.query }, active: true })
      .lean()
      .exec();

    if (!orderObj) {
      throw new Error("Order Not Found");
    }

    // find existing valid subscriptions

    let currentDate = new Date();

    let validFrom = currentDate;
    let validTill = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

    let validSubscription = await usersubscriptionModel
      .findOne({
        orgId: orderObj.userId,
        validTill: { $gte: currentDate },
        subType: orderObj.subscriptionDetails.subType,
      })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    if (validSubscription) {
      validFrom = validSubscription.validTill;
      validTill = new Date(validSubscription.validTill);
    }
    validTill.setDate(validTill.getDate() + orderObj.subscriptionDetails.validityInDays + 1);
    validTill.setTime(validTill.getTime() - 1);

    let obj = {
      orgId: orderObj.userId,
      subscriptionId: orderObj.subscriptionId,
      subscriptionOrderId: orderObj._id,

      name: orderObj.subscriptionDetails.name,
      description: orderObj.subscriptionDetails.description,

      validityInDays: orderObj.subscriptionDetails.validityInDays,
      validTill: validTill,
      validFrom: validFrom,

      subType: orderObj.subscriptionDetails.subType,
      // onboardingAllowed: orderObj.subscriptionDetails.onboardingAllowed,
      // crmAllowed: orderObj.subscriptionDetails.crmAllowed,
      // financeAllowed: orderObj.subscriptionDetails.financeAllowed,
    };

    console.log(obj);

    await new usersubscriptionModel(obj).save();

    res.json({ message: "Subscription Purchased", success: true });
  } catch (err) {
    next(err);
  }
};
