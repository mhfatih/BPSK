import { useEffect, useState } from "react";
import { useParams, useNavigate, Outlet } from "react-router-dom";
// import { getKasusById, updateKronologis } from "../api/kasusServices";

export default function KronologisPengaduan() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    kronologis: "",
    jenis_tuntutan: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getKasusById(id);
        if (data?.kronologis) {
          setForm({
            kronologis: data.kronologis.kronologis || "",
            jenis_tuntutan: data.kronologis.jenis_tuntutan || "",
          });
        }
      } catch (err) {
        console.error("❌ Gagal ambil data kronologis:", err);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
      setLoading(true);
      console.log("Data dikirim:", form);

    try {
      await updateKronologis(id, form);
      alert("✅ Kronologis berhasil disimpan!");
      navigate(`/dashboard/pengaduan/${id}/view`); // kembali ke daftar pengaduan
    } catch (err) {
        console.error("🔥 ERROR UPDATE KRONOLOGIS:", err);
      alert(err.message || "Gagal menyimpan kronologis");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-700 mb-4">
          Langkah 4: Kronologis Pengaduan
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">
              Kronologis Kejadian
            </label>
            <textarea
              name="kronologis"
              value={form.kronologis}
              onChange={handleChange}
              rows="5"
              required
              placeholder="Jelaskan urutan kejadian secara rinci..."
              className="w-full border rounded-md p-2"
            ></textarea>
          </div>

         <div>
              <label className="block text-sm font-medium">Jenis Tuntutan</label>
              <select
                  name="jenis_tuntutan"
                  value={form.jenis_tuntutan}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl p-2.5  transition bg-white"
                >
                <option value="">Pilih Jenis Tuntutan</option>
                <option value="gantiBarang">Pengembalian Barang/Jasa yang Sejenis atau Setara Lainnya</option>
                <option value="gantiUang">Pengembalian Uang</option>
                <option value="kesehatan">Perawatan Kesehatan</option>
                <option value="santunan">Pemberian Santunan</option>
                <option value="teguran">Teguran Kepada Pelaku Usaha</option>  
                <option value="lain-lain">Lain-lain</option>
                
                </select>             
            </div>         

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() =>
                navigate(`/dashboard/pengaduan/${id}/tentang-pengaduan`)
              }
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md"
            >
              ← Kembali
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md"
            >
              {loading ? "Menyimpan..." : "Selesai & Simpan"}
            </button>
          </div>
        </form>
      </div>

      {/* Jika ada nested route tambahan di bawahnya */}
      <Outlet />
    </>
  );
}
