import express from "express";

import * as Client from "../contollers/client.controller";
import { authorizeJwt } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer.middleware";

const router = express.Router();

router.post("/", authorizeJwt, Client.createClient);
router.get("/", authorizeJwt, Client.getClient);
router.get("/getById/:id", authorizeJwt, Client.getById);
router.post("/uploadFile/:id", authorizeJwt, upload.single("file"), Client.uploadFile);
router.delete("/deleteById/:id", authorizeJwt, Client.deleteById);

export default router;
