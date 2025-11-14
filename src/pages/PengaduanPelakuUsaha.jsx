import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiClient } from "../api/apiClient";
// import { getKasusById, updatePelakuUsaha } from "../api/kasusServices";

export default function PelakuUsaha() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nama_pemilik: "",
    perusahaan: "",
    kota: "",
    alamat: "",
    kode_pos: "",
    no_hp: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);

  // 🔹 Ambil data lama dari backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiClient(id, {method: "GET"});
        if (data?.pelaku_usaha) setForm({ ...data.pelaku_usaha });
      } catch (err) {
        console.error("Gagal ambil data pelaku usaha:", err);
        alert("Gagal mengambil data pelaku usaha");
      }
    };
    fetchData();
  }, [id]);

  // 🔹 Handle perubahan input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // 🔹 Submit data ke backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updatePelakuUsaha(id, form);
      alert("Data pelaku usaha berhasil disimpan!");
      // navigasi ke langkah berikut
      navigate(`/dashboard/pengaduan/${id}/tentang-pengaduan`);
    } catch (err) {
      console.error(err);
      alert(err.message || "Terjadi kesalahan server!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-700 mb-4">
          Langkah 2: Data Pelaku Usaha
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-sm font-medium">Perusahaan / Nama Usaha</label>
            <input
              type="text"
              name="perusahaan"
              value={form.perusahaan}
              onChange={handleChange}
              required
              className="w-full border rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Nama Pemilik</label>
            <input
              type="text"
              name="nama_pemilik"
              value={form.nama_pemilik}
              onChange={handleChange}
              required
              className="w-full border rounded-md p-2"
            />
          </div>

          <div>
              <label className="block text-sm font-medium">Kota / Kabupaten</label>
              <select
                  name="kota"
                  value={form.kota}
                  onChange={handleChange}
              className="w-full border rounded-md p-2 "
              required
                >
                <option value="">Pilih Kota/Kabupaten</option>
                <option value="Kota Tangerang">Kota Tangerang</option>
                <option value="Kota Tangerang Selatan">Kota Tangerang Selatan</option>
                <option value="Kabupaten Tangerang">Kabupaten Tangerang</option>
                <option value="Kabupaten Serang">Kabupaten Serang</option>
                <option value="Kota Serang">Kota Serang</option>  
                <option value="Kota Cilegon">Kota Cilegon</option>
                <option value="Kabupaten Pandeglang">Kabupaten Pandeglang</option>  
                <option value="Kabupaten Lebak">Kabupaten Lebak</option>  
                </select>             
          </div>

          <div>
            <label className="block text-sm font-medium">Alamat</label>
            <textarea
              name="alamat"
              value={form.alamat}
              onChange={handleChange}
              required
              className="w-full border rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Kode Pos</label>
            <input
              type="text"
              name="kode_pos"
              value={form.kode_pos}
              onChange={handleChange}
              required
              className="w-full border rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">No HP</label>
            <input
              type="text"
              name="no_hp"
              value={form.no_hp}
              onChange={handleChange}
              required
              className="w-full border rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Email (Opsional)</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
            />
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => navigate(`/dashboard/pengaduan/${id}/data-diri`)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md"
            >
              ← Kembali
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
            >
              {loading ? "Menyimpan..." : "Lanjut ke Tentang Pengaduan →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
