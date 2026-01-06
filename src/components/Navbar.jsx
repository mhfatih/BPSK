// Updated Dashboard.js with sticky header + sticky sidebar, responsive mobile layout, modern UI
// NOTE: User requested: Do NOT change logic, only styling/structure adjustments.

import React, { useState, useEffect } from 'react'
import { Outlet, NavLink } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { apiClient } from '../api/apiClient';
import logo from '../assets/LogoBantenNew.png';

// icons
import { MdMenuOpen } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { MdOutlineDashboard } from "react-icons/md";
import { GoLaw } from "react-icons/go";
import { RiAdminLine } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";

const menuItems = {
  superadmin: [
    { icons: <MdOutlineDashboard size={26} />, label: "Dashboard", path: "/dashboard" },
    { icons: <GoLaw size={26} />, label: "Daftar Kasus", path: "/kasus" },
    { icons: <RiAdminLine size={26} />, label: "Manajemen", path: "/manajemen" },
    { icons: <CgProfile size={26} />, label: "Profile", path: "/profile" },
  ],
  admin: [
    { icons: <MdOutlineDashboard size={26} />, label: "Dashboard", path: "/dashboard" },
    { icons: <GoLaw size={26} />, label: "Daftar Kasus", path: "/kasus" },
    { icons: <CgProfile size={26} />, label: "Profile", path: "/profile" },
  ],
  user: [
    { icons: <MdOutlineDashboard size={26} />, label: "Dashboard", path: "/dashboard" },
    { icons: <GoLaw size={26} />, label: "Daftar Kasus", path: "/kasus" },
    { icons: <CgProfile size={26} />, label: "Profile", path: "/profile" },
  ],
};

export default function Dashboard() {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [menus, setMenus] = useState([]);
  const [open, setOpen] = useState(true);

  const handleLogout = async () => {
    try {
      await apiClient("/logout", { method: "POST" });
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      const stored = localStorage.getItem("user");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setUser(parsed);
          const role = parsed.role || "user";
          setMenus(menuItems[role] || menuItems.user);

          if (!parsed.nama) {
            const profileRes = await apiClient("/profile", { method: "GET" });

            const updatedUser = {
              ...parsed,
              nama: profileRes?.profile?.nama || parsed.nama,
              email: profileRes?.email || parsed.email,
              role: profileRes?.role || parsed.role,
            };

            localStorage.setItem("user", JSON.stringify(updatedUser));
            setUser(updatedUser);
          }
        } catch (err) {
          console.error("Gagal memuat user:", err);
          localStorage.removeItem("user");
          navigate("/login");
        }
      } else {
        navigate("/login");
      }
    };
    loadUser();
  }, [navigate]);

  return (
    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden">

      {/* HEADER — sticky */}
      <header className="sticky top-0 z-40 bg-white shadow-md h-16 flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
          <h1 className="text-lg sm:text-xl font-semibold text-gray-700">E-BPSK Banten</h1>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 hover:bg-gray-100 px-2 py-1 rounded-md"
          >
            <span className="hidden sm:block text-sm text-gray-700">{user?.nama || "Pengguna"}</span>
            <FaUserCircle size={28} className="text-gray-600" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 bg-white border rounded-md shadow-lg w-40">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="flex flex-1 min-h-0">

        {/* SIDEBAR — sticky and responsive */}
        <nav
          className={`sticky top-16 z-30 h-[calc(100vh-4rem)] overflow-y-auto shadow-md p-2 flex flex-col bg-gray-800 text-white duration-500
          ${open ? "w-56 sm:w-64" : "w-16"}`}
        >
          <div className="px-3 py-2 h-20 flex justify-between items-center">
            <MdMenuOpen
              size={32}
              className={`cursor-pointer duration-500 ${!open && "rotate-180"}`}
              onClick={() => setOpen(!open)}
            />
          </div>

          <ul className="flex-1">
            {menus.map((item, i) => (
              <li key={i}>
                <NavLink
                  to={item.path}
                  end={item.path === "/dashboard"}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 px-3 py-2 mb-1 rounded-md text-sm sm:text-base
                     ${isActive ? "bg-gray-900" : "hover:bg-gray-900"}`
                  }
                >
                  <div>{item.icons}</div>

                  {open && <p className="whitespace-nowrap">{item.label}</p>}

                  {!open && (
                    <span className="absolute left-full ml-2 px-2 py-1 rounded bg-black text-white text-xs opacity-0 whitespace-nowrap
                     group-hover:opacity-100 transition-opacity duration-200">
                      {item.label}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* CONTENT */}
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
