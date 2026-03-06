import express from "express";
import * as controller from "../controller/controller.js";
import { authMiddleware } from "../../../middlewares/auth.middleware.js";
import { permission } from "../../../middlewares/permission.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, permission("menus.read"), controller.getAll);
router.get("/:id", authMiddleware, permission("menus.read"), controller.getById);
router.post("/", authMiddleware, permission("menus.create"), controller.create);
router.put("/:id", authMiddleware, permission("menus.update"), controller.update);
router.delete("/:id", authMiddleware, permission("menus.delete"), controller.remove);

export default router;
