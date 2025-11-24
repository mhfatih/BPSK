import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../api/apiClient";
import StatusBadge from "../components/StatusBadge";
import {
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  ClipboardCheck,
  Info,
} from "lucide-react";

const KasusList = () => {
  const [kasus, setKasus] = useState([]);
  const [filteredKasus, setFilteredKasus] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [wilayahFilter, setWilayahFilter] = useState("Semua");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;

  const navigate = useNavigate();

  // Ambil data dari API
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

  // Filter dan search
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

  const totalPages = Math.ceil(filteredKasus.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = filteredKasus.slice(startIndex, endIndex);

  return (
    <div className="p-4 sm:p-6 bg-white shadow-md rounded-xl w-full h-full">
      {/* 🔹 Header dan Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-semibold text-blue-900">Daftar Kasus</h2>

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
      </div>

      
      {/* 🔹 Tabel Kasus */}
      <div className="overflow-x-auto border rounded-lg">
        {currentItems.length === 0 ? (
          <p className="text-gray-600 text-center py-6">
            Tidak ada hasil yang cocok.
          </p>
          
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead className="bg-blue-700 text-white">
              <tr>
                <th className="py-2 px-3 text-left whitespace-nowrap">No. Registrasi</th>
                <th className="py-2 px-3 text-left">Nama Pengadu</th>
                <th className="py-2 px-3 text-left">Jenis Pengaduan</th>
                {/* <th className="py-2 px-3 text-left whitespace-nowrap">Jumlah Kerugian</th> */}
                <th className="py-2 px-3 text-left">Wilayah</th>
                {/* <th className="py-2 px-3 text-left">Hasil Sidang</th> */}
                <th className="py-2 px-3 text-left">Perusahaan</th>
                {/* <th className="py-2 px-3 text-left">Dibuat</th> */}
                <th className="py-2 px-3 text-left">Diverifikasi</th>
                {/* <th className="py-2 px-3 text-left">Diproses</th> */}
                <th className="py-2 px-3 text-left">Diselesaikan</th>
                <th className="py-2 px-3 text-left">Status</th>
                <th className="py-2 px-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-3">{item.no_registrasi || "-"}</td>
                  <td className="py-2 px-3">{item.pengadu_nama || "-"}</td>
                  <td className="py-2 px-3">{item.jenis_pengaduan || "-"}</td>
                  {/* <td className="py-2 px-3">
                    {item.jumlah_kerugian
                      ? `Rp ${item.jumlah_kerugian.toLocaleString("id-ID")}`
                      : "-"}
                  </td> */}
                  <td className="py-2 px-3">{item.wilayah || "-"}</td>
                  {/* <td className="py-2 px-3">
                    {item.hasil_sidang
                      ? item.hasil_sidang.length > 20
                        ? item.hasil_sidang.slice(0, 20) + "..."
                        : item.hasil_sidang
                      : "-"}
                  </td> */}
                  <td className="py-2 px-3">
                    {item.perusahaan_list?.length
                      ? item.perusahaan_list.join(", ").length > 20
                        ? item.perusahaan_list.join(", ").slice(0, 20) + "..."
                        : item.perusahaan_list.join(", ")
                      : "-"}
                  </td>
                  {/* <td className="py-2 px-3">
                    {item.created_at
                      ? new Date(item.created_at).toLocaleDateString("id-ID")
                      : "-"}
                  </td> */}
                  <td className="py-2 px-3">
                    <div className="flex flex-col">
                      <span className="font-medium"> {item.verified_at ? new Date(item.verified_at).toLocaleDateString("id-ID") : "-"} </span>
                      <span className="text-gray-500 text-xs"> {item.verified_by_name || "-"}</span>
                    </div>
                  </td>
                  {/* <td className="py-2 px-3">
                    {item.processed_at
                      ? new Date(item.processed_at).toLocaleDateString("id-ID")
                      : "-"}
                  </td> */}
                  <td className="py-2 px-3">
                    <div className="flex flex-col">
                      <span className="font-medium"> {item.finished_at ? new Date(item.finished_at).toLocaleDateString("id-ID") : "-"} </span>
                      <span className="text-gray-500 text-xs"> {item.finished_by_name || "-"} </span>
                    </div>
                  </td>
                  <td className="py-2 px-3 font-medium">
                    <div className="flex items-center gap-2">
                      {item.status === "Draf" && (
                        <FileText className="w-4 h-4 text-gray-600" />
                      )}
                      {item.status === "Diverifikasi" && (
                        <Eye className="w-4 h-4 text-yellow-600" />
                      )}
                      {item.status === "Ditolak" && (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                      {item.status === "Diterima" && (
                        <ClipboardCheck className="w-4 h-4 text-blue-600" />
                      )}
                      {item.status === "Diproses" && (
                        <Clock className="w-4 h-4 text-yellow-600" />
                      )}
                      {item.status === "Selesai" && (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      )}
                      <span className={
                        item.status === "Draf" ? "text-gray-600" :
                          item.status === "Diverifikasi" ? "text-yellow-600" :
                            item.status === "Ditolak" ? "text-red-600" :
                              item.status === "Diterima" ? "text-blue-600" :
                                item.status === "Diproses" ? "text-yellow-600" :
                                  item.status === "Selesai" ? "text-green-600" : "text-gray-700"}>{item.status || "-"}</span>

                    </div>
                  </td>
                  <td className="py-2 px-3 text-center">
                    <button
                      onClick={() => navigate(`/pengaduan/${item.id}/view`)}
                      className="text-blue-600 hover:text-blue-800 transition"
                    >
                      <Info className="w-5 h-5 mx-auto" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 🔹 Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded-lg hover:bg-gray-100 disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Halaman {currentPage} dari {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded-lg hover:bg-gray-100 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default KasusList;
