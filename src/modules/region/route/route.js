import express from "express";
import * as controller from "../controller/controller.js";
import { authMiddleware } from "../../../middlewares/auth.middleware.js";
import { permission } from "../../../middlewares/permission.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, permission("areas.read"), controller.getAll);
router.get("/:id", authMiddleware, permission("areas.read"), controller.getById);
router.post("/", authMiddleware, permission("areas.create"), controller.create);
router.put("/:id", authMiddleware, permission("areas.update"), controller.update);
router.delete("/:id", authMiddleware, permission("areas.delete"), controller.remove);

export default router;
