import path from "path";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { checkDBConnection } from "./config/database.js";
import { authMiddleware } from "./middlewares/auth.middleware.js";
import privateFileRoutes from "./routes/privateFile.routes.js";

import usersRoutes from "./modules/user/route/route.js";
import profileRoutes from "./routes/profile.routes.js";
import authRoutes from "./modules/auth/route/route.js";
import moduleRoutes from "./modules/module/route/route.js";
import menuRoutes from "./modules/menu/route/route.js";
import rolesRoutes from "./modules/role/route/route.js";
import permissionsRoutes from "./modules/permission/route/route.js";
import territoryRoutes from "./modules/territory/route/route.js";
import areaRoutes from "./modules/area/route/route.js";

import rpRoutes from "./modules/rolePermission/route/route.js";
import urRoutes from "./modules/userRole/route/route.js";
import utRoutes from "./modules/userTerritory/route/route.js";

import rpRelation from "./modules/rolePermission/route/relation.js";
import urRelation from "./modules/userRole/route/relation.js";
import utRelation from "./modules/userTerritory/route/relation.js";

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
app.use("/api/profile", profileRoutes);
app.use("/api/modules", moduleRoutes);
app.use("/api/menus", menuRoutes);
app.use("/api/roles", rolesRoutes);
app.use("/api/permissions", permissionsRoutes);
app.use("/api/territories", territoryRoutes);
app.use("/api/areas", areaRoutes);

app.use("/api/role-permissions", rpRoutes);
app.use("/api/user-roles", urRoutes);
app.use("/api/user-territories", utRoutes);

app.use("/api/roles", rpRelation);
app.use("/api/users", urRelation);
app.use("/api/users", utRelation);

app.use("/public", express.static(path.join(process.cwd(), "uploads/public")));
// app.use("/private", express.static(path.join(process.cwd(), "uploads/private")));
app.use("/private", privateFileRoutes);

export default app;
