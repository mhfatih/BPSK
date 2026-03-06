import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get(
  /(.*)/,
  authMiddleware,
);

export default router;
