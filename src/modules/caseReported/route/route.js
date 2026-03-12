import express from "express";
import * as controller from "../controller/controller.js";
import { authMiddleware } from "../../../middlewares/auth.middleware.js";
import { permission } from "../../../middlewares/permission.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, permission("courts.read"), controller.getAll);
router.put("/:case_id/bulk", authMiddleware, permission("courts.update"), controller.assignRelations);
router.get("/:id", authMiddleware, permission("courts.read"), controller.getById);
router.post("/", authMiddleware, permission("courts.create"), controller.create);
router.put("/:id", authMiddleware, permission("courts.update"), controller.update);
router.delete("/:id", authMiddleware, permission("courts.delete"), controller.remove);

export default router;
