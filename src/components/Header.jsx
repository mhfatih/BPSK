// src/components/ui/Header.jsx
import React, { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
// import { apiClient } from "../api/apiClient";

export default function Header() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // jika nama belum lengkap, coba fetch profile (tahan error)
        setUser(parsed);
      } catch {
        setUser(null);
      }
    }
  }, []);

  return (
    <header className="h-16 bg-transparent flex items-center justify-between px-6 border-b">
      <div>
        <h2 className="text-lg font-semibold text-gray-700">Dashboard</h2>
        <p className="text-xs text-gray-500">Ringkasan kegiatan & statistik</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:block">
          <input
            type="search"
            placeholder="Cari..."
            className="border rounded-full px-4 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right mr-2">
            <div className="text-sm text-gray-700 font-medium">
              {user?.profile?.nama_lengkap || user?.nama || "Pengguna"}
            </div>
            <div className="text-xs text-gray-400">{user?.role || ""}</div>
          </div>

          <div className="bg-white p-1 rounded-full shadow-sm">
            <FaUserCircle size={36} className="text-gray-600" />
          </div>
        </div>
      </div>
    </header>
  );
}
