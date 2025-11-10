import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  getSidangByKasusId,
  createSidang,
  updateSidangById,
} from "../api/kasusServices";

export default function JadwalSidang() {
  const { id } = useParams(); // id kasus
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) setCurrentUser(userData);
  }, []);

  const [sidangList, setSidangList] = useState([]);
  const [formData, setFormData] = useState({
    tanggalSidang: "",
    jamMulai: "",
    jamSelesai: "",
    hasilSidang: "",
  });

  const [showForm, setShowForm] = useState(false);
  const [editingSidang, setEditingSidang] = useState(null);

  // 🔹 Ambil semua data sidang berdasarkan kasus
  const fetchSidang = async () => {
    try {
      const res = await getSidangByKasusId(id);
      setSidangList(res);
    } catch (err) {
      console.error("Gagal mengambil data sidang:", err);
      alert("Gagal memuat data sidang.");
    }
  };

  useEffect(() => {
    fetchSidang();
  }, [id]);

  // 🔹 Input handler
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Tombol tambah sidang
  const handleTambahClick = () => {
    setEditingSidang(null);
    setFormData({
      tanggalSidang: "",
      jamMulai: "",
      jamSelesai: "",
      hasilSidang: "",
    });
    setShowForm(true);
  };

  // 🔹 Tombol edit
  const handleEditClick = (sidang) => {
    setEditingSidang(sidang);
    setFormData({
      tanggalSidang: sidang.tanggal_sidang?.split("T")[0] || "",
      jamMulai: sidang.jam_mulai || "",
      jamSelesai: sidang.jam_selesai || "",
      hasilSidang: sidang.hasil_sidang || "",
    });
    setShowForm(true);
  };

  // 🔹 Submit form (tambah/update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingSidang) {
        await updateSidangById(editingSidang.id, formData);
        alert("Sidang berhasil diperbarui");
      } else {
        await createSidang(id, formData);
        alert("Sidang berhasil ditambahkan");
      }

      setShowForm(false);
      fetchSidang();
    } catch (err) {
      console.error("Gagal menyimpan sidang:", err);
      alert("Gagal menyimpan data sidang.");
    }
  };

  return (
    <div className="p-6 relative">
      <h1 className="text-2xl font-bold mb-4">Jadwal Sidang Kasus #{id}</h1>

      {/* Tombol tambah */}
      {["admin", "superadmin"].includes(currentUser?.role) && (
        <button
          onClick={handleTambahClick}
          className="mb-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          + Tambah Sidang
        </button>
      )}

      {/* Daftar Sidang */}
      <div className="bg-white shadow-md p-4 rounded">
        <h2 className="text-lg font-semibold mb-3">Daftar Sidang</h2>
        {sidangList.length === 0 ? (
          <p className="text-gray-500">Belum ada jadwal sidang.</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Sidang Ke</th>
                <th className="border p-2">Tanggal</th>
                <th className="border p-2">Jam Mulai</th>
                <th className="border p-2">Jam Selesai</th>
                <th className="border p-2">Hasil Sidang</th>
                {["admin", "superadmin"].includes(currentUser?.role) && (
                  <th className="border p-2">Aksi</th>
                )}
              </tr>
            </thead>
            <tbody>
              {sidangList.map((sidang) => (
                <tr key={sidang.id}>
                  <td className="border p-2 text-center">{sidang.sidang_ke}</td>
                  <td className="border p-2">
                    {sidang.tanggal_sidang?.split("T")[0]}
                  </td>
                  <td className="border p-2">{sidang.jam_mulai}</td>
                  <td className="border p-2">{sidang.jam_selesai}</td>
                  <td className="border p-2">
                    {sidang.hasil_sidang || "-"}
                  </td>
                  {["admin", "superadmin"].includes(currentUser?.role) && (
                    <td className="border p-2 text-center">
                      <button
                        onClick={() => handleEditClick(sidang)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 🔹 Modal Form Tambah/Edit */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] md:w-[500px] relative">
            <h2 className="text-xl font-semibold mb-4">
              {editingSidang ? "Edit Sidang" : "Tambah Sidang"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium">Tanggal Sidang</label>
                <input
                  type="date"
                  name="tanggalSidang"
                  value={formData.tanggalSidang}
                  onChange={handleChange}
                  className="border rounded p-2 w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Jam Mulai</label>
                <input
                  type="time"
                  name="jamMulai"
                  value={formData.jamMulai}
                  onChange={handleChange}
                  className="border rounded p-2 w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Jam Selesai</label>
                <input
                  type="time"
                  name="jamSelesai"
                  value={formData.jamSelesai}
                  onChange={handleChange}
                  className="border rounded p-2 w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Hasil Sidang</label>
                <textarea
                  name="hasilSidang"
                  value={formData.hasilSidang}
                  onChange={handleChange}
                  className="border rounded p-2 w-full"
                  rows="3"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
