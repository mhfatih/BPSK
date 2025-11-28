import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { apiClient } from "../api/apiClient";
import KasusNavbar from "../components/KasusNavbar";

export default function JadwalSidang() {
  const { id } = useParams();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) setCurrentUser(userData);
  }, []);

  const [sidangList, setSidangList] = useState([]);
  const [formData, setFormData] = useState({
    tanggalSidang: "",
    jamSidang: "",
    metodePenyelesaian: "",
    hasilSidang: "",
  });

  const [showForm, setShowForm] = useState(false);
  const [editingSidang, setEditingSidang] = useState(null);
  const [mode, setMode] = useState(null); // "jadwal" atau "hasil"

  const fetchSidang = async () => {
    try {
      const res = await apiClient(`/kasus/${id}/sidang`, { method: "GET" });
      setSidangList(res);
    } catch (err) {
      alert("Gagal memuat data sidang.");
    }
  };

  useEffect(() => {
    fetchSidang();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTambahClick = () => {
    setEditingSidang(null);
    setMode("jadwal");
    setFormData({
      tanggalSidang: "",
      jamSidang: "",
      metodePenyelesaian: "",
      hasilSidang: "",
    });
    setShowForm(true);
  };

  // --- Edit Jadwal ---
  const handleEditJadwal = (sidang) => {
    setEditingSidang(sidang);
    setMode("jadwal");
    setFormData({
      tanggalSidang: sidang.tanggal_sidang?.split("T")[0] || "",
      jamSidang: sidang.jam_sidang || "",
      metodePenyelesaian: sidang.metode_penyelesaian || "",
      hasilSidang: sidang.hasil_sidang || "",
    });
    setShowForm(true);
  };

  // --- Edit Hasil ---
  const handleEditHasil = (sidang) => {
    setEditingSidang(sidang);
    setMode("hasil");
    setFormData({
      tanggalSidang: sidang.tanggal_sidang?.split("T")[0] || "",
      jamSidang: sidang.jam_sidang || "",
      metodePenyelesaian: sidang.metode_penyelesaian || "",
      hasilSidang: sidang.hasil_sidang || "",
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingSidang) {
        // EDITING
        const endpoint =
          mode === "jadwal"
            ? `/sidang/${editingSidang.id}/jadwal`
            : `/sidang/${editingSidang.id}/hasil`;

        await apiClient(endpoint, {
          method: "PUT",
          body: formData,
        });

        alert("Sidang berhasil diperbarui");
      } else {
        // CREATE SIDANG
        await apiClient(`/kasus/${id}/sidang`, {
          method: "POST",
          body: formData,
        });
        alert("Sidang berhasil ditambahkan");
      }

      setShowForm(false);
      fetchSidang();
    } catch (err) {
      alert("Gagal menyimpan data");
    }
  };

  return (
    <>
      <KasusNavbar />

      {["admin", "superadmin"].includes(currentUser?.role) && (
        <button
          onClick={handleTambahClick}
          className="mb-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          + Tambah Sidang
        </button>
      )}

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
                <th className="border p-2">Jam Sidang</th>
                <th className="border p-2">Metode Penyelesaian</th>
                <th className="border p-2">Hasil Sidang</th>
                <th className="border p-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {sidangList.map((sidang) => (
                <tr key={sidang.id}>
                  <td className="border p-2 text-center">{sidang.sidang_ke}</td>
                  <td className="border p-2">{sidang.tanggal_sidang?.split("T")[0]}</td>
                  <td className="border p-2">{sidang.jam_sidang}</td>
                  <td className="border p-2">{sidang.metode_penyelesaian}</td>
                  <td className="border p-2">{sidang.hasil_sidang || "-"}</td>

                  <td className="border p-2 text-center space-x-2">
                    <button
                      onClick={() => handleEditJadwal(sidang)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit Jadwal
                    </button>

                    <button
                      onClick={() => handleEditHasil(sidang)}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Edit Hasil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] md:w-[500px] relative">
            <h2 className="text-xl font-semibold mb-4">
              {editingSidang
                ? mode === "jadwal"
                  ? "Edit Jadwal Sidang"
                  : "Edit Hasil Sidang"
                : "Tambah Sidang"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              
              {(mode === "jadwal" || !editingSidang) && (
                <>
                  <div>
                    <label className="block text-sm font-medium">Tanggal Sidang</label>
                    <input
                      type="date"
                      name="tanggalSidang"
                      value={formData.tanggalSidang}
                      onChange={handleChange}
                      className="border rounded p-2 w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Jam Sidang</label>
                    <input
                      type="time"
                      name="jamSidang"
                      value={formData.jamSidang}
                      onChange={handleChange}
                      className="border rounded p-2 w-full"
                    />
                  </div>
                </>
              )}

              {mode === "hasil" && (
                <>
                  <div>
                    <label className="block text-sm font-medium">
                      Metode Penyelesaian
                    </label>
                    <select
                      name="metodePenyelesaian"
                      value={formData.metodePenyelesaian}
                      onChange={handleChange}
                      className="border rounded p-2 w-full"
                    >
                      <option value="">Pilih metode...</option>
                      <option value="Mediasi">Mediasi</option>
                      <option value="Arbitrase">Arbitrase</option>
                      <option value="Konsiliasi">Konsiliasi</option>
                    </select>
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
                </>
              )}

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
    </>
  );
}
