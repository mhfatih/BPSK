import express from "express";
import * as controller from "../controller/controller.js";
import { authMiddleware } from "../../../middlewares/auth.middleware.js";
import { permission } from "../../../middlewares/permission.middleware.js";

const router = express.Router();

router.get("/:id/territories", authMiddleware, permission("users.read"), controller.getRelations);
router.put("/:id/territories", authMiddleware, permission("users.update"), controller.assignRelations);

export default router;
