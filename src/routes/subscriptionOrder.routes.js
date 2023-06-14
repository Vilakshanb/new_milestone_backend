import express from "express";
import { addOrder, paymentCallback } from "../contollers/subscriptionorder.contoller";
import { authForOrgs, authorizeJwt } from "../middlewares/auth.middleware";
const router = express.Router();

router.post("/addOrder", authorizeJwt, addOrder);

router.get("/paymentCB/:orderId", authorizeJwt, paymentCallback);

export default router;
