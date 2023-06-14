import jwt from "jsonwebtoken";
import { CONFIG } from "../helpers/config";
import User from "../models/user.model";
import { ROLES, SUBS } from "../helpers/constant";
import subscriptionModel from "../models/subscription.model";
import usersubscriptionModel from "../models/usersubscription.model";

export const authorizeJwt = async (req, res, next) => {
  // console.log(req.headers)
  let authorization = req.headers["authorization"];
  let token = authorization && authorization.split("Bearer ")[1];
  if (!token) return res.status(401).json({ message: "Invalid Token" });
  try {
    // Verify token
    const decoded = jwt.verify(token, CONFIG.JWT_ACCESS_TOKEN_SECRET);
    // Add user from payload
    // req.user = decoded;

    // if (decoded.userId) {
    //   req.user.userObj = await User.findById(decoded.userId).lean().exec();
    //   let currentDate = new Date();
    //   let subscriptionArr = [];
    //   if (req.user.userObj?.orgId) {
    //     // find the subscription
    //     subscriptionArr = await usersubscriptionModel
    //       .find({ orgId: req.user.userObj?.orgId, valid: { $lte: currentDate }, validTill: { $gte: currentDate } })
    //       .lean()
    //       .exec();
    //   }
    //   if (req.user.userObj?.role == ROLES.ORG) {
    //     subscriptionArr = await usersubscriptionModel
    //       .find({ orgId: decoded.userId, validFrom: { $lte: currentDate }, validTill: { $gte: currentDate } })
    //       .lean()
    //       .exec();
    //   }
    //   req.user.subscription = {
    //     onboardingAllowed: subscriptionArr.some((el) => el.subType == SUBS.ONBOARDING_ALLOWED),
    //     crmAllowed: subscriptionArr.some((el) => el.subType == SUBS.CRM_ALLOWED),
    //     financeAllowed: subscriptionArr.some((el) => el.subType == SUBS.FINANCE_ALLOWED),
    //     subscriptionArr: subscriptionArr,
    //     orgId: req.user.userObj?.orgId ? req.user.userObj?.orgId : decoded.userId,
    //   };
    // }

    next();
  } catch (e) {
    console.error(e);
    res.status(401).json({ message: "Token is not valid" });
  }
};

/*
 *  subscriptionOrCheck = ["onboardingAllowed","crmAllowed", "financeAllowed"]
 *  subscriptionOrCheck if one of the values is true it will give access
 */
export const authJwtForRoles = (roles = [], subscriptionOrCheck = []) => {
  return async (req, res, next) => {
    try {
      // req.user will be present because of setUserAndUserObj/authorizeJwt
      /**
       * Subscription Check
       */
      if (req.user?.userObj?.role == ROLES.ORG || req.user?.userObj?.orgId) {
        // do subscription check
        if (!req.user.subscription?.subscriptionArr?.length) {
          throw new Error("No Valid Subscription Found");
        }

        // if (req.body && !req.body.orgId) {
        //   req.body.orgId = req.user?.subscription.orgId;
        // }

        let check = false;

        subscriptionOrCheck.forEach((el) => {
          if (req.user?.subscription[el]) {
            check = true;
          }
        });

        if (!check) {
          throw new Error("This is not allowed with your current subscription");
        }
      }

      /**
       * Role check
       */
      if (!roles.includes(req.user?.userObj?.role)) {
        throw new Error("Access Denied");
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: error.message });
    }
  };
};

/*
 *  subscriptionOrCheck = ["onboardingAllowed","crmAllowed", "financeAllowed"]
 *  subscriptionOrCheck if one of the values is true it will give access
 */
export const authForOrgs = (subscriptionOrCheck = []) => {
  return async (req, res, next) => {
    try {
      console.log("AUTH FOR ORGS");
      // req.user will be present because of setUserAndUserObj/authorizeJwt
      /**
       * Subscription Check
       */
      if (req.user?.userObj?.role == ROLES.ORG || req.user?.userObj?.orgId) {
        // do subscription check
        if (!req.user.subscription?.subscriptionArr?.length) {
          throw new Error("No Valid Subscription Found");
        }

        // if (req.body && !req.body.orgId) {
        //   req.body.orgId = req.user?.subscription.orgId;
        // }

        let check = false;

        subscriptionOrCheck.forEach((el) => {
          if (req.user?.subscription[el]) {
            check = true;
          }
        });

        if (!check) {
          throw new Error("This is not allowed with your current subscription");
        }
      }

      console.log("BEFORE NEXT");
      /**
       * Role check
       */

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: error.message });
    }
  };
};

export const setUserAndUserObj = async (req, res, next) => {
  // console.log(req.headers);
  let authorization = req.headers["authorization"];
  if (authorization) {
    let token = authorization && authorization.split("Bearer ")[1];
    if (token) {
      try {
        // Verify token
        const decoded = jwt.verify(token, CONFIG.JWT_ACCESS_TOKEN_SECRET);
        // Add user from payload
        req.user = decoded;
        // console.log("WTF", decoded);
        if (decoded.userId) {
          req.user.userObj = await User.findById(decoded.userId).lean().exec();
          // console.log("USER", req.user.userObj);
          let currentDate = new Date();
          let subscriptionArr = [];
          let orgId;

          if (req.user.userObj.role == ROLES.ADMIN) {
            // console.log("HERE");
          } else {
            if (req.user && req?.user?.userObj && req?.user?.userObj?.orgId) {
              // find the subscription
              orgId = req.user.userObj?.orgId;
              subscriptionArr = await usersubscriptionModel
                .find({ orgId: req.user.userObj?.orgId, validFrom: { $lte: currentDate }, validTill: { $gte: currentDate } })
                .lean()
                .exec();
            }
            if (req?.user?.userObj?.role == ROLES.ORG) {
              orgId = decoded.userId;
              subscriptionArr = await usersubscriptionModel
                .find({ orgId: decoded.userId, validFrom: { $lte: currentDate }, validTill: { $gte: currentDate } })
                .lean()
                .exec();
            }

            req.user.subscription = {
              onboardingAllowed: subscriptionArr.some((el) => el.subType == SUBS.ONBOARDING_ALLOWED),
              crmAllowed: subscriptionArr.some((el) => el.subType == SUBS.CRM_ALLOWED),
              financeAllowed: subscriptionArr.some((el) => el.subType == SUBS.FINANCE_ALLOWED),
              subscriptionArr: subscriptionArr,
              orgId: orgId,
            };

            if (req.body && !req.body.orgId) {
              req.body.orgId = orgId;
            }
          }
        }
      } catch (e) {
        console.error(e);
        // return res.status(401).json({ message: "Invalid Token" });
      }
    }
  }
  // console.log(req.user, "FINAL");
  next();
};
