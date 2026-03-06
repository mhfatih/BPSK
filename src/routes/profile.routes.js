import express from "express";
import * as userController from "../modules/user/controller/controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

export default router;
