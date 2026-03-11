import express from "express";
import * as controller from "../controller/controller.js";
import { authMiddleware } from "../../../middlewares/auth.middleware.js";
import { permission } from "../../../middlewares/permission.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, permission("users.read"), controller.getAll);
router.put("/:user_id/bulk", authMiddleware, permission("users.update"), controller.assignRelations);
router.post("/", authMiddleware, permission("users.create"), controller.create);
router.delete("/:user_id/:region_id", authMiddleware, permission("users.delete"), controller.remove);

export default router;
