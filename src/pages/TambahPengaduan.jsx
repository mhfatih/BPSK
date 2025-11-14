import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../api/apiClient";

export default function TambahPengaduan() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // tanggal: new Date().toISOString().split("T")[0],
    // nomor_registrasi: "",
  });

  // 📅 Fungsi ubah input
  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({ ...prev, [name]: value }));
  // };

  // 🔘 Fungsi tambah kasus
  const handleTambah = async () => {
    setLoading(true);
    try {
      // 🔹 Panggil API POST /kasus
      const data = await apiClient("/kasus/kasus-add", {
        method: "POST",
        body: {}, // kalau backend tidak butuh body, kosongkan saja
      });

      console.log("📦 RESPONSE DARI BACKEND:", data);

      if (data?.kasus_id) {
        // ✅ Simpan nomor registrasi ke state agar bisa ditampilkan
        setFormData((prev) => ({
          ...prev,
          
        }));

        alert(
          `✅ Kasus baru berhasil dibuat!\n`
        );

        // Arahkan ke halaman berikutnya
        navigate(`/pengaduan/${data.kasus_id}/data-diri`);
      } else {
        alert(data.message || "Gagal membuat kasus");
      }
    } catch (err) {
      console.error("❌ Gagal tambah pengaduan:", err);
      alert(err.message || "Terjadi kesalahan server!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md mx-auto text-center">
        <p className="text-sm font-semibold text-gray-600 mb-6">
          Sistem akan membuat pengaduan baru kosong, lalu kamu bisa melanjutkan ke
          pengisian data diri dan langkah-langkah berikutnya.
        </p>

        <div className="space-y-3 text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* <div>
              <label className="block text-sm text-gray-600 mb-1">
                Tanggal
              </label>
              <input
                type="date"
                name="tanggal"
                value={formData.tanggal}
                onChange={handleChange}
                className="w-full border rounded p-2 bg-gray-50"
                readOnly
              />
            </div> */}

            {/* {formData.nomor_registrasi && (
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Nomor Registrasi
                </label>
                <input
                  type="text"
                  readOnly
                  value={formData.nomor_registrasi}
                  className="w-full border rounded p-2 bg-gray-50"
                />
              </div>
            )} */}
          </div>
        </div>

        <button
          onClick={handleTambah}
          disabled={loading}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition"
        >
          {loading ? "Membuat..." : "Buat Pengaduan Baru"}
        </button>

        <button
          onClick={() => navigate("/kasus")}
          className="block mx-auto mt-4 text-sm text-gray-500 hover:text-gray-700"
        >
          ← Kembali ke Daftar Kasus
        </button>
      </div>
    </div>
  );
}
