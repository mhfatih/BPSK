import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import { getKasusById, updatePengaduan } from "../api/kasusServices";

export default function TentangPengaduan() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    jenis_pengaduan: "",
    tanggal_kejadian: "",
    waktu_kejadian: "",
    lokasi_kejadian: "",
    jenis_kerugian: "",
    keterangan_kerugian: "",
    bukti_pembelian: "",
    bukti_saksi: "",
    hubungan_saksi: "",
    barang_bukti: "",
    foto_bukti: null,
  });
  const [loading, setLoading] = useState(false);

  // 🔹 Ambil data lama dari backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getKasusById(id);
        if (data?.pengaduan) {
          setForm((prev) => ({
            ...prev,
            ...data.pengaduan,
            foto_bukti: null, // jangan timpa file dengan string URL
          }));
        }
      } catch (err) {
        console.error("Gagal ambil data pengaduan:", err);
      }
    };
    fetchData();
  }, [id]);

  // 🔹 Handle perubahan input
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // 🔹 Submit data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        if (form[key] !== null && form[key] !== "")
          formData.append(key, form[key]);
      });

      await updatePengaduan(id, formData);

      alert("Data pengaduan berhasil disimpan!");
      navigate(`/dashboard/pengaduan/${id}/kronologis-pengaduan`);
    } catch (err) {
      console.error("Error submit pengaduan:", err);
      alert(err.message || "Terjadi kesalahan server!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-700 mb-4">
          Langkah 3: Tentang Pengaduan
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          encType="multipart/form-data"
        >
          {/* Jenis & Waktu Kejadian */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Jenis Pengaduan</label>
              <select
                name="jenis_pengaduan"
                value={form.jenis_pengaduan}
                onChange={handleChange}
                required
                className="w-full border rounded-md p-2"
              >
                <option value="">Pilih Jenis Pengaduan</option>
                <option value="industri dan pertambangan">Industri dan Pertambangan</option>
                <option value="pertanian dan kehutanan">Pertanian dan Kehutanan</option>
                <option value="standar mutu">Standar Mutu</option>
                <option value="jasa">Jasa</option>
                <option value="iklan">Iklan</option>
                <option value="klausula baku">Klausula Baku</option>
                <option value="label">Label</option>
                <option value="lain-lain">Lain-lain</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">Tanggal Kejadian</label>
              <input
                type="date"
                name="tanggal_kejadian"
                value={form.tanggal_kejadian}
                onChange={handleChange}
                required
                className="w-full border rounded-md p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Waktu Kejadian</label>
              <input
                type="time"
                name="waktu_kejadian"
                value={form.waktu_kejadian}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Lokasi Kejadian</label>
              <input
                type="text"
                name="lokasi_kejadian"
                value={form.lokasi_kejadian}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
              />
            </div>
          </div>

          {/* Jenis Kerugian */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Jenis Kerugian
            </label>

            <div className="flex items-center gap-6">
              {/* Checkbox Fisik */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  value="fisik"
                  checked={
                    form.jenis_kerugian === "fisik" ||
                    form.jenis_kerugian === "fisik dan material"
                  }
                  onChange={(e) => {
                    const checked = e.target.checked;
                    let newValue = form.jenis_kerugian;

                    if (checked) {
                      if (newValue === "material") newValue = "fisik dan material";
                      else newValue = "fisik";
                    } else {
                      if (newValue === "fisik dan material") newValue = "material";
                      else if (newValue === "fisik") newValue = "";
                    }

                    setForm({ ...form, jenis_kerugian: newValue });
                  }}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700 text-sm">Fisik</span>
              </label>

              {/* Checkbox Material */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  value="material"
                  checked={
                    form.jenis_kerugian === "material" ||
                    form.jenis_kerugian === "fisik dan material"
                  }
                  onChange={(e) => {
                    const checked = e.target.checked;
                    let newValue = form.jenis_kerugian;

                    if (checked) {
                      if (newValue === "fisik") newValue = "fisik dan material";
                      else newValue = "material";
                    } else {
                      if (newValue === "fisik dan material") newValue = "fisik";
                      else if (newValue === "material") newValue = "";
                    }

                    setForm({ ...form, jenis_kerugian: newValue });
                  }}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700 text-sm">Material</span>
              </label>
            </div>

            {/* Info kecil */}
            <p className="text-xs text-gray-500 mt-2">
              Kamu dapat memilih salah satu atau keduanya.
            </p>
          </div>



          {/* Jenis Kerugian */}
          {/* <div>
            <label className="block text-sm font-medium">Jenis Kerugian</label>
            <select
              name="jenis_kerugian"
              value={form.jenis_kerugian}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
            >
              <option value="">Pilih Jenis Kerugian</option>
              <option value="fisik">Fisik</option>
              <option value="material">Material</option>
            </select>
          </div> */}

          <div>
            <label className="block text-sm font-medium">Keterangan Kerugian</label>
            <textarea
              name="keterangan_kerugian"
              value={form.keterangan_kerugian}
              onChange={handleChange}
              rows="3"
              className="w-full border rounded-md p-2"
            ></textarea>
          </div>

          {/* Bukti */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Bukti Pembelian</label>
              <select
                name="bukti_pembelian"
                value={form.bukti_pembelian}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
              >
                <option value="">Pilih Bukti</option>
                <option value="bon pembelian">Bon Pembelian</option>
                <option value="kwitansi">Kwitansi</option>
                <option value="faktur">Faktur</option>
                <option value="tanda terima">Tanda Terima</option>
                <option value="lain-lain">Lain-lain</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">Bukti Saksi</label>
              <select
                name="bukti_saksi"
                value={form.bukti_saksi}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
              >
                <option value="">Pilih</option>
                <option value="ada">Ada</option>
                <option value="tidak ada">Tidak Ada</option>
              </select>
            </div>

            {form.bukti_saksi === "ada" && (
              <div className="col-span-2">
                <label className="block text-sm font-medium">Hubungan dengan Saksi</label>
                <input
                  type="text"
                  name="hubungan_saksi"
                  value={form.hubungan_saksi}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium">Barang Bukti</label>
              <select
                name="barang_bukti"
                value={form.barang_bukti}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
              >
                <option value="">Pilih</option>
                <option value="ada">Ada</option>
                <option value="tidak ada">Tidak Ada</option>
                <option value="lain-lain">Lain-lain</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">Foto Bukti (Opsional)</label>
              <input
                type="file"
                name="foto_bukti"
                onChange={handleChange}
                className="w-full border rounded-md p-2"
                accept="image/*"
              />
            </div>
          </div>

          {/* Tombol Navigasi */}
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => navigate(`/dashboard/pengaduan/${id}/pelaku-usaha`)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md"
            >
              ← Kembali
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
            >
              {loading ? "Menyimpan..." : "Lanjut ke Kronologis →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
