import express from "express";
import * as GeneralInfo from "../contollers/GeneralInfo.controller";
import { authForOrgs } from "../middlewares/auth.middleware";
import { SUBS } from "../helpers/constant";

const router = express.Router();

router.post("/", authForOrgs([SUBS.FINANCE_ALLOWED, SUBS.CRM_ALLOWED]), GeneralInfo.createGeneralInfo);
router.get("/", authForOrgs([SUBS.FINANCE_ALLOWED, SUBS.CRM_ALLOWED]), GeneralInfo.getGeneralInfo);
router.get("/getById/:id", authForOrgs([SUBS.FINANCE_ALLOWED, SUBS.CRM_ALLOWED]), GeneralInfo.getById);
router.delete("/deleteById/:id", authForOrgs([SUBS.FINANCE_ALLOWED, SUBS.CRM_ALLOWED]), GeneralInfo.deleteGeneralInfo);
export default router;
