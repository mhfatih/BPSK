import express from "express";
import * as controller from "../controller/controller.js";
import { authMiddleware } from "../../../middlewares/auth.middleware.js";
import { permission } from "../../../middlewares/permission.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, permission("modules.read"), controller.getAll);
router.get("/:id", authMiddleware, permission("modules.read"), controller.getById);
router.post("/", authMiddleware, permission("modules.create"), controller.create);
router.put("/:id", authMiddleware, permission("modules.update"), controller.update);
router.delete("/:id", authMiddleware, permission("modules.delete"), controller.remove);

export default router;
