import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { apiClient } from "../api/apiClient";

export default function KasusNavbar() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const [status, setStatus] = useState("");

  // Ambil status kasus langsung dari backend
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const data = await apiClient(`/kasus/${id}/status`);
        setStatus(data.status);
      } catch (err) {
        console.error("Gagal mengambil status kasus:", err);
      }
    };

    fetchStatus();
  }, [id]);

  const menu = [
    { label: "Data Diri", path: `/kasus/${id}/data-diri`, showIf: ["Draf", "Ditolak"] },
    { label: "Pelaku Usaha", path: `/kasus/${id}/pelaku-usaha`, showIf: ["Draf", "Ditolak"] },
    { label: "Tentang Pengaduan", path: `/kasus/${id}/tentang-pengaduan`, showIf: ["Draf", "Ditolak"] },
    { label: "Kronologis", path: `/kasus/${id}/kronologis-pengaduan`, showIf: ["Draf", "Ditolak"] },
    { label: "Preview", path: `/kasus/${id}/view`, showIf: ["Draf", "Diverifikasi", "Ditolak", "Diterima", "Diproses", "Selesai"] },
    { label: "Proses", path: `/kasus/${id}/proses`, showIf: ["Diverifikasi", "Diterima"] },
    { label: "Sidang", path: `/kasus/sidang/${id}`, showIf: ["Diproses", "Selesai"] },
  ];

  const filteredMenu = menu.filter(item => item.showIf.includes(status));

  return (
    <div className="w-full bg-white shadow-md rounded-xl border border-gray-200 px-4 py-4 mb-6">
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
