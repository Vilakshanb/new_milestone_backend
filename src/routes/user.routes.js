import express from "express";
import { deleteUserById, getAllUsers, getUserById, login, loginAgent, register, registerUserFcmToken, updateUserById } from "../contollers/user.contoller";
import { authorizeJwt } from "../middlewares/auth.middleware";
const router = express.Router();

router.get("/", authorizeJwt, getAllUsers);

router.get("/getById/:id", getUserById);

router.patch("/updateById/:id", updateUserById);

router.delete("/deleteById/:id", deleteUserById);

router.post("/login", login);
router.post("/loginAgent", loginAgent);

router.post("/register", register);

router.post("/registerUserFcmTokens", registerUserFcmToken);

export default router;
