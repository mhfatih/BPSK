import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiClient } from "../api/apiClient";
import KasusNavbar from "../components/KasusNavbar";

export default function Verifikasi() {
  const { id } = useParams();
const navigate = useNavigate();

// ================================
// STATE
// ================================
const [statusKasus, setStatusKasus] = useState("");
const [caseOwnerId, setCaseOwnerId] = useState(null);

const [verifikasiStatus, setVerifikasiStatus] = useState("");
const [alasanPenolakan, setAlasanPenolakan] = useState("");
const [nomorDepan, setNomorDepan] = useState("");
const [setujuKonfirmasi, setSetujuKonfirmasi] = useState(false);

const [jumlahKerugian, setJumlahKerugian] = useState("");
const [metode, setMetode] = useState("");
const [hasilSidang, setHasilSidang] = useState("");
const [fileSidang, setFileSidang] = useState(null);

const [loadingPage, setLoadingPage] = useState(true);
const [loading, setLoading] = useState(false);
const [loadingProses, setLoadingProses] = useState(false);
const [loadingSelesai, setLoadingSelesai] = useState(false);

// ================================
// DROPDOWN STATE
// ================================
const [openVerifikasi, setOpenVerifikasi] = useState(false);
const [openProses, setOpenProses] = useState(false);
const [openSelesai, setOpenSelesai] = useState(false);

const [kasus, setKasus] = useState(null); // FIXED 🔥

//
// ================================
// CHECK ROLE ADMIN
// ================================
useEffect(() => {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const isAdmin = user?.role === "admin" || user?.role === "superadmin";
  if (!isAdmin) return navigate("/kasus", { replace: true });

  setLoadingPage(false);
}, [navigate]);

// ================================
// GET STATUS KASUS
// ================================
useEffect(() => {
  const fetchStatus = async () => {
    try {
      const data = await apiClient(`/kasus/${id}/status`);
      setStatusKasus(data.status);
      setCaseOwnerId(data.created_by);

      // 🔥 AUTO OPEN DROPDOWN
      if (data.status === "Diverifikasi") setOpenVerifikasi(true);
      else if (data.status === "Diterima") setOpenProses(true);
      else if (data.status === "Diproses") setOpenSelesai(true);

    } catch (err) {
      console.error("Gagal memuat status:", err);
    }
  };

  fetchStatus();
}, [id]);

// ================================
// GET DETAIL KASUS (ambil wilayah di sini) 🔥
// ================================
useEffect(() => {
  const fetchKasus = async () => {
    try {
      const data = await apiClient(`/kasus/${id}`);
      setKasus(data); // 🔥 wilayah ada di sini
    } catch (err) {
      console.error("Gagal memuat detail kasus:", err);
    }
  };

  fetchKasus();
}, [id]);

if (loadingPage) return <p>Memuat...</p>;

// ================================
// KONVERSI BULAN ROMAWI
// ================================
const bulanKeRomawi = (bulan) => {
  const mapping = ["I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII"];
  return mapping[bulan];
};

// ================================
// NOMOR REGISTRASI FIXED 🔥
// ================================
const nomorRegisFinal = (() => {
  if (!nomorDepan || !kasus?.wilayah) return "";

  const now = new Date();
  const romawi = bulanKeRomawi(now.getMonth());
  const tahun = now.getFullYear();

  return `${nomorDepan}/Reg/BPSK${kasus.wilayah}.BTN/${romawi}/${tahun}`;
})(); // FIX: ganti data.wilayah → kasus.wilayah

// ================================
// SUBMIT VERIFIKASI
// ================================
const handleSubmit = async () => {
  if (!verifikasiStatus) return alert("Pilih status verifikasi.");
  if (!setujuKonfirmasi) return alert("Anda harus menyetujui konfirmasi.");

  if (verifikasiStatus === "Diterima" && !nomorDepan) {
    return alert("Isi nomor registrasi.");
  }

  setLoading(true);

  try {
    await apiClient(`/kasus/${id}/verify`, {
      method: "PUT",
      body: {
        status: verifikasiStatus,
        alasanPenolakan: verifikasiStatus === "Ditolak" ? alasanPenolakan : null,
        no_registrasi: verifikasiStatus === "Diterima" ? nomorRegisFinal : null,
      },
    });

    alert("Verifikasi berhasil!");
    navigate(`/kasus/${id}/view`);
  } catch (err) {
    alert(err.message);
  } finally {
    setLoading(false);
  }
};

// ================================
// SET DIPROSES
// ================================
const handleSetDiproses = async () => {
  setLoadingProses(true);

  try {
    const res = await apiClient(`/kasus/${id}/proses`, { method: "PUT" });
    alert(res.message);
    navigate(`/kasus/${id}/view`);
  } catch (err) {
    alert(err.message);
  }

  setLoadingProses(false);
};

// ================================
// SET SELESAI
// ================================
const handleSubmitSelesai = async () => {
  if (!jumlahKerugian || !metode || !hasilSidang) {
    return alert("Semua field wajib diisi!");
  }

  setLoadingSelesai(true);

  try {
    const formData = new FormData();
    formData.append("jumlah_kerugian", jumlahKerugian);
    formData.append("metode_penyelesaian", metode);
    formData.append("hasil_sidang", hasilSidang);

    if (fileSidang) formData.append("file_sidang", fileSidang);

    const res = await apiClient(`/kasus/${id}/selesai-temp`, {
      method: "PUT",
      body: formData,
    });

    alert(res.message);
    navigate(`/kasus/${id}/view`);
  } catch (err) {
    alert(err.message);
  }

  setLoadingSelesai(false);
};

// ================================
// DROPDOWN ACCESS
// ================================
const disableVerifikasi = statusKasus !== "Diverifikasi";
const disableProses = statusKasus !== "Diterima";
const disableSelesai = statusKasus !== "Diproses";


  return (
    <div className="space-y-8">
      <KasusNavbar />

      {/* ================= VERIFIKASI ================ */}
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-xl border border-gray-200">

        <button
          disabled={disableVerifikasi}
          onClick={() => !disableVerifikasi && setOpenVerifikasi(!openVerifikasi)}
          className={`w-full text-left p-5 font-bold text-lg flex justify-between 
            ${disableVerifikasi ? "opacity-40 cursor-not-allowed" : ""}`}
        >
          <span>📌 Verifikasi Kasus</span>
          <span>{openVerifikasi ? "▲" : "▼"}</span>
        </button>

        {openVerifikasi && !disableVerifikasi && (
          <div className="p-6 border-t space-y-4">

            {/* STATUS */}
            <label className="font-medium text-gray-700">Status Verifikasi</label>
            <select
              className="w-full border p-3 rounded-lg bg-gray-50"
              value={verifikasiStatus}
              onChange={(e) => setVerifikasiStatus(e.target.value)}
            >
              <option value="">-- Pilih Status --</option>
              <option value="Diterima">Diterima</option>
              <option value="Ditolak">Ditolak</option>
            </select>

            {/* Nomor Registrasi */}
            {verifikasiStatus === "Diterima" && (
              <>
                <label className="font-medium text-gray-700">Nomor Registrasi (Bagian Depan)</label>
                <input
                  type="text"
                  className="w-full border p-3 rounded-lg bg-gray-50"
                  placeholder="Contoh: 001"
                  value={nomorDepan}
                  onChange={(e) => setNomorDepan(e.target.value)}
                />
                {nomorDepan && (
                  <p className="text-sm text-gray-600">
                    Final: <b>{nomorRegisFinal}</b>
                  </p>
                )}
              </>
            )}

            {/* Alasan Penolakan */}
            {verifikasiStatus === "Ditolak" && (
              <>
                <label className="font-medium text-gray-700">Alasan Penolakan</label>
                <textarea
                  className="w-full border p-3 rounded-lg bg-gray-50"
                  rows="4"
                  value={alasanPenolakan}
                  onChange={(e) => setAlasanPenolakan(e.target.value)}
                />
              </>
            )}

            {/* Konfirmasi */}
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={setujuKonfirmasi}
                onChange={(e) => setSetujuKonfirmasi(e.target.checked)}
              />
              Saya yakin ingin memverifikasi kasus ini.
            </label>

            {/* Submit */}
            <button
              className="w-full py-3 rounded-lg bg-blue-600 text-white"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Memproses..." : "Verifikasi"}
            </button>
          </div>
        )}
      </div>

      {/* ================= PROSES ================= */}
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-xl border border-gray-200">

        <button
          disabled={disableProses}
          onClick={() => !disableProses && setOpenProses(!openProses)}
          className={`w-full text-left p-5 font-bold text-lg flex justify-between 
            ${disableProses ? "opacity-40 cursor-not-allowed" : ""}`}
        >
          <span>⚙ Proses Kasus</span>
          <span>{openProses ? "▲" : "▼"}</span>
        </button>

        {openProses && !disableProses && (
          <div className="p-6 border-t">
            <p className="text-gray-600 mb-4">Ubah status menjadi <b>Diproses</b>.</p>

            <button
              className="w-full py-3 rounded-lg bg-blue-600 text-white"
              onClick={handleSetDiproses}
              disabled={loadingProses}
            >
              {loadingProses ? "Memproses..." : "Proses"}
            </button>
          </div>
        )}
      </div>

      {/* ================= SELESAI ================= */}
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-xl border border-gray-200 mb-12">

        <button
          disabled={disableSelesai}
          onClick={() => !disableSelesai && setOpenSelesai(!openSelesai)}
          className={`w-full text-left p-5 font-bold text-lg flex justify-between 
            ${disableSelesai ? "opacity-40 cursor-not-allowed" : ""}`}
        >
          <span>🏁 Selesaikan Kasus</span>
          <span>{openSelesai ? "▲" : "▼"}</span>
        </button>

        {openSelesai && !disableSelesai && (
          <div className="p-6 border-t space-y-4">

            <label className="font-medium text-gray-700">Jumlah Kerugian</label>
            <input
              type="number"
              className="w-full border p-3 rounded-lg bg-gray-50"
              value={jumlahKerugian}
              onChange={(e) => setJumlahKerugian(e.target.value)}
            />

            <label className="font-medium text-gray-700">Metode Penyelesaian</label>
            <select
              className="w-full border p-3 rounded-lg bg-gray-50"
              value={metode}
              onChange={(e) => setMetode(e.target.value)}
            >
              <option value="">-- Pilih --</option>
              <option value="Mediasi">Mediasi</option>
              <option value="Arbitrase">Arbitrase</option>
              <option value="Konsiliasi">Konsiliasi</option>
            </select>

            <label className="font-medium text-gray-700">Hasil Sidang</label>
            <textarea
              className="w-full border p-3 rounded-lg bg-gray-50"
              rows="4"
              value={hasilSidang}
              onChange={(e) => setHasilSidang(e.target.value)}
            />

            <label className="font-medium text-gray-700">Upload File Sidang (Opsional)</label>
            <input
              type="file"
              className="w-full border p-3 rounded-lg"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => setFileSidang(e.target.files[0])}
            />

            <button
              className="w-full py-3 rounded-lg bg-blue-600 text-white"
              onClick={handleSubmitSelesai}
              disabled={loadingSelesai}
            >
              {loadingSelesai ? "Memproses..." : "Selesaikan Kasus"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
