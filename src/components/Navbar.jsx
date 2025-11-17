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


export default function Navbar() {
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
              console.log(profileRes);

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
    <div className='flex h-screen'>
    <nav
        className={`shadow-md p-2 flex flex-col duration-500 bg-blue-600 text-white ${
          open ? "w-60" : "w-16"
        }`}
      >

      {/* Header */}
      <div className=' px-3 py-2 h-20 flex justify-between items-center'>
        {/* <img src={logo} alt="Logo" className={`${open ? 'w-10' : 'w-0'} rounded-md`} /> */}
        <div><MdMenuOpen size={34} className={` duration-500 cursor-pointer ${!open && ' rotate-180'}`} onClick={() => setOpen(!open)} /></div>
      </div>

      {/* Body */}

      <ul className="flex-1">
        {menus.map((item, index) => (
          <li key={index}>
            <NavLink
              to={item.path}
              end={item.path === "/dashboard"}
              className={({ isActive }) =>
                `group relative flex items-center gap-2 px-3 py-2 my-2 rounded-md duration-300 
                ${isActive ? "bg-blue-800 font-semibold" : "hover:bg-blue-700"}`
              }
            >
              <div>{item.icons}</div>
              <p className={`${!open && "hidden"} duration-500`}>{item.label}</p>

              {!open && (
                <span className="absolute left-full ml-2 px-2 py-1 rounded-md bg-black text-white text-xs opacity-0 group-hover:opacity-100 whitespace-nowrap duration-200">
                  {item.label}
                </span>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
      {/* footer */}
      {/* <div className='flex items-center gap-2 px-3 py-2'>
        <div><FaUserCircle size={30} /></div>
        <div className={`leading-5 ${!open && 'w-0 translate-x-24'} duration-500 overflow-hidden`}>
          <p>Adilah Taupik</p>
          <span className='text-xs'>adi@gmail.com</span>

        </div>
      </div> */}

    </nav>
            
    <div className="flex flex-col flex-1">
        {/* Header */}
        <header className="bg-white shadow-md h-16 flex items-center justify-between px-6">
          <h1 className="text-lg font-semibold text-gray-700">
            Aplikasi BPSK
          </h1>
          <div className="relative">
          {/* Tombol user */}
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 hover:bg-gray-100 px-2 py-1 rounded-md transition"
          >
            <span className="text-sm text-gray-600">
            {user?.profileRes?.profile?.nama || "Pengguna"}
          </span>
            <FaUserCircle size={28} className="text-gray-600" />
          </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 bg-white border rounded-md shadow-lg w-40">
                  <button
                    onClick={handleLogout
                    }
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
        </div>
        </header>

        {/* Content */}
        <main className="flex-1 bg-gray-100 p-6 overflow-auto">
          <Outlet />
        </main>
    </div>
    </div>
      
  )
}