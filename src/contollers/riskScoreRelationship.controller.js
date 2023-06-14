import riskScoreRelationshipModel from "../models/riskScoreRelationship.model";
import { seedRisk } from "../seeder";

export const getRiskScoreData = async (req, res, next) => {
  try {
    console.log("req.user", req.user);
    let findObj = {};
    if (req.user.subscription?.orgId) {
      findObj = {
        orgId: req.user.subscription?.orgId,
      };
    } else {
      findObj = {
        orgId: { $exists: false },
      };
    }

    let allData = await riskScoreRelationshipModel.findOne(findObj).exec();
    res.json({ message: "Data", data: allData });
  } catch (error) {
    next(error);
  }
};

export const updateRiskScoreData = async (req, res, next) => {
  try {
    let findObj = {};
    if (req.user.subscription?.orgId) {
      findObj = {
        orgId: req.user.subscription?.orgId,
      };
    } else {
      findObj = {
        orgId: { $exists: false },
      };
    }
    let risk = await riskScoreRelationshipModel.findOneAndUpdate(findObj, { riskArray: req.body.riskArray }).exec();
    if (!risk) {
      await seedRisk(req.user.subscription?.orgId);
      risk = await riskScoreRelationshipModel.findOneAndUpdate(findObj, { riskArray: req.body.riskArray }).exec();
    }
    res.json({ message: "Updated" });
  } catch (error) {
    next(error);
  }
};
