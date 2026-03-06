import express from "express";
import * as controller from "../controller/controller.js";
import { authMiddleware } from "../../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", controller.register);
router.post("/verify-otp", controller.verifyOtp);
router.post("/resend-otp", controller.resendOtp);
router.post("/login", controller.login);
router.post("/logout", controller.logout);
router.put("/change-password", authMiddleware, controller.changePassword);
router.post("/forgot-password", controller.forgotPassword);
router.post("/reset-password", controller.resetPassword);

export default router;
