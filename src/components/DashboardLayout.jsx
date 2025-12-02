// src/layouts/DashboardLayout.jsx
import React from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <div className="flex-1 min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 bg-gray-100 p-6 overflow-y-auto overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
            {/* 🔥 Semua route child akan muncul di sini */}
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
