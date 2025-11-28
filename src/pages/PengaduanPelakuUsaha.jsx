import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiClient } from "../api/apiClient";
import KasusNavbar from "../components/KasusNavbar";

export default function PengaduanPelakuUsaha() {
  const { id } = useParams();
  const [pelakuList, setPelakuList] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Load pelaku dari API
  const fetchPelaku = async () => {
    try {
      setLoading(true);
      let data = await apiClient(`/kasus/${id}/pelaku-usaha`);

      // FIX: urutkan berdasarkan ID ASC (pelaku lama dulu)
      data = data.sort((a, b) => a.id - b.id);

      setPelakuList(data);
      return data; 
    } catch (err) {
      alert(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPelaku();
  }, [id]);

  // Tambah pelaku baru
  const addPelaku = async () => {
    await apiClient(`/kasus/${id}/pelaku-usaha`, {
      method: "POST",
    });

    const updated = await fetchPelaku();

    // pindah ke pelaku terbaru (index terakhir)
    setActiveIndex(updated.length - 1);
  };

  // Simpan pelaku
  const savePelaku = async () => {
    const current = pelakuList[activeIndex];

    await apiClient(`/pelaku-usaha/${current.id}`, {
      method: "PUT",
      body: current,
    });

    alert("Pelaku berhasil disimpan!");
    fetchPelaku();
  };

  // Hapus pelaku
  const deletePelaku = async () => {
    const current = pelakuList[activeIndex];
    if (!current) return;

    if (!window.confirm(`Hapus Pelaku Usaha ke-${activeIndex + 1}?`)) return;

    await apiClient(`/pelaku-usaha/${current.id}`, {
      method: "DELETE",
    });

    alert("Pelaku berhasil dihapus!");

    const updated = await fetchPelaku();

    // pindah ke tab terakhir (yang tersisa)
    setActiveIndex(Math.max(0, updated.length - 1));
  };

  // Update input
  const updateField = (key, value) => {
    const updated = [...pelakuList];
    updated[activeIndex] = { ...updated[activeIndex], [key]: value };
    setPelakuList(updated);
  };

  return (
    <>
      <KasusNavbar />
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Langkah 2: Pelaku Usaha</h2>

        {/* TABS */}
        <div className="flex items-center gap-2 mb-4">
          {pelakuList.map((p, index) => (
            <button
              key={p.id}
              onClick={() => setActiveIndex(index)}
              className={`px-4 py-2 rounded border ${
                index === activeIndex
                  ? "bg-gray-200 border-gray-400"
                  : "bg-white border-gray-300"
              }`}
            >
              Pelaku {index + 1}
            </button>
          ))}

          <button
            onClick={addPelaku}
            className="px-3 py-2 text-xl border rounded bg-white"
          >
            +
          </button>
        </div>

        {loading || pelakuList.length === 0 ? (
          <p>Loading...</p>
        ) : (
          <>
            {/* FORM */}
            <div className="space-y-4">

              <div>
                <label className="block text-sm font-semibold">Perusahaan</label>
                <input
                  value={pelakuList[activeIndex]?.perusahaan || ""}
                  onChange={(e) => updateField("perusahaan", e.target.value)}
                  className="w-full border p-2 rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold">Nama Pemilik</label>
                <input
                  value={pelakuList[activeIndex]?.pemilik || ""}
                  onChange={(e) => updateField("pemilik", e.target.value)}
                  className="w-full border p-2 rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold">Kota</label>
                <select
                  value={pelakuList[activeIndex]?.kota || ""}
                  onChange={(e) => updateField("kota", e.target.value)}
                  className="w-full border p-2 rounded"
                >
                  <option value="">Pilih Kota/Kabupaten</option>
                  <option value="Kota Serang">Kota Serang</option>
                  <option value="Kota Cilegon">Kota Cilegon</option>
                  <option value="Kabupaten Serang">Kabupaten Serang</option>
                  <option value="Kabupaten Pandeglang">Kabupaten Pandeglang</option>
                  <option value="Kabupaten Lebak">Kabupaten Lebak</option>
                  <option value="Kabupaten Tangerang">Kabupaten Tangerang</option>
                  <option value="Kota Tangerang">Kota Tangerang</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold">Alamat</label>
                <textarea
                  value={pelakuList[activeIndex]?.alamat || ""}
                  onChange={(e) => updateField("alamat", e.target.value)}
                  className="w-full border p-3 rounded"
                  rows={3}
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold">Kode Pos</label>
                  <input
                    value={pelakuList[activeIndex]?.kode_pos || ""}
                    onChange={(e) => updateField("kode_pos", e.target.value)}
                    className="w-full border p-2 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold">No HP</label>
                  <input
                    value={pelakuList[activeIndex]?.no_hp || ""}
                    onChange={(e) => updateField("no_hp", e.target.value)}
                    className="w-full border p-2 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold">Email (opsional)</label>
                <input
                  value={pelakuList[activeIndex]?.email || ""}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="w-full border p-2 rounded"
                />
              </div>
            </div>

            <div className="flex justify-between mt-6">

              <button
                onClick={deletePelaku}
                className="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700"
              >
                Hapus Pelaku Ini
              </button>

              <button
                onClick={savePelaku}
                className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
              >
                Simpan Pelaku Ini
              </button>

            </div>
          </>
        )}
      </div>
    </>
  );
}
