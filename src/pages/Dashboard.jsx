import React, { useState } from 'react'
import { Outlet, NavLink } from 'react-router-dom';
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


const menuItems = [
    {
        icons: <MdOutlineDashboard size={30} />,
        label: 'Dashboard',
        path: '/dashboard'
  },
  {
    icons: <GoLaw size={30} />,
    label: 'Daftar Kasus',
    path: '/dashboard/kasus'
  },
  {
    icons: <FaRegPlusSquare size={30} />,
    label: 'Tambah Pengaduan',
    path: '/dashboard/pengaduan'
  },
  {
    icons: <CiSettings size={30} />,
    label: 'Setting',
    path: '/dashboard/settings'
    
  },
  {
    icons: <IoLogoBuffer size={30} />,
    label: 'Log',
    path: '/dashboard/log'
  },
  {
    icons: <TbReportSearch size={30} />,
    label: 'Laporan Saya',
    path: '/dashboard/laporan'
  }
]

export default function Dashboard() {

  const [open, setOpen] = useState(true)

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

      <ul className='flex-1'>
        {                
          menuItems.map((item, index) => {
            return (
                <li key={index}>
                <NavLink
                to={item.path}
                end={item.path === "/dashboard"}
                className={({ isActive }) =>
                    `group relative flex items-center gap-2 px-3 py-2 my-2 rounded-md duration-300 
                    ${isActive ? 'bg-blue-800 font-semibold' : 'hover:bg-blue-700'}`
                }
                >
                <div>{item.icons}</div>

                {/* Teks menu normal (hanya tampil kalau open = true) */}
                <p className={`${!open && 'hidden'} duration-500`}>{item.label}</p>

                {/* Tooltip (muncul hanya kalau sidebar ditutup) */}
                {!open && (
                    <span
                    className="absolute left-full ml-2 px-2 py-1 rounded-md bg-black text-white text-xs
                                opacity-0 group-hover:opacity-100 whitespace-nowrap duration-200"
                    >
                    {item.label}
                    </span>
                )}
                </NavLink>
              </li>
            )
          })
        }
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
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Admin</span>
            <FaUserCircle size={28} className="text-gray-600" />
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