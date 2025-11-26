import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiClient } from "../api/apiClient";
import KasusNavbar from "../components/KasusNavbar";

export default function Verifikasi() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [verifikasiStatus, setVerifikasiStatus] = useState("");
    const [alasanPenolakan, setAlasanPenolakan] = useState("");
    const [nomorDepan, setNomorDepan] = useState("");
    const [setujuKonfirmasi, setSetujuKonfirmasi] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingProses, setLoadingProses] = useState(false);
    const [loadingSelesai, setLoadingSelesai] = useState(false);

    // -----------------------------
    // Helper Nomor Registrasi
    // -----------------------------
    const bulanKeRomawi = (bulan) => {
        const mapping = [
            "I", "II", "III", "IV", "V", "VI",
            "VII", "VIII", "IX", "X", "XI", "XII"
        ];
        return mapping[bulan];
    };

    const nomorRegisFinal = (() => {
        if (!nomorDepan) return "";

        const now = new Date();
        const romawi = bulanKeRomawi(now.getMonth());
        const tahun = now.getFullYear();

        return `${nomorDepan}/Reg/BPSKBTN/${romawi}/${tahun}`;
    })();

    // -----------------------------
    // Submit Verifikasi
    // -----------------------------
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
            console.error(err);
            alert(err.message || "Gagal memverifikasi kasus");
        } finally {
            setLoading(false);
        }
    };


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

  // ======================
  //  UPDATE → SELESAI
  // ======================
  const handleSetSelesai = async () => {
    setLoadingSelesai(true);

    try {
      const res = await apiClient(`/kasus/${id}/selesai`, { method: "PUT" });
      alert(res.message || "Kasus berhasil diselesaikan");
    } catch (err) {
      alert(err.message);
    }

    setLoadingSelesai(false);
  };
    
    return (
        <div className="space-y-8">
            <KasusNavbar />
            <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-xl border border-gray-200">

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
                    <div className="mb-4">
                        <label className="font-medium text-gray-700">
                            Nomor Registrasi (Bagian Depan)
                        </label>
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
                    </div>
                )}

                {/* Alasan Penolakan */}
                {verifikasiStatus === "Ditolak" && (
                    <div className="mb-4">
                        <label className="font-medium text-gray-700">Alasan Penolakan</label>
                        <textarea
                            className="w-full border p-3 rounded-lg bg-gray-50"
                            rows="4"
                            placeholder="Tuliskan alasan penolakan..."
                            value={alasanPenolakan}
                            onChange={(e) => setAlasanPenolakan(e.target.value)}
                        />
                    </div>
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

                {/* Button */}
                <button
                    className={`w-full mt-6 py-3 rounded-lg text-white font-medium
          ${verifikasiStatus === "Ditolak"
                            ? "bg-red-600 hover:bg-red-700"
                            : verifikasiStatus === "Diterima"
                                ? "bg-green-600 hover:bg-green-700"
                                : "bg-blue-600 hover:bg-blue-700"
                        }
        `}
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? "Memproses..." : "Kirim Verifikasi"}
                </button>
            </div>

            {/* ================= STATUS → DIPROSES ================= */}
            <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-xl border border-gray-200">
                <h2 className="text-lg font-bold mb-4 text-gray-800">Proses Kasus</h2>
                <p className="text-gray-600 mb-4">
                    Ubah status kasus menjadi <b>Diproses</b>.
                </p>

                <button
                    className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium"
                    onClick={handleSetDiproses}
                    disabled={loadingProses}
                >
                    {loadingProses ? "Memproses..." : "Tandai Diproses"}
                </button>
            </div>

            {/* ================= STATUS → SELESAI ================= */}
            {/* <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-xl border border-gray-200">
                <h2 className="text-lg font-bold mb-4 text-gray-800">Selesaikan Kasus</h2>
                <p className="text-gray-600 mb-4">
                    Ubah status kasus menjadi <b>Selesai</b>.
                </p>

                <button
                    className="w-full py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium"
                    onClick={handleSetSelesai}
                    disabled={loadingSelesai}
                >
                    {loadingSelesai ? "Memproses..." : "Tandai Selesai"}
                </button>
            </div> */}

        </div>


    );
}
