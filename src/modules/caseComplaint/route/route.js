import express from "express";
import * as controller from "../controller/controller.js";
import { authMiddleware } from "../../../middlewares/auth.middleware.js";
import { permission } from "../../../middlewares/permission.middleware.js";
import { uploader } from "../../../middlewares/uploader.middleware.js";
import { uploadPath } from "../../case/service/file.js";

const router = express.Router();

router.get("/:id/complaint", authMiddleware, permission("cases.read"), controller.getData);
router.put("/:id/complaint", authMiddleware, permission("cases.update"), uploadPath, uploader.fields([{ name: "complaint_receipt_file", maxCount: 1 }]), controller.update);

export default router;
