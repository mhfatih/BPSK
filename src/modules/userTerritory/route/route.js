import express from "express";
import * as controller from "../controller/controller.js";
import { authMiddleware } from "../../../middlewares/auth.middleware.js";
import { permission } from "../../../middlewares/permission.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, permission("user_territories.read"), controller.getAll);
router.get("/:id", authMiddleware, permission("user_territories.read"), controller.getById);
router.post("/", authMiddleware, permission("user_territories.create"), controller.create);
// router.put("/:id", authMiddleware, permission("user_territories.update"), controller.update);
router.delete("/:id", authMiddleware, permission("user_territories.delete"), controller.remove);

export default router;
