import express from "express";
import * as FixedDeposit from "../contollers/fixedDeposit.controller";
import { authForOrgs, authorizeJwt } from "../middlewares/auth.middleware";
import { SUBS } from "../helpers/constant";

const router = express.Router();

router.post("/", authorizeJwt, authForOrgs([SUBS.FINANCE_ALLOWED]), FixedDeposit.createFd);
router.get("/", authorizeJwt, authForOrgs([SUBS.FINANCE_ALLOWED]), FixedDeposit.getFd);
router.get("/getById/:id", authorizeJwt, authForOrgs([SUBS.FINANCE_ALLOWED]), FixedDeposit.getById);
router.delete("/deleteById/:id", authorizeJwt, authForOrgs([SUBS.FINANCE_ALLOWED]), FixedDeposit.deleteFdById);

export default router;
