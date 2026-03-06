import express from "express";
import * as controller from "../controller/controller.js";
import { authMiddleware } from "../../../middlewares/auth.middleware.js";
import { permission } from "../../../middlewares/permission.middleware.js";

const router = express.Router();

router.get("/:id/permissions", authMiddleware, permission("roles.read"), controller.getRelations);
router.put("/:id/permissions", authMiddleware, permission("roles.update"), controller.assignRelations);

export default router;
