import path from "path";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { checkDBConnection } from "./config/database.js";
import { authMiddleware } from "./middlewares/auth.middleware.js";

import usersRoutes from "./modules/user/route/route.js";
import authRoutes from "./modules/auth/route/route.js";
import moduleRoutes from "./modules/module/route/route.js";
import menuRoutes from "./modules/menu/route/route.js";
import rolesRoutes from "./modules/role/route/route.js";
import permissionsRoutes from "./modules/permission/route/route.js";
import territoryRoutes from "./modules/territory/route/route.js";
import regionRoutes from "./modules/region/route/route.js";
import caseRoutes from "./modules/case/route/route.js";
import caseReporterRoutes from "./modules/caseReporter/route/route.js";
import caseReportedRoutes from "./modules/caseReported/route/route.js";
import caseComplaintRoutes from "./modules/caseComplaint/route/route.js";
import caseChronologyRoutes from "./modules/caseChronology/route/route.js";
import courtRoutes from "./modules/court/route/route.js";

import rolePermissionRoutes from "./modules/rolePermission/route/route.js";
import userRoleRoutes from "./modules/userRole/route/route.js";
import userRegionRoutes from "./modules/userRegion/route/route.js";

const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
checkDBConnection();

// Routing
app.get("/api", (req, res) => {
  res.json({ message: "API is running..." });
});

app.get("/health/db", async (req, res) => {
  const ok = await checkDBConnection();
  if (ok) return res.json({ status: "connected" });

  return res.status(500).json({
    status: "error",
    message: "Database not connected",
  });
});

app.get("/api/me", authMiddleware, (req, res) => {
  res.json({
    message: "User terautentikasi",
    user: req.user,
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/modules", moduleRoutes);
app.use("/api/menus", menuRoutes);
app.use("/api/roles", rolesRoutes);
app.use("/api/permissions", permissionsRoutes);
app.use("/api/territories", territoryRoutes);
app.use("/api/regions", regionRoutes);
app.use("/api/cases", caseRoutes);
app.use("/api/cases", caseReporterRoutes);
app.use("/api/case-reported", caseReportedRoutes);
app.use("/api/cases", caseComplaintRoutes);
app.use("/api/cases", caseChronologyRoutes);
app.use("/api/courts", courtRoutes);

app.use("/api/role-permissions", rolePermissionRoutes);
app.use("/api/user-roles", userRoleRoutes);
app.use("/api/user-regions", userRegionRoutes);

app.use("/public", express.static(path.join(process.cwd(), "uploads/public")));
// app.use("/private", express.static(path.join(process.cwd(), "uploads/private")));

export default app;
