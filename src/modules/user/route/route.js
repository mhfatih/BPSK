import express from "express";
import * as controller from "../controller/controller.js";
import { authMiddleware } from "../../../middlewares/auth.middleware.js";
import { permission } from "../../../middlewares/permission.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, permission("users.read"), controller.getAll);
router.get("/:id", authMiddleware, permission("users.read"), controller.getById);
router.post("/", authMiddleware, permission("users.create"), controller.create);
router.put("/:id", authMiddleware, permission("users.update"), controller.update);
router.delete("/:id", authMiddleware, permission("users.delete"), controller.remove);

export default router;
