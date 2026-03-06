import express from "express";
import * as controller from "../controller/controller.js";
import { authMiddleware } from "../../../middlewares/auth.middleware.js";
import { permission } from "../../../middlewares/permission.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, permission("role_permissions.read"), controller.getAll);
router.get("/:id", authMiddleware, permission("role_permissions.read"), controller.getById);
router.post("/", authMiddleware, permission("role_permissions.create"), controller.create);
// router.put("/:id", authMiddleware, permission("role_permissions.update"), controller.update);
router.delete("/:id", authMiddleware, permission("role_permissions.delete"), controller.remove);

export default router;
