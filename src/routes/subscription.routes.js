import express from "express";
import { createSubscription, deleteSubscription, getAllSubscriptions, getCurrentSubscription, getSubscriptionsById, updateSubscription } from "../contollers/subscription.contoller";
import { authForOrgs, authorizeJwt } from "../middlewares/auth.middleware";
import { SUBS } from "../helpers/constant";
const router = express.Router();

router.post("/", createSubscription);

router.get("/", getAllSubscriptions);

router.get("/getById/:id", getSubscriptionsById);

router.patch("/updateById/:id", updateSubscription);

router.delete("/deleteById/:id", deleteSubscription);

router.get("/getCurrentSubscription", authorizeJwt, authForOrgs([SUBS.CRM_ALLOWED, SUBS.FINANCE_ALLOWED, SUBS.ONBOARDING_ALLOWED]), getCurrentSubscription);

export default router;
