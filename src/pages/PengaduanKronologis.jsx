import { useEffect, useState } from "react";
import { useParams, Outlet } from "react-router-dom";
import { apiClient } from "../api/apiClient";
import KasusNavbar from "../components/KasusNavbar";
import Popup from "../components/Popup";

export default function KronologisPengaduan() {
  const { id } = useParams();

  const [form, setForm] = useState({
    kronologis: "",
    jenis_tuntutan: [],
  });
  const [loading, setLoading] = useState(false);

  // 🔹 State popup
  const [showPopup, setShowPopup] = useState(false);
  const [errorTuntutan, setErrorTuntutan] = useState("");
  const opsiJenisTuntutan = [
    "Pengembalian Barang/Jasa yang Sejenis atau Setara Lainnya",
    "Pengembalian Uang",
    "Perawatan Kesehatan",
    "Pemberian Santunan",
    "Teguran Kepada Pelaku Usaha",
    "Lain-lain",
  ];
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiClient(`/kasus/${id}`);

        setForm({
          kronologis: data.kronologis || "",
          jenis_tuntutan: data.jenis_tuntutan
          ? data.jenis_tuntutan.split(",").map((t) => t.trim())
          : [],
        });
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

    

    try {
      await apiClient(`/kasus/${id}/kronologis`, {
        method: "PUT",
        body: {
          ...form,
          jenis_tuntutan: form.jenis_tuntutan.join(", "),
        },
      });

      // 🔹 Tampilkan popup sukses
      setShowPopup(true);

    } catch (err) {
      console.error("🔥 ERROR UPDATE KRONOLOGIS:", err);
      alert(err.message || "Gagal menyimpan kronologis");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
  
    setForm((prev) => {
      let updated = [...prev.jenis_tuntutan];
  
      if (checked) {
        updated.push(value); // tambah opsi
      } else {
        updated = updated.filter((item) => item !== value); // hapus opsi
      }
  
      return { ...prev, jenis_tuntutan: updated };
    });
  };
  

  return (
    <>
      <KasusNavbar />

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
            <label className="block text-sm font-medium mb-2">
              Jenis Tuntutan <span className="text-red-500">*</span>
            </label>

            {/* PREVIEW BADGE TUNTUTAN */}
            {form.jenis_tuntutan.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {form.jenis_tuntutan.map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full border border-blue-300"
                  >
                    {item}
                  </span>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {opsiJenisTuntutan.map((item) => {
                const active = form.jenis_tuntutan.includes(item);

                return (
                  <label
                    key={item}
                    className={`flex items-start gap-2 p-3 rounded-xl border cursor-pointer transition-all 
                      ${active ? "border-blue-500 bg-blue-50 shadow-md" : "border-gray-300 hover:bg-gray-50"}
                    `}
                  >
                    <input
                      type="checkbox"
                      value={item}
                      checked={active}
                      onChange={handleCheckboxChange}
                      className="w-4 h-4 mt-1 accent-blue-600"
                    />
                    <span className="text-sm font-medium">{item}</span>
                  </label>
                );
              })}
            </div>

            {errorTuntutan && (
              <p className="text-red-500 text-sm mt-1">{errorTuntutan}</p>
            )}
          </div>


          {/* <div>
            <label className="block text-sm font-medium">Jenis Tuntutan</label>
            <select
              name="jenis_tuntutan"
              value={form.jenis_tuntutan}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-2.5 bg-white"
            >
              <option value="">Pilih Jenis Tuntutan</option>
              <option value="Pengembalian Barang/Jasa yang Sejenis atau Setara Lainnya">
                Pengembalian Barang/Jasa yang Sejenis atau Setara Lainnya
              </option>
              <option value="Pengembalian Uang">Pengembalian Uang</option>
              <option value="Perawatan Kesehatan">Perawatan Kesehatan</option>
              <option value="Pemberian Santunan">Pemberian Santunan</option>
              <option value="Teguran Kepada Pelaku Usaha">Teguran Kepada Pelaku Usaha</option>
              <option value="Lain-lain">Lain-lain</option>
            </select>
          </div> */}

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

      {/* Outlet untuk nested route */}
      <Outlet />

      {/* 🔹 Popup Sukses */}
      <Popup
        show={showPopup}
        title="Berhasil!"
        message="Kronologis telah berhasil disimpan."
        mode="info"
        confirmText="OK"
        onClose={() => setShowPopup(false)}
      />
    </>
  );
}
