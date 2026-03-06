import express from "express";
import * as controller from "../controller/controller.js";
import { authMiddleware } from "../../../middlewares/auth.middleware.js";
import { permission } from "../../../middlewares/permission.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, permission("roles.read"), controller.getAll);
router.get("/:id", authMiddleware, permission("roles.read"), controller.getById);
router.post("/", authMiddleware, permission("roles.create"), controller.create);
router.put("/:id", authMiddleware, permission("roles.update"), controller.update);
router.delete("/:id", authMiddleware, permission("roles.delete"), controller.remove);

export default router;
