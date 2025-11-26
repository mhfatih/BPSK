import { useNavigate, useParams, useLocation } from "react-router-dom";

export default function KasusNavbar() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const menu = [
    { label: "Data Diri", path: `/kasus/${id}/data-diri` },
    { label: "Pelaku Usaha", path: `/kasus/${id}/pelaku-usaha` },
    { label: "Tentang Pengaduan", path: `/kasus/${id}/tentang-pengaduan` },
    { label: "Kronologis", path: `/kasus/${id}/kronologis-pengaduan` },
    { label: "Preview", path: `/kasus/${id}/view` },
    { label: "Proses", path: `/kasus/${id}/proses` },
    { label: "Sidang", path: `/kasus/sidang/${id}` },
  ];

  return (
    <div className="w-full bg-white shadow-md rounded-xl border border-gray-200 px-4 py-4 mb-6">
      
      {/* WRAPPER: scroll horizontal di HP */}
      <div className="overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex justify-center md:justify-center gap-8 min-w-max px-2">
          {menu.map((item, i) => {
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

                {/* Garis bawah premium */}
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
