import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiClient } from "../api/apiClient";
import KasusNavbar from "../components/KasusNavbar";

export default function PelakuUsaha() {
  const { id } = useParams();
  

  const emptyPelaku = {
    nama_pemilik: "",
    perusahaan: "",
    kota: "",
    alamat: "",
    kode_pos: "",
    no_hp: "",
    email: "",
  };

  const [pelakuUsahaList, setPelakuUsahaList] = useState([emptyPelaku]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  // =========================================================
  // GET DATA FROM BACKEND
  // =========================================================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiClient(`/kasus/${id}/pelaku-usaha`, {
          method: "GET"
        });

        if (Array.isArray(data) && data.length > 0) {
          setPelakuUsahaList(data);
        }
      } catch (err) {
        console.error("Gagal ambil data pelaku usaha:", err);
        alert("Gagal mengambil data pelaku usaha");
      }
    };

    fetchData();
  }, [id]);


  // =========================================================
  // HANDLE CHANGE FORM
  // =========================================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    const updated = [...pelakuUsahaList];
    updated[activeIndex][name] = value;
    setPelakuUsahaList(updated);
  };

  // =========================================================
  // TAMBAH TAB / PELAKU USAHA
  // =========================================================
  const addPelakuUsaha = () => {
    setPelakuUsahaList([...pelakuUsahaList, { ...emptyPelaku }]);
    setActiveIndex(pelakuUsahaList.length); // pindah ke tab baru
  };

  // =========================================================
  // HAPUS TAB / PELAKU USAHA
  // =========================================================
  const removePelakuUsaha = (index) => {
    if (pelakuUsahaList.length === 1) {
      alert("Minimal harus ada 1 pelaku usaha");
      return;
    }

    const removed = pelakuUsahaList[index];

    // Jika ada id → delete ke backend
    if (removed.id) {
      apiClient(`/pelaku-usaha/${removed.id}`, { method: "DELETE" });
    }

    const updated = pelakuUsahaList.filter((_, i) => i !== index);
    setPelakuUsahaList(updated);

    // Adjust active index
    if (activeIndex >= updated.length) {
      setActiveIndex(updated.length - 1);
    }
  };

  const saveSinglePelaku = async () => {
    setLoading(true);

    try {
      const current = pelakuUsahaList[activeIndex];

      if (current.id) {
        // UPDATE
        const updated = await apiClient(`/pelaku-usaha/${current.id}`, {
          method: "PUT",
          body: current,
        });

        const updatedList = [...pelakuUsahaList];
        updatedList[activeIndex] = updated;
        setPelakuUsahaList(updatedList);

      } else {
        // CREATE
        const saved = await apiClient(`/kasus/${id}/pelaku-usaha`, {
          method: "POST",
          body: current,
        });

        const updatedList = [...pelakuUsahaList];
        updatedList[activeIndex] = saved;
        setPelakuUsahaList(updatedList);
      }

      alert("Pelaku usaha berhasil disimpan!");



    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan data pelaku usaha");
    }

    setLoading(false);
  };


  // =========================================================
  // SUBMIT ALL
  // =========================================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Ambil data lama dari backend (id yang sudah ada)
      const oldData = await apiClient(`/kasus/${id}/pelaku-usaha`, {
        method: "GET",
      });

      const oldIds = oldData.map(item => item.id); // id dari DB
      const newIds = pelakuUsahaList.filter(v => v.id).map(v => v.id); // id dari UI

      // 2. Hapus data yang dihilangkan user
      for (const oldId of oldIds) {
        if (!newIds.includes(oldId)) {
          await apiClient(`/pelaku-usaha/${oldId}`, { method: "DELETE" });
        }
      }

      // 3. Loop save data satu-satu
      for (const item of pelakuUsahaList) {
        if (item.id) {
          // UPDATE
          await apiClient(`/pelaku-usaha/${item.id}`, {
            method: "PUT",
            data: item,
          });
        } else {
          // CREATE baru
          await apiClient(`/kasus/${id}/pelaku-usaha`, {
            method: "POST",
            data: item,
          });
        }
      }

      alert("Data pelaku usaha berhasil disimpan!");
      

    } catch (err) {
      console.error(err);
      alert(err.message || "Terjadi kesalahan server");
    } finally {
      setLoading(false);
    }
  };


  const pelaku = pelakuUsahaList[activeIndex] || emptyPelaku;

  // =========================================================
  // RENDER UI TAB ala GOOGLE SHEET
  // =========================================================
  return (
    <>
      <KasusNavbar />
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Langkah 2: Pelaku Usaha</h1>

        {/* TOPBAR TABS */}
        <div className="flex gap-2 border-b mb-6 pb-2 overflow-x-auto">
          {pelakuUsahaList.map((item, index) => (
            <div key={index} className="relative group">
              <button
                onClick={() => setActiveIndex(index)}
                className={`px-4 py-2 rounded-t-md border ${index === activeIndex
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300"
                  }`}
              >
                Pelaku {index + 1}
              </button>

              {/* Tombol hapus */}
              {pelakuUsahaList.length > 1 && (
                <button
                  onClick={() => removePelakuUsaha(index)}
                  className="absolute -top-2 -right-2 bg-red-600 text-white w-5 h-5 text-xs rounded-full opacity-0 group-hover:opacity-100"
                >
                  ×
                </button>
              )}
            </div>
          ))}

          {/* Tambah Tab */}
          <button
            onClick={addPelakuUsaha}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            + Tambah
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm font-medium">Perusahaan</label>
            <input
              type="text"
              name="perusahaan"
              value={pelaku.perusahaan}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Nama Pemilik</label>
            <input
              type="text"
              name="nama_pemilik"
              value={pelaku.nama_pemilik}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Kota</label>
            <select
              name="kota"
              value={pelaku.kota}
              onChange={handleChange}
              className="w-full border p-2 rounded"
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
              value={pelaku.alamat}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Kode Pos</label>
              <input
                name="kode_pos"
                value={pelaku.kode_pos}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">No HP</label>
              <input
                name="no_hp"
                value={pelaku.no_hp}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Email (opsional)</label>
            <input
              type="email"
              name="email"
              value={pelaku.email}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          {/* FOOTER BUTTONS */}
          <div className="flex justify-center pt-4">
            {/* <button
              type="button"
              onClick={() => navigate(`/pengaduan/${id}/data-diri`)}
              className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400"
            >
              ← Kembali
            </button> */}

            <button
              type="button"
              disabled={loading}
              onClick={saveSinglePelaku}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              {loading ? "Menyimpan..." : "Simpan Pelaku Ini"}
            </button>

            {/* <button
              type="button"
              onClick={() => navigate(`/pengaduan/${id}/tentang-pengaduan`)}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Lanjut →
            </button> */}
          </div>
        </form>
      </div>
    </>
  );
}
