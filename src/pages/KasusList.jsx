import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../api/apiClient";
import {
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  ClipboardCheck,
  Info,
} from "lucide-react";
import Popup from "../components/Popup";

const KasusList = () => {
  const [kasus, setKasus] = useState([]);
  const [filteredKasus, setFilteredKasus] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [wilayahFilter, setWilayahFilter] = useState("Semua");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 15;

  const navigate = useNavigate();

  // 🔹 Popup konfirmasi
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);

  // 🔹 Ambil data dari API
  useEffect(() => {
    const fetchKasus = async () => {
      try {
        setLoading(true);
        const data = await apiClient("/kasus", { method: "GET" });
        setKasus(data);
        setFilteredKasus(data);
      } catch (err) {
        console.error("Gagal mengambil data kasus:", err);
        setError(err.message || "Gagal memuat data");
      } finally {
        setLoading(false);
      }
    };
    fetchKasus();
  }, []);

  // 🔹 Filter + Search
  useEffect(() => {
    let hasil = kasus;

    if (search.trim()) {
      const lowerSearch = search.toLowerCase();
      hasil = hasil.filter((item) => {
        const perusahaanString =
          item.perusahaan_list?.join(", ").toLowerCase() || "";
        return (
          item.no_registrasi?.toLowerCase().includes(lowerSearch) ||
          item.pengadu_nama?.toLowerCase().includes(lowerSearch) ||
          item.jenis_pengaduan?.toLowerCase().includes(lowerSearch) ||
          item.wilayah?.toLowerCase().includes(lowerSearch) ||
          perusahaanString.includes(lowerSearch)
        );
      });
    }

    if (statusFilter !== "Semua") {
      hasil = hasil.filter((item) => item.status === statusFilter);
    }

    if (wilayahFilter !== "Semua") {
      hasil = hasil.filter((item) => item.wilayah === wilayahFilter);
    }

    setFilteredKasus(hasil);
    setCurrentPage(1);
  }, [search, statusFilter, wilayahFilter, kasus]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-full text-gray-600">
        Memuat data...
      </div>
    );

  if (error)
    return (
      <div className="text-center p-4 text-red-600">
        Terjadi kesalahan: {error}
      </div>
    );

  // Pagination
  const totalPages = Math.ceil(filteredKasus.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = filteredKasus.slice(startIndex, endIndex);

  // 🔹 Buat kasus (setelah klik YES di popup)
  const handleCreateKasus = async () => {
    try {
      const res = await apiClient("/kasus/kasus-add", { method: "POST" });
      if (res?.kasus_id) {
        navigate(`/kasus/${res.kasus_id}/data-diri`);
      }
    } catch (err) {
      console.error("Gagal membuat kasus:", err);
      alert("Gagal membuat kasus baru");
    } finally {
      setShowConfirmPopup(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-white shadow-md rounded-xl w-full min-h-fit">
      <h2 className="text-2xl font-semibold text-gray-900">Daftar Kasus</h2>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4 mt-4">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Cari kasus (nama, wilayah, perusahaan...)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-72 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-48 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="Semua">Semua Status</option>
            <option value="Draf">Draf</option>
            <option value="Diverifikasi">Diverifikasi</option>
            <option value="Ditolak">Ditolak</option>
            <option value="Diterima">Diterima</option>
            <option value="Diproses">Diproses</option>
            <option value="Selesai">Selesai</option>
          </select>

          <select
            value={wilayahFilter}
            onChange={(e) => setWilayahFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-48 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="Semua">Semua Wilayah</option>
            <option value="WKP1">WKP1</option>
            <option value="WKP2">WKP2</option>
          </select>
        </div>

        {/* 🔹 Tombol Tambah Kasus */}
        <div className="flex justify-end">
          <button
            onClick={() => setShowConfirmPopup(true)}
            className="bg-blue-700 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-800 transition"
          >
            + Tambah Kasus
          </button>
        </div>
      </div>

      {/* 🔹 Tabel Kasus */}
      
      {/* 🔹 Responsive Wrapper */}
      <div className="border border-gray-200 rounded-xl shadow-sm w-full">

      {/* 📌 Mobile View → Card List */}
      <div className="md:hidden divide-y">
        {currentItems.length === 0 ? (
          <p className="text-gray-600 text-center py-6">Tidak ada hasil yang cocok.</p>
        ) : (
          currentItems.map((item) => (
            <div key={item.id} className="p-4 bg-white">
              <div className="flex justify-between mb-2">
                <span className="text-xs text-gray-500">No. Registrasi</span>
                <span className="font-semibold text-gray-900">{item.no_registrasi || "-"}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-500 text-xs">Pengadu</p>
                  <p className="font-medium text-gray-800">{item.pengadu_nama || "-"}</p>
                </div>

                <div>
                  <p className="text-gray-500 text-xs">Jenis</p>
                  <p className="font-medium text-gray-800">{item.jenis_pengaduan || "-"}</p>
                </div>

                <div>
                  <p className="text-gray-500 text-xs">Wilayah</p>
                  <p className="font-medium text-gray-800">{item.wilayah || "-"}</p>
                </div>

                <div>
                  <p className="text-gray-500 text-xs">Perusahaan</p>
                  <p className="font-medium text-gray-800">
                    {item.perusahaan_list?.length
                      ? item.perusahaan_list.join(", ").length > 25
                        ? item.perusahaan_list.join(", ").slice(0, 25) + "..."
                        : item.perusahaan_list.join(", ")
                      : "-"}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500 text-xs">Diverifikasi</p>
                  <p className="font-medium text-gray-800">
                    {item.verified_at
                      ? new Date(item.verified_at).toLocaleDateString("id-ID")
                      : "-"}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500 text-xs">Diselesaikan</p>
                  <p className="font-medium text-gray-800">
                    {item.finished_at
                      ? new Date(item.finished_at).toLocaleDateString("id-ID")
                      : "-"}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between">
                {/* Status */}
                <div className="flex items-center gap-2 text-sm">
                  {item.status === "Draf" && <FileText className="w-4 h-4 text-gray-600" />}
                  {item.status === "Diverifikasi" && <Eye className="w-4 h-4 text-yellow-600" />}
                  {item.status === "Ditolak" && <XCircle className="w-4 h-4 text-red-600" />}
                  {item.status === "Diterima" && <ClipboardCheck className="w-4 h-4 text-blue-600" />}
                  {item.status === "Diproses" && <Clock className="w-4 h-4 text-yellow-600" />}
                  {item.status === "Selesai" && <CheckCircle className="w-4 h-4 text-green-600" />}

                  <span className="font-medium text-gray-800">{item.status}</span>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => navigate(`/kasus/${item.id}/view`)}
                  className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 transition"
                >
                  <Info className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 💻 Desktop Table */}
      <div className="overflow-x-auto hidden md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-gray-800 to-gray-700 text-white">
              <th className="py-3 px-4 text-left font-medium whitespace-nowrap">No. Registrasi</th>
              <th className="py-3 px-4 text-left font-medium">Nama Pengadu</th>
              <th className="py-3 px-4 text-left font-medium">Jenis Pengaduan</th>
              <th className="py-3 px-4 text-left font-medium">Wilayah</th>
              <th className="py-3 px-4 text-left font-medium">Perusahaan</th>
              <th className="py-3 px-4 text-left font-medium">Diverifikasi</th>
              <th className="py-3 px-4 text-left font-medium">Diselesaikan</th>
              <th className="py-3 px-4 text-left font-medium">Status</th>
              <th className="py-3 px-4 text-center font-medium">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {currentItems.map((item, idx) => (
              <tr
                key={item.id}
                className={`border-b transition-all ${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-blue-50/50`}
              >
                <td className="py-3 px-4 font-medium text-gray-900">{item.no_registrasi || "-"}</td>
                <td className="py-3 px-4 text-gray-800">{item.pengadu_nama || "-"}</td>
                <td className="py-3 px-4 text-gray-800">{item.jenis_pengaduan || "-"}</td>
                <td className="py-3 px-4 text-gray-800">{item.wilayah || "-"}</td>
                <td className="py-3 px-4 text-gray-800">
                  {item.perusahaan_list?.length
                    ? item.perusahaan_list.join(", ").length > 25
                      ? item.perusahaan_list.join(", ").slice(0, 25) + "..."
                      : item.perusahaan_list.join(", ")
                    : "-"}
                </td>

                <td className="py-3 px-4">
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900">
                      {item.verified_at
                        ? new Date(item.verified_at).toLocaleDateString("id-ID")
                        : "-"}
                    </span>
                    <span className="text-gray-500 text-xs">
                      {item.verified_by_name || "-"}
                    </span>
                  </div>
                </td>

                <td className="py-3 px-4">
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900">
                      {item.finished_at
                        ? new Date(item.finished_at).toLocaleDateString("id-ID")
                        : "-"}
                    </span>
                    <span className="text-gray-500 text-xs">
                      {item.finished_by_name || "-"}
                    </span>
                  </div>
                </td>

                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    {item.status === "Draf" && <FileText className="w-4 h-4 text-gray-600" />}
                    {item.status === "Diverifikasi" && <Eye className="w-4 h-4 text-yellow-600" />}
                    {item.status === "Ditolak" && <XCircle className="w-4 h-4 text-red-600" />}
                    {item.status === "Diterima" && <ClipboardCheck className="w-4 h-4 text-blue-600" />}
                    {item.status === "Diproses" && <Clock className="w-4 h-4 text-yellow-600" />}
                    {item.status === "Selesai" && <CheckCircle className="w-4 h-4 text-green-600" />}

                    <span className="font-medium text-gray-800">{item.status}</span>
                  </div>
                </td>

                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => navigate(`/kasus/${item.id}/view`)}
                    className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 transition"
                  >
                    <Info className="w-5 h-5 mx-auto" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>



      {/* 🔹 Pagination */}
      {totalPages > 1 && (
      <div className="flex justify-center items-center mt-6">
        <div className="flex items-center gap-2 sm:gap-3 bg-white px-4 py-2 rounded-xl shadow-md border">
          
          {/* ⬅️ Previous */}
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 
                      text-sm font-medium rounded-lg border transition-all
                      bg-gray-50 hover:bg-gray-100 active:scale-95
                      disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="sm:block hidden">Previous</span>
            <span className="sm:hidden">&#9664;</span>
          </button>

          {/* 📄 Page Indicator */}
          <span className="text-sm sm:text-base font-medium text-gray-700 px-2">
            <span className="hidden sm:inline">
              Halaman {currentPage} dari {totalPages}
            </span>
            <span className="sm:hidden">
              {currentPage}/{totalPages}
            </span>
          </span>

          {/* ➡️ Next */}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 
                      text-sm font-medium rounded-lg border transition-all
                      bg-gray-50 hover:bg-gray-100 active:scale-95
                      disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="sm:hidden">&#9654;</span>
            <span className="hidden sm:block">Next</span>
          </button>

        </div>
      </div>
      )}
      
      {/* Noted / Legend Status */}
      {/* <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          {
            label: "Draf",
            color: "gray",
            desc: "Pengaduan dibuat namun belum diambil tindakan."
          },
          {
            label: "Diverifikasi",
            color: "yellow",
            desc: "Pengaduan telah diperiksa oleh admin dan valid."
          },
          {
            label: "Ditolak",
            color: "red",
            desc: "Pengaduan tidak memenuhi persyaratan atau dokumen kurang."
          },
          {
            label: "Diterima",
            color: "blue",
            desc: "Pengaduan diterima dan siap diproses lebih lanjut."
          },
          {
            label: "Diproses",
            color: "amber",
            desc: "Pengaduan sedang dalam tahap penyelesaian."
          },
          {
            label: "Selesai",
            color: "green",
            desc: "Pengaduan telah selesai diproses dan ditutup."
          },
        ].map((s, i) => (
          <div
            key={i}
            className="flex items-start gap-3 p-4 bg-white border rounded-xl shadow-sm hover:shadow-md transition"
          >
            <span className={`w-3 h-3 rounded-full bg-${s.color}-500 mt-1`}></span>

            <div className="flex flex-col">
              <span className="font-semibold text-gray-900">{s.label}</span>
              <span className="text-sm text-gray-600 leading-snug">{s.desc}</span>
            </div>
          </div>
        ))}
      </div> */}










      {/* 🔹 Popup Konfirmasi Tambah Kasus */}
      <Popup
        show={showConfirmPopup}
        title="Buat Kasus Baru"
        message="Apakah Anda yakin ingin membuat kasus baru?"
        mode="confirm"
        confirmText="Ya, Buat"
        cancelText="Tidak"
        onConfirm={handleCreateKasus}
        onCancel={() => setShowConfirmPopup(false)}
      />
    </div>
  );
};

export default KasusList;
