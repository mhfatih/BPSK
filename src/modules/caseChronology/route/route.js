import express from "express";
import * as controller from "../controller/controller.js";
import { authMiddleware } from "../../../middlewares/auth.middleware.js";
import { permission } from "../../../middlewares/permission.middleware.js";

const router = express.Router();

router.get("/:id/chronology", authMiddleware, permission("cases.read"), controller.getData);
router.put("/:id/chronology", authMiddleware, permission("cases.update"), controller.update);

export default router;
