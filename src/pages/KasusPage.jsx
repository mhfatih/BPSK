import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SquarePen, Eye, ShieldCheck } from 'lucide-react';
import { MdOutlineDashboard } from "react-icons/md";
import StatusBadge from "../assets/StatusBadge";
import { apiClient } from "../api/apiClient";
import { formatDate } from "../assets/FormatDate";

const statusOptions = ["Draf", "Diproses", "Ditolak", "Diterima", "Selesai"];
const statuses = ["Semua", ...statusOptions];

export default function KasusPage() {
  const [kasus, setKasus] = useState([]);
  const [filteredKasus, setFilteredKasus] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState(""); // role bisa dari session / cookie
  const [currentPage, setCurrentPage] = useState(1);
  
  const itemsPerPage = 15;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiClient("/profile", { method: "GET" });
        const user = data.user || data;
        setCurrentUser(user);
        setRole(user.role);
      } catch (err) {
        console.warn("Gagal ambil data user login:", err.message);
        if (err.message.includes("Token") || err.message.includes("Unauthorized")) {
          navigate("/login"); // arahkan user ke halaman login
        }
      }
    };
  
    fetchProfile();
  }, []);
  
  useEffect(() => {
    if (!currentUser) return;
  
    const fetchKasus = async () => {
      try {
        const kasusList = await getAllKasus();
  
        const detailedKasus = kasusList.map((item) => ({
          id: item.id,
          nomor_registrasi: `REG-${item.id.substring(0, 8).toUpperCase()}`,
          pengadu: item.nama_pengadu || "-",
          pelakuUsaha: item.nama_perusahaan || item.pelaku_usaha?.namaUsaha || "-",
          tanggal: item.pengaduan?.tanggal || item.created_at || "-",
          status: item.status || "Draf",
          user_id: item.created_by,
        }));
  
        console.log(kasusList);
        let visibleKasus = detailedKasus;
  
        if (role === "user") {
          visibleKasus = detailedKasus.filter(k => k.user_id === currentUser.id);
        } else if (role === "admin") {
          visibleKasus = detailedKasus.filter(
            k => k.status === "Diproses" || k.user_id === currentUser.id
          );
        }
  
        setKasus(detailedKasus);
        setFilteredKasus(visibleKasus);
      } catch (err) {
        console.error("Gagal fetch kasus:", err);
      }
    };
  
    fetchKasus();
    
  }, [currentUser, role]);

  

  // Filtering logic
  useEffect(() => {
    let data = kasus;

    if (search.trim() !== "") {
      data = data.filter(
        (item) =>
          item.nomor_registrasi.toLowerCase().includes(search.toLowerCase()) ||
          item.pengadu.toLowerCase().includes(search.toLowerCase()) ||
          item.pelakuUsaha.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter !== "Semua") {
      data = data.filter((item) => item.status === statusFilter);
    }

    setFilteredKasus(data);
    setCurrentPage(1);
  }, [search, statusFilter, kasus]);

  // Pagination logic
  const totalPages = Math.ceil(filteredKasus.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedKasus = filteredKasus.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Daftar Kasus</h2>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
        <input
          type="text"
          placeholder="Cari nomor, pengadu, pelaku usaha..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded-md w-full md:w-1/2 focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-3 py-2 rounded-md w-full md:w-1/4 focus:ring-2 focus:ring-blue-500"
        >
          {statuses.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>
      </div>

      {/* Tabel */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 text-sm">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-4 py-2 border">No</th>
              <th className="px-4 py-2 border">Nomor Pendaftaran</th>
              <th className="px-4 py-2 border">Pengadu</th>
              <th className="px-4 py-2 border">Pelaku Usaha</th>
              <th className="px-4 py-2 border">Tanggal Pelaporan</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {paginatedKasus.length > 0 ? (
              paginatedKasus.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-100 transition">
                  <td className="px-4 py-2 border text-center">
                    {startIndex + index + 1}
                  </td>
                  <td className="px-4 py-2 border">{item.nomor_registrasi}</td>
                  <td className="px-4 py-2 border">{item.pengadu}</td>
                  <td className="px-4 py-2 border">{item.pelakuUsaha}</td>
                  <td className="px-4 py-2 border">
                    {formatDate(item.tanggal)}
                  </td>
                  <td className="px-4 py-2 border">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="flex items-center justify-center gap-2">
                    
                    
                    {/* Tombol Lihat */}
                    <Link
                      to={`/dashboard/pengaduan/${item.id}/view`}
                      className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
                    >
                      <Eye size={16}  />
                    </Link>

                    {/* Tombol Jadwal Sidang */}
                    {currentUser && role && (
                      ["admin", "superadmin"].includes(role) &&
                      item.status?.toLowerCase() === "diterima" && (
                        <Link
                          
                          to={`/dashboard/kasus/jadwal/${item.id}`}
                          className="flex items-center justify-center p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded"
                        >
                          <SquarePen size={16} />
                        </Link>
                      )
                    )}

                    {/* Verifikasi untuk admin/superadmin */}
                    {/* {(role === "admin" || role === "superadmin") && item.status === "Diterima" && (
                      <button
                        onClick={() => handleUpdateStatus(item.id, "Diterima")}
                        className="px-2 py-1 text-xs bg-green-500 hover:bg-green-600 text-white rounded"
                      >
                        <ShieldCheck size={20}/>
                      </button>
                    )} */}

                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-4 text-gray-500 italic"
                >
                  Tidak ada data kasus.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
