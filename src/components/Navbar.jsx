import React, { useState, useEffect } from 'react'
import { Outlet, NavLink } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { apiClient } from '../api/apiClient';


// import logo from '../logo.png';


// icons
import { MdMenuOpen } from "react-icons/md";
import { IoHomeOutline } from "react-icons/io5";
import { FaRegPlusSquare } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
import { TbReportSearch } from "react-icons/tb";
import { IoLogoBuffer } from "react-icons/io";
import { CiSettings } from "react-icons/ci";
import { MdOutlineDashboard } from "react-icons/md";
import { GoLaw } from "react-icons/go";
import { RiAdminLine } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";


const menuItems = {
  superadmin: [
    { icons: <MdOutlineDashboard size={30} />, label: "Dashboard", path: "/dashboard" },
    { icons: <GoLaw size={30} />, label: "Daftar Kasus", path: "/kasus" },
    { icons: <FaRegPlusSquare size={30} />, label: "Tambah Pengaduan", path: "/pengaduan" },
    { icons: <RiAdminLine size={30} />, label: "Manajemen", path: "/manajemen" },
    { icons: <CgProfile size={30} />, label: "Profile", path: "/profile" },
  ],

  admin: [
    { icons: <MdOutlineDashboard size={30} />, label: "Dashboard", path: "/dashboard" },
    { icons: <GoLaw size={30} />, label: "Daftar Kasus", path: "/kasus" },
    { icons: <FaRegPlusSquare size={30} />, label: "Tambah Pengaduan", path: "/pengaduan" },
    { icons: <CgProfile size={30} />, label: "Profile", path: "/profile" },
  ],

  user: [
    { icons: <MdOutlineDashboard size={30} />, label: "Dashboard", path: "/dashboard" },
    { icons: <GoLaw size={30} />, label: "Daftar Kasus", path: "/kasus" },
    { icons: <FaRegPlusSquare size={30} />, label: "Tambah Pengaduan", path: "/pengaduan" },
    { icons: <CgProfile size={30} />, label: "Profile", path: "/profile" },
  ],
};


export default function Dashboard() {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [menus, setMenus] = useState([]);

  const [open, setOpen] = useState(true)

  const handleLogout = async () => {
  try {
    // Panggil endpoint logout pakai apiClient
    const response = await apiClient("/logout", { method: "POST" });

    // Bersihkan semua data auth di localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    alert(response.message || "Logout berhasil!");
    navigate("/login");
  } catch (error) {
    console.error("Logout error:", error);
    alert(error?.response?.data?.message || "Gagal logout, coba lagi.");
  }
};


   // ✅ Ambil user dari localStorage atau API
      useEffect(() => {
      const loadUser = async () => {
        const stored = localStorage.getItem("user");

        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            setUser(parsed);

            // atur menu sesuai role
            const role = parsed.role || "user";
            setMenus(menuItems[role] || menuItems.user);

            // Jika data user belum lengkap, ambil dari API
            if (!parsed.nama) {
              const profileRes = await apiClient("/profile", { method: "GET" });
              console.log("Profile", profileRes);

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
          // Kalau tidak ada user di localStorage, arahkan ke login
          navigate("/login");
        }
      };

      loadUser();
    }, [navigate]);


    return (
      <div className="flex flex-col h-screen">

      {/* 🔵 HEADER DI ATAS */}
      <header className="bg-gray-50 shadow-md h-16 flex items-center justify-between px-6 py-6">
        <h1 className="text-lg font-semibold text-gray-700">
          Aplikasi E-BPSK
        </h1>
  
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 hover:bg-gray-100 px-2 py-1 rounded-md"
          >
            <span className="text-sm text-gray-700">
              {user?.nama || "Pengguna"}
            </span>
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
  
      {/* 🔵 NAV & CONTENT BERADA DI BAWAH HEADER */}
      <div className="flex flex-1">
  
        {/* SIDEBAR */}
        <nav
          className={`shadow-md p-2 flex flex-col duration-500 bg-blue-600 text-white 
          ${open ? "w-60" : "w-16"}`}
        >
          <div className="px-3 py-2 h-20 flex justify-between items-center">
            <MdMenuOpen
              size={34}
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
                    `group relative flex items-center gap-2 px-3 py-2 mb-1 rounded-md 
                    ${isActive ? "bg-blue-800" : "hover:bg-blue-700"}`
                  }
                >
                  <div>{item.icons}</div>
                  {open && <p>{item.label}</p>}
  
                  {!open && (
                    <span className="absolute left-full ml-2 px-2 py-1 rounded bg-black text-white text-xs opacity-0 group-hover:opacity-100">
                      {item.label}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
  
        {/* CONTENT */}
        <main className="flex-1 bg-gray-100 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
      
  )
}