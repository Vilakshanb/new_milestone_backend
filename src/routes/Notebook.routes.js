import express from "express";

import * as Notebook from "../contollers/Notebook.controller";
import { authForOrgs, authorizeJwt } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/", authorizeJwt, Notebook.createNotebookFolder);
router.get("/", authorizeJwt, Notebook.getFolderByUserId);
router.get("/getById/:id", authorizeJwt, Notebook.getById);
router.delete("/deleteById/:id", authorizeJwt, Notebook.deleteById);
router.patch("/updateById/:id", authorizeJwt, Notebook.updateById);
export default router;
