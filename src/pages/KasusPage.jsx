import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StatusBadge from "../assets/StatusBadge";

const statusOptions = ["Draft", "Pending", "Ditolak", "Diterima", "Selesai"];
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
    fetch("http://localhost:3000/api/login", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        const user = data.user || data;
        setCurrentUser(user);
        setRole(user.role);
      })
      .catch(() => console.warn("Gagal ambil data user login"));
  }, []);
  
  useEffect(() => {
    if (!currentUser) return;
  
    const fetchKasus = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/kasus", {
          credentials: "include",
        });
        const kasusList = await res.json();
  
        const detailedKasus = kasusList.map((item) => ({
          id: item.id,
          nomor: item.nomorRegistrasi || "-",
          pengadu: item.data_diri?.nama_lengkap || "-",
          pelakuUsaha: item.pelaku_usaha?.perusahaan || item.pelaku_usaha?.namaUsaha || "-",
          tanggal: item.pengaduan?.tanggal || item.created_at || "-",
          status: item.status || "Draft",
          user_id: item.user_id,
        }));
  
        let visibleKasus = detailedKasus;
  
        if (role === "user") {
          visibleKasus = detailedKasus.filter(k => k.user_id === currentUser.id);
        } else if (role === "admin") {
          visibleKasus = detailedKasus.filter(
            k => k.status === "Pending" || k.user_id === currentUser.id
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
          item.nomor.toLowerCase().includes(search.toLowerCase()) ||
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

  // Update status
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`http://localhost:3000/api/kasus/${id}/update-status`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        setKasus((prev) =>
          prev.map((k) => (k.id === id ? { ...k, status: newStatus } : k))
        );
      } else {
        alert(data.message || "Gagal update status");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan server");
    }
  };

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
              <th className="px-4 py-2 border">Tanggal Kejadian</th>
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
                  <td className="px-4 py-2 border">{item.nomor}</td>
                  <td className="px-4 py-2 border">{item.pengadu}</td>
                  <td className="px-4 py-2 border">{item.pelakuUsaha}</td>
                  <td className="px-4 py-2 border">
                    {item.tanggal
                      ? new Date(item.tanggal).toLocaleDateString("id-ID")
                      : "-"}
                  </td>
                  <td className="px-4 py-2 border">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-4 py-2 border text-center space-x-2">
                    
                    
                    {/* Tombol Lihat */}
                    <Link
                      to={`/dashboard/kasus/${item.id}`}
                      className="px-2 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded"
                    >
                      Lihat
                    </Link>

                    {/* Tombol Edit Draft */}
                    {currentUser && (
                      ((role === "user" && item.status === "Draft" && item.user_id === currentUser.id) ||
                      (role === "admin" && item.status === "Draft" && item.user_id === currentUser.id) ||
                      (role === "superadmin" && item.status === "Draft")) && (
                        <Link
                          to={`/dashboard/kasus/edit/${item.id}`}
                          className="px-2 py-1 text-xs bg-yellow-500 hover:bg-yellow-600 text-white rounded"
                        >
                          Lanjutkan
                        </Link>
                      )
                    )}

                    {/* Verifikasi untuk admin/superadmin */}
                    {(role === "admin" || role === "superadmin") && item.status === "Pending" && (
                      <button
                        onClick={() => handleUpdateStatus(item.id, "Diterima")}
                        className="px-2 py-1 text-xs bg-green-500 hover:bg-green-600 text-white rounded"
                      >
                        Verifikasi
                      </button>
                    )}

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
