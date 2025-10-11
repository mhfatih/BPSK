import { Navigate, Outlet } from "react-router-dom";
import React from "react";

export default function ProtectedRoute({ allowedRoles, children }) {
  const token = localStorage.getItem("token"); // atau dari cookie jika kamu pakai cookie auth
  const user = JSON.parse(localStorage.getItem("user") || "{}"); // disimpan saat login

  console.log("Token:", token);
  console.log("User:", user);


  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Jika route ini punya children (untuk route dalam <Outlet />)
  return children ? children : <Outlet />;
    
  
  
}
