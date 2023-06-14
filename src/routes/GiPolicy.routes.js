import express from "express";
import * as GiPolicy from "../contollers/GiPolicy.controller";
import { upload } from "../middlewares/multer.middleware";
import { authForOrgs, authorizeJwt } from "../middlewares/auth.middleware";
import { SUBS } from "../helpers/constant";

const router = express.Router();

router.post("/", authorizeJwt, authForOrgs([SUBS.FINANCE_ALLOWED]), GiPolicy.createGiPolicy);
router.get("/", authorizeJwt, authForOrgs([SUBS.FINANCE_ALLOWED]), GiPolicy.getGiPolicy);
router.get("/getById/:id", authorizeJwt, authForOrgs([SUBS.FINANCE_ALLOWED]), GiPolicy.getById);
router.post("/uploadFile/:id", authorizeJwt, authForOrgs([SUBS.FINANCE_ALLOWED]), upload.single("file"), GiPolicy.uploadFile);

router.delete("/deleteById/:id", authorizeJwt, authForOrgs([SUBS.FINANCE_ALLOWED]), GiPolicy.deleteById);

export default router;
