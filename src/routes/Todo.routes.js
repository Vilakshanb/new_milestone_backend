import express from "express";

import * as Todo from "../contollers/Todo.controller";
import { authForOrgs, authorizeJwt } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/", authorizeJwt, Todo.createToDo);
router.get("/", authorizeJwt, Todo.getTodoByUserId);
router.get("/getById/:id", authorizeJwt, Todo.getById);
router.delete("/deleteById/:id", authorizeJwt, Todo.deleteById);
export default router;
