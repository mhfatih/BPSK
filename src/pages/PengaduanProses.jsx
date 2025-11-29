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
  const [verifikasiStatus, setVerifikasiStatus] = useState("");
  const [alasanPenolakan, setAlasanPenolakan] = useState("");
  const [nomorDepan, setNomorDepan] = useState("");
  const [setujuKonfirmasi, setSetujuKonfirmasi] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingProses, setLoadingProses] = useState(false);
  const [loadingSelesai, setLoadingSelesai] = useState(false);

  const [jumlahKerugian, setJumlahKerugian] = useState("");
  const [metode, setMetode] = useState("");
  const [hasilSidang, setHasilSidang] = useState("");
  const [fileSidang, setFileSidang] = useState(null);

  // ================================
  // CEK ROLE DARI LOCAL STORAGE
  // ================================
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    const isAdmin = user?.role === "admin" || user?.role === "superadmin";

    if (!isAdmin) {
      return navigate("/kasus", { replace: true });
    }

    setLoadingPage(false);
  }, [navigate]);

  if (loadingPage) return <p>Memuat...</p>;

  // ================================
  // GENERATE NOMOR REGISTRASI
  // ================================
  const bulanKeRomawi = (bulan) => {
    const mapping = ["I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII"];
    return mapping[bulan];
  };

  const nomorRegisFinal = (() => {
    if (!nomorDepan) return "";
    const now = new Date();
    const romawi = bulanKeRomawi(now.getMonth());
    const tahun = now.getFullYear();
    return `${nomorDepan}/Reg/BPSKBTN/${romawi}/${tahun}`;
  })();

  // ================================
  // SUBMIT VERIFIKASI
  // ================================
  const handleSubmit = async () => {
    if (!verifikasiStatus) return alert("Pilih status verifikasi dulu.");
    if (!setujuKonfirmasi) return alert("Anda harus menyetujui konfirmasi.");

    if (verifikasiStatus === "Diterima" && !nomorDepan) {
      return alert("Nomor Registrasi wajib diisi untuk status Diterima.");
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

      alert("Verifikasi kasus berhasil!");
      navigate(`/kasus/${id}/view`);
    } catch (err) {
      alert(err.message || "Gagal memverifikasi kasus");
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // SET STATUS → DIPROSES
  // ================================
  const handleSetDiproses = async () => {
    setLoadingProses(true);

    try {
      const res = await apiClient(`/kasus/${id}/proses`, { method: "PUT" });
      alert(res.message || "Status berhasil diubah ke Diproses");
    } catch (err) {
      alert(err.message);
    }

    setLoadingProses(false);
  };

  // ================================
  // SET STATUS → SELESAI
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

      if (fileSidang) {
        formData.append("file_sidang", fileSidang);
      }

      const res = await apiClient(`/kasus/${id}/selesai-temp`, {
        method: "PUT",
        body: formData,
      });

      alert(res.message || "Kasus berhasil diselesaikan");
      navigate(`/kasus/${id}/view`);
    } catch (err) {
      alert(err.message);
    }

    setLoadingSelesai(false);
  };

  // ================================
  // RENDER
  // ================================
  return (
    <div className="space-y-8">
      <KasusNavbar />

      {/* ================= VERIFIKASI ================= */}
      <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-xl border border-gray-200">
        <h2 className="text-lg font-bold mb-4 text-gray-800">Verifikasi Kasus</h2>

        {/* STATUS */}
        <label className="font-medium text-gray-700">Status Verifikasi</label>
        <select
          className="w-full mt-1 mb-4 border p-3 rounded-lg bg-gray-50"
          value={verifikasiStatus}
          onChange={(e) => setVerifikasiStatus(e.target.value)}
        >
          <option value="">-- Pilih Status --</option>
          <option value="Diterima">✅ Diterima</option>
          <option value="Ditolak">❌ Ditolak</option>
        </select>

        {/* Nomor Registrasi */}
        {verifikasiStatus === "Diterima" && (
          <>
            <label className="font-medium text-gray-700">Nomor Registrasi (Bagian Depan)</label>
            <input
              type="text"
              className="w-full mt-1 border p-3 rounded-lg bg-gray-50"
              placeholder="Contoh: 001"
              value={nomorDepan}
              onChange={(e) => setNomorDepan(e.target.value)}
            />
            {nomorDepan && (
              <p className="text-sm mt-2 text-gray-600">
                Nomor Registrasi Final:
                <b className="ml-1">{nomorRegisFinal}</b>
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
              placeholder="Tuliskan alasan penolakan..."
              value={alasanPenolakan}
              onChange={(e) => setAlasanPenolakan(e.target.value)}
            />
          </>
        )}

        {/* Konfirmasi */}
        <label className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            checked={setujuKonfirmasi}
            onChange={(e) => setSetujuKonfirmasi(e.target.checked)}
          />
          Saya yakin ingin memverifikasi kasus ini.
        </label>

        {/* Submit */}
        <button
          className={`w-full mt-6 py-3 rounded-lg text-white font-medium
            ${verifikasiStatus === "Ditolak"
              ? "bg-red-600 hover:bg-red-700"
              : verifikasiStatus === "Diterima"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-blue-600 hover:bg-blue-700"}`}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Memproses..." : "Verifikasi"}
        </button>
      </div>

      {/* ================= SET DIPROSES ================= */}
      <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-xl border border-gray-200">
        <h2 className="text-lg font-bold mb-4 text-gray-800">Proses Kasus</h2>
        <p className="text-gray-600 mb-4">
          Ubah status menjadi <b>Diproses</b>.
        </p>

        <button
          className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium"
          onClick={handleSetDiproses}
          disabled={loadingProses}
        >
          {loadingProses ? "Memproses..." : "Proses"}
        </button>
      </div>

      {/* ================= SET SELESAI ================= */}
      <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-xl border border-gray-200 mb-10">
        <h2 className="text-lg font-bold mb-4 text-gray-800">Selesaikan Kasus</h2>

        <label className="font-medium text-gray-700">Jumlah Kerugian (Rp)</label>
        <input
          type="number"
          className="w-full mt-1 mb-4 border p-3 rounded-lg bg-gray-50"
          value={jumlahKerugian}
          onChange={(e) => setJumlahKerugian(e.target.value)}
        />

        <label className="font-medium text-gray-700">Metode Penyelesaian</label>
        <select
          className="w-full mt-1 mb-4 border p-3 rounded-lg bg-gray-50"
          value={metode}
          onChange={(e) => setMetode(e.target.value)}
        >
          <option value="">-- Pilih Metode --</option>
          <option value="Mediasi">Mediasi</option>
          <option value="Arbitrase">Arbitrase</option>
          <option value="Konsiliasi">Konsiliasi</option>
        </select>

        <label className="font-medium text-gray-700">Hasil Sidang</label>
        <textarea
          className="w-full mt-1 mb-4 border p-3 rounded-lg bg-gray-50"
          rows="4"
          value={hasilSidang}
          onChange={(e) => setHasilSidang(e.target.value)}
        />

        <label className="font-medium text-gray-700">Upload File Sidang (Opsional)</label>
        <input
          type="file"
          className="w-full mt-1 mb-4 border p-3 rounded-lg"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => setFileSidang(e.target.files[0])}
        />

        <button
          className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium"
          onClick={handleSubmitSelesai}
          disabled={loadingSelesai}
        >
          {loadingSelesai ? "Memproses..." : "Selesaikan Kasus"}
        </button>
      </div>
    </div>
  );
}
