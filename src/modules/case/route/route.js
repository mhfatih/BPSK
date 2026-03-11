import express from "express";
import * as controller from "../controller/controller.js";
import * as file from "../controller/file.js";
import { authMiddleware } from "../../../middlewares/auth.middleware.js";
import { permission } from "../../../middlewares/permission.middleware.js";
import { uploader } from "../../../middlewares/uploader.middleware.js";
import { uploadPath } from "../service/file.js";

const router = express.Router();

router.get("/", authMiddleware, permission("cases.read"), controller.getAll);
router.get("/:id", authMiddleware, permission("cases.read"), controller.getById);
router.post("/", authMiddleware, permission("cases.create"), controller.create);
router.put("/:id/send", authMiddleware, permission("cases.update"), controller.send);
router.put("/:id/verify", authMiddleware, permission("cases.update"), controller.verify);
router.put("/:id/process", authMiddleware, permission("cases.update"), controller.process);
router.put("/:id/complete", authMiddleware, permission("cases.update"), uploadPath, uploader.fields([{ name: "court_file", maxCount: 1 }]), controller.complete);
router.put("/:id", authMiddleware, permission("cases.update"), controller.update);
router.delete("/:id", authMiddleware, permission("cases.delete"), controller.remove);

router.get("/:id/file/:field", authMiddleware, permission("cases.read"), file.view);

export default router;
