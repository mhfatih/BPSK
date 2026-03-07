import express from "express";
import * as controller from "../controller/controller.js";
import { authMiddleware } from "../../../middlewares/auth.middleware.js";
import { permission } from "../../../middlewares/permission.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, permission("roles.read"), controller.getAll);
router.put("/:role_id/bulk", authMiddleware, permission("roles.update"), controller.assignRelations);
router.post("/", authMiddleware, permission("roles.create"), controller.create);
router.delete("/:role_id/:permission_id", authMiddleware, permission("roles.delete"), controller.remove);

export default router;
