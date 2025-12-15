import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiClient } from "../api/apiClient";
import KasusNavbar from "../components/KasusNavbar";
import Popup from "../components/Popup"; // <-- import popup

export default function TentangPengaduan() {
  const { id } = useParams();

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

  // 🔹 State Popup
  const [showPopup, setShowPopup] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupMessage, setPopupMessage] = useState("");

  // 🔹 Ambil data lama dari backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiClient(`/kasus/${id}/tentang-pengaduan`, {
          method: "GET",
        });

        const pengaduan = res?.pengaduan || res?.data?.pengaduan || res;

        if (pengaduan) {
          setForm((prev) => ({
            ...prev,
            ...pengaduan,
            foto_bukti: null,
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
        if (form[key] !== null && form[key] !== "") {
          formData.append(key, form[key]);
        }
      });

      // PUT
      const res = await apiClient(`/kasus/${id}/tentang-pengaduan`, {
        method: "PUT",
        body: formData,
        headers: {},
      });

      // 🔹 Munculkan popup sukses
      setPopupTitle("Berhasil!");
      setPopupMessage(res.message || "Data pengaduan berhasil disimpan!");
      setShowPopup(true);

    } catch (err) {
      console.error("Error submit pengaduan:", err);

      // 🔹 Popup error
      setPopupTitle("Gagal!");
      setPopupMessage(
        err.response?.data?.message || err.message || "Terjadi kesalahan server!"
      );
      setShowPopup(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <KasusNavbar />

      {/* 🔹 Popup */}
      <Popup
        show={showPopup}
        title={popupTitle}
        message={popupMessage}
        mode="info"
        confirmText="OK"
        onClose={() => setShowPopup(false)}
      />

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
                <option value="industri dan pertambangan">Perdagangan Barang</option>
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
                required
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
                required
              />
            </div>
          </div>

          {/* Jenis Kerugian */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Jenis Kerugian
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

              {/* CARD – FISIK */}
              <label
                className={`flex items-start gap-2 p-3 rounded-xl border cursor-pointer transition-all
                  ${
                    form.jenis_kerugian === "Fisik" ||
                    form.jenis_kerugian === "Fisik dan Material"
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-gray-300 hover:bg-gray-50"
                  }
                `}
              >
                <input
                  type="checkbox"
                  value="Fisik"
                  checked={
                    form.jenis_kerugian === "Fisik" ||
                    form.jenis_kerugian === "Fisik dan Material"
                  }
                  onChange={(e) => {
                    const checked = e.target.checked;
                    let newValue = form.jenis_kerugian;

                    if (checked) {
                      if (newValue === "Material") newValue = "Fisik dan Material";
                      else newValue = "Fisik";
                    } else {
                      if (newValue === "Fisik dan Material") newValue = "Material";
                      else if (newValue === "Fisik") newValue = "";
                    }

                    setForm({ ...form, jenis_kerugian: newValue });
                  }}
                  className="w-4 h-4 accent-blue-600 mt-1"
                />
                <span className="text-sm font-medium text-gray-700">Fisik</span>
              </label>

              {/* CARD – MATERIAL */}
              <label
                className={`flex items-start gap-2 p-3 rounded-xl border cursor-pointer transition-all
                  ${
                    form.jenis_kerugian === "Material" ||
                    form.jenis_kerugian === "Fisik dan Material"
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-gray-300 hover:bg-gray-50"
                  }
                `}
              >
                <input
                  type="checkbox"
                  value="Material"
                  checked={
                    form.jenis_kerugian === "Material" ||
                    form.jenis_kerugian === "Fisik dan Material"
                  }
                  onChange={(e) => {
                    const checked = e.target.checked;
                    let newValue = form.jenis_kerugian;

                    if (checked) {
                      if (newValue === "Fisik") newValue = "Fisik dan Material";
                      else newValue = "Material";
                    } else {
                      if (newValue === "Fisik dan Material") newValue = "Fisik";
                      else if (newValue === "Material") newValue = "";
                    }

                    setForm({ ...form, jenis_kerugian: newValue });
                  }}
                  className="w-4 h-4 accent-blue-600 mt-1"
                />
                <span className="text-sm font-medium text-gray-700">Material</span>
              </label>

            </div>

            <p className="text-xs text-gray-500 mt-2">
              Kamu dapat memilih salah satu atau keduanya.
            </p>
          </div>


          <div>
            <label className="block text-sm font-medium">Keterangan Kerugian</label>
            <textarea
              name="keterangan_kerugian"
              value={form.keterangan_kerugian}
              onChange={handleChange}
              rows="3"
              className="w-full border rounded-md p-2"
              required
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
                required
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
                required
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
                  required
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
                required
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

          {/* Tombol Simpan */}
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
