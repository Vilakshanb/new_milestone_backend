import { comparePassword, encryptPassword } from "../helpers/bcrypt";
import { ROLES, SUBS } from "../helpers/constant";
import { generateAccessJwt } from "../helpers/jwt";
import subscriptionModel from "../models/subscription.model";
import userModel from "../models/user.model";
import UserFcmTokens from "../models/userFcmTokens";

export const createSubscription = async (req, res, next) => {
  try {
    let subscriptionCheck = await subscriptionModel.findOne({ name: req.body.name }).exec();
    if (subscriptionCheck) {
      throw new Error("Subcription with this name already exists");
    }

    new subscriptionModel(req.body).save();
    res.status(200).json({ message: "Subscription Created" });
  } catch (error) {
    next(error);
  }
};

export const updateSubscription = async (req, res, next) => {
  try {
    let subscriptionCheck = await subscriptionModel.findByIdAndUpdate(req.params.id, req.body).exec();
    if (!subscriptionCheck) {
      throw new Error("Subcription Does not exist");
    }
    res.status(200).json({ message: "Subscription Updated" });
  } catch (error) {
    next(error);
  }
};

export const getAllSubscriptions = async (req, res, next) => {
  try {
    let subscriptionArr = await subscriptionModel.find().lean().exec();
    let currentSubscription = req.user?.subscription;
    if (currentSubscription) {
      subscriptionArr = subscriptionArr.map((el) => {
        let obj = { ...el, purchased: false };
        if (currentSubscription[SUBS.ONBOARDING_ALLOWED] && el.subType == SUBS.ONBOARDING_ALLOWED) {
          obj.purchased = true;
        }
        if (currentSubscription[SUBS.CRM_ALLOWED] && el.subType == SUBS.CRM_ALLOWED) {
          obj.purchased = true;
        }
        if (currentSubscription[SUBS.FINANCE_ALLOWED] && el.subType == SUBS.FINANCE_ALLOWED) {
          obj.purchased = true;
        }

        return obj;
      });
    }
    res.status(200).json({ message: "Subscriptions", data: subscriptionArr });
  } catch (error) {
    next(error);
  }
};

export const getSubscriptionsById = async (req, res, next) => {
  try {
    let subscriptionObj = await subscriptionModel.findById(req.params.id).exec();
    if (!subscriptionObj) {
      throw new Error("Subscription Not Found");
    }
    res.status(200).json({ message: "Subscription", data: subscriptionObj });
  } catch (error) {
    next(error);
  }
};

export const deleteSubscription = async (req, res, next) => {
  try {
    let subscriptionCheck = await subscriptionModel.findByIdAndDelete(req.params.id).exec();
    if (!subscriptionCheck) {
      throw new Error("Subcription Does not exist");
    }
    res.status(200).json({ message: "Subscription Deleted" });
  } catch (error) {
    next(error);
  }
};

export const getCurrentSubscription = async (req, res, next) => {
  try {
    console.log(req.user.subscription, "SUB", req.user);
    res.json({ data: req.user.subscription, message: "GET SUBSCRIPTION" });
  } catch (error) {
    next(error);
  }
};
