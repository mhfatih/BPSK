import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiClient } from "../api/apiClient";
import KasusNavbar from "../components/KasusNavbar";
import Popup from "../components/Popup"; // <-- pastikan path sesuai

export default function PengaduanDataDiri() {
  const { id } = useParams();

  const [form, setForm] = useState({
    pengadu_nama: "",
    pengadu_umur: "",
    pengadu_jenis_kelamin: "",
    pengadu_kota: "",
    pengadu_alamat: "",
    pengadu_email: "",
    pengadu_no_hp: "",
    pengadu_kode_pos: "",
    pengadu_identitas: "",
    pengadu_foto_identitas: null,
    pengadu_file_pendukung: null,
  });
  const [loading, setLoading] = useState(false);

  // State popup
  const [popupShow, setPopupShow] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupMessage, setPopupMessage] = useState("");

  // 📥 Ambil data dari backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiClient(`/kasus/${id}/data-diri`, { method: "GET" });

        if (data) {
          setForm((prev) => ({
            ...prev,
            ...data,
            pengadu_foto_identitas: null,
            pengadu_file_pendukung: null,
          }));
        }
      } catch (err) {
        console.error("Gagal ambil data:", err);
      }
    };
    fetchData();
  }, [id]);

  // Handle input
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Submit data diri
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== null && value !== "") {
          formData.append(key, value);
        }
      });

      await apiClient(`/kasus/${id}/data-diri`, {
        method: "PUT",
        body: formData,
      });

      // 🔥 Tampilkan popup sukses
      setPopupTitle("Berhasil Disimpan");
      setPopupMessage("Data diri pengadu berhasil disimpan.");
      setPopupShow(true);

    } catch (err) {
      console.error("Error submit data diri:", err);
      alert(err.message || "Terjadi kesalahan server!");
    } finally {
      setLoading(false);
    }
  };

  // Tampilan UI
  return (
    <>
      <KasusNavbar />

      {/* Popup Sukses */}
      <Popup
        show={popupShow}
        title={popupTitle}
        message={popupMessage}
        mode="info"
        confirmText="OK"
        onClose={() => setPopupShow(false)}
      />

      <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-700 mb-4">
          Langkah 1: Data Diri Pengadu
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Input kolom */}
            <div>
              <label className="block text-sm font-medium">Nama Lengkap</label>
              <input
                type="text"
                name="pengadu_nama"
                value={form.pengadu_nama}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Umur</label>
              <input
                type="number"
                name="pengadu_umur"
                value={form.pengadu_umur}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Jenis Kelamin</label>
              <select
                name="pengadu_jenis_kelamin"
                value={form.pengadu_jenis_kelamin}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
                required
              >
                <option value="">-- Pilih --</option>
                <option value="laki-laki">Laki-laki</option>
                <option value="perempuan">Perempuan</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">Kota / Kabupaten</label>
              <select
                name="pengadu_kota"
                value={form.pengadu_kota}
                onChange={handleChange}
                className="w-full border border rounded-md p-2 "
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

            <div className="col-span-2">
              <label className="block text-sm font-medium">Alamat</label>
              <textarea
                name="pengadu_alamat"
                value={form.pengadu_alamat}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
                required
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                name="pengadu_email"
                value={form.pengadu_email}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Nomor HP</label>
              <input
                type="text"
                name="pengadu_no_hp"
                value={form.pengadu_no_hp}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Kode Pos</label>
              <input
                type="text"
                name="pengadu_kode_pos"
                value={form.pengadu_kode_pos}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Nomor Identitas</label>
              <input
                type="text"
                name="pengadu_identitas"
                value={form.pengadu_identitas}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">
                Foto Identitas (Opsional)
              </label>
              <input
                type="file"
                name="pengadu_foto_identitas"
                accept="image/*"
                onChange={handleChange}
                className="w-full border rounded-md p-2"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">
                Identitas Pendukung (Jika Diwakilkan atau Dikuasakan)
              </label>
              <input
                type="file"
                name="pengadu_file_pendukung"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleChange}
                className="w-full border rounded-md p-2"
              />
            </div>
          </div>

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
