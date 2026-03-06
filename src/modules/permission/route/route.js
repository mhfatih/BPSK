import express from "express";
import * as controller from "../controller/controller.js";
import { authMiddleware } from "../../../middlewares/auth.middleware.js";
import { permission } from "../../../middlewares/permission.middleware.js";

const router = express.Router();

router.get("/full", authMiddleware, permission("permissions.read"), controller.getFull);
router.get("/", authMiddleware, permission("permissions.read"), controller.getAll);
router.get("/:id", authMiddleware, permission("permissions.read"), controller.getById);
router.post("/", authMiddleware, permission("permissions.create"), controller.create);
router.put("/:id", authMiddleware, permission("permissions.update"), controller.update);
router.delete("/:id", authMiddleware, permission("permissions.delete"), controller.remove);

export default router;
