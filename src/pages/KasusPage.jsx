import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StatusBadge from "../assets/StatusBadge";

const statusOptions = ["Pending", "Ditolak", "Diterima", "Selesai"]; // hanya untuk data
const statuses = ["Semua", ...statusOptions]; // untuk filter dropdown



export default function KasusPage() {
    const [kasus, setKasus] = useState([]);
  const [filteredKasus, setFilteredKasus] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    // Dummy data sesuai header baru
    const dummy = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      nomor: `REG-${2025000 + i + 1}`,
      pengadu: `Pengadu ${i + 1}`,
      pelakuUsaha: `PT Usaha ${i + 1}`,
      tanggal: `2025-09-${(i % 28) + 1}`,
      status: statusOptions[i % statusOptions.length],
    }));

    setKasus(dummy);
    setFilteredKasus(dummy);
  }, []);

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
              <th className="px-4 py-2 border">Tanggal Pengaduan</th>
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
                    {new Date(item.tanggal).toLocaleDateString("id-ID")}
                  </td>
                  <td className="px-4 py-2 border">
                  
                  <StatusBadge status={item.status} />
                    
                    {/* <div
                    className={`inline-block px-3 py-1 text-sm font-medium rounded-full 
                      ${
                        item.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : item.status === "Diterima"
                          ? "bg-green-100 text-green-800"
                          : item.status === "Ditolak"
                          ? "bg-red-100 text-red-800"
                          : item.status === "Selesai"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                  >
                    {item.status}
                  </div> */}
                  </td>
                  <td className="px-4 py-2 border text-center space-x-2">
                  <Link
                    to={`/dashboard/kasus/${item.id}`}
                    className="px-2 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded"
                    >
                    Lihat
                    </Link>
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
