// src/components/ui/Sidebar.jsx
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { MdOutlineDashboard } from "react-icons/md";
import { GoLaw } from "react-icons/go";
import { FaRegPlusSquare } from "react-icons/fa";
import { RiAdminLine } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";

const menuItems = {
  superadmin: [
    { icons: <MdOutlineDashboard size={20} />, label: "Dashboard", path: "/dashboard" },
    { icons: <GoLaw size={20} />, label: "Daftar Kasus", path: "/kasus" },
    { icons: <FaRegPlusSquare size={20} />, label: "Tambah Pengaduan", path: "/pengaduan" },
    { icons: <RiAdminLine size={20} />, label: "Manajemen", path: "/manajemen" },
    { icons: <CgProfile size={20} />, label: "Profile", path: "/profile" },
  ],

  admin: [
    { icons: <MdOutlineDashboard size={20} />, label: "Dashboard", path: "/dashboard" },
    { icons: <GoLaw size={20} />, label: "Daftar Kasus", path: "/kasus" },
    { icons: <FaRegPlusSquare size={20} />, label: "Tambah Pengaduan", path: "/pengaduan" },
    { icons: <CgProfile size={20} />, label: "Profile", path: "/profile" },
  ],

  user: [
    { icons: <MdOutlineDashboard size={20} />, label: "Dashboard", path: "/dashboard" },
    { icons: <GoLaw size={20} />, label: "Daftar Kasus", path: "/kasus" },
    { icons: <FaRegPlusSquare size={20} />, label: "Tambah Pengaduan", path: "/pengaduan" },
    { icons: <CgProfile size={20} />, label: "Profile", path: "/profile" },
  ],
};

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const [role, setRole] = useState("user"); // default fallback

  useEffect(() => {
    // Ambil role dari localStorage (atau JWT decode)
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        if (parsed.role) setRole(parsed.role.toLowerCase());
      } catch (err) {
        console.error("Gagal parse user:", err);
      }
    }

    const v = localStorage.getItem("sidebarOpen");
    if (v !== null) setOpen(v === "true");
  }, []);

  const toggle = () => {
    localStorage.setItem("sidebarOpen", String(!open));
    setOpen(!open);
  };

  const menus = menuItems[role] || menuItems["user"]; // fallback aman

  return (
    <aside
      className={`bg-white border-r shadow-sm transition-all duration-300 flex flex-col ${
        open ? "w-64" : "w-16"
      }`}
    >
      {/* Header Logo */}
      <div className="flex items-center justify-between px-4 h-16 border-b">
        <div className={`flex items-center gap-3 ${!open && "justify-center w-full"}`}>
          <div className="bg-blue-600 text-white p-2 rounded-md shadow-inner font-bold">B</div>
          {open && <span className="font-semibold text-gray-700">Aplikasi BPSK</span>}
        </div>

        <button
          onClick={toggle}
          className="p-2 rounded hover:bg-gray-100 text-gray-600"
          aria-label="Toggle sidebar"
        >
          {open ? "◀" : "▶"}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {menus.map((m) => (
          <NavLink
            to={m.path}
            key={m.path}
            end
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all
              ${isActive ? "bg-blue-500 text-white shadow" : "text-gray-600 hover:bg-gray-100"}
            `}
          >
            <div className="w-6 flex justify-center">{m.icons}</div>
            {open && <span>{m.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t">
        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
          }}
          className="w-full text-left px-3 py-2 rounded-md bg-red-50 text-red-600 hover:bg-red-100"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
