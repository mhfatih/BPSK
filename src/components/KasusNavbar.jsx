import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { apiClient } from "../api/apiClient";

export default function KasusNavbar() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const [status, setStatus] = useState("");
  const [caseOwnerId, setCaseOwnerId] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔵 Ambil user dari localStorage
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const isAdmin = user?.role === "admin" || user?.role === "superadmin";
  const isOwner = user?.id === caseOwnerId;

  // 🔵 Ambil status & pemilik kasus
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const data = await apiClient(`/kasus/${id}/status`);
        setStatus(data.status);
        setCaseOwnerId(data.created_by);
      } catch (err) {
        console.error("Gagal mengambil status kasus:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [id]);

  // ⏳ Jangan render menu sebelum data siap
  if (loading) {
    return (
      <div className="text-center py-4 text-gray-500">
        Loading...
      </div>
    );
  }

  const menu = [
    {
      label: "Data Diri",
      path: `/kasus/${id}/data-diri`,
      showStatus: ["Draf", "Ditolak"],
      allowed: isOwner,
    },
    {
      label: "Pelaku Usaha",
      path: `/kasus/${id}/pelaku-usaha`,
      showStatus: ["Draf", "Ditolak"],
      allowed: isOwner,
    },
    {
      label: "Tentang Pengaduan",
      path: `/kasus/${id}/tentang-pengaduan`,
      showStatus: ["Draf", "Ditolak"],
      allowed: isOwner,
    },
    {
      label: "Kronologis",
      path: `/kasus/${id}/kronologis-pengaduan`,
      showStatus: ["Draf", "Ditolak"],
      allowed: isOwner,
    },
    {
      label: "Preview",
      path: `/kasus/${id}/view`,
      showStatus: ["Draf", "Diverifikasi", "Ditolak", "Diterima", "Diproses", "Selesai"],
      allowed: true,
    },
    {
      label: "Proses",
      path: `/kasus/${id}/proses`,
      showStatus: ["Diverifikasi", "Diterima", "Diproses"],
      allowed: isAdmin,
    },
  ];

  const filteredMenu = menu.filter(
    (m) => m.showStatus.includes(status) && m.allowed
  );

  return (
    <div className="bg-white shadow-md rounded-xl border border-gray-200 px-4 py-4 mb-6 max-w-3xl mx-auto">
      <div className="overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex justify-center md:justify-center gap-8 min-w-max px-2">

          {filteredMenu.map((item, i) => {
            const isActive = location.pathname === item.path;

            return (
              <button
                key={i}
                onClick={() => navigate(item.path)}
                className={`relative pb-2 text-sm font-medium transition-all duration-300
                  ${isActive ? "text-blue-700" : "text-gray-600 hover:text-gray-800"}
                `}
              >
                {item.label}

                <span
                  className={`absolute left-0 bottom-0 h-[2px] w-full rounded-full transition-all duration-300
                    ${isActive ? "bg-blue-700 scale-100" : "bg-blue-700 scale-0"}
                  `}
                ></span>
              </button>
            );
          })}

        </div>
      </div>
    </div>
  );
}
