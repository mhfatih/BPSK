import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Outlet } from "react-router-dom";
import { apiClient } from "../api/apiClient";
import KasusNavbar from "../components/KasusNavbar";

import jsPDF from "jspdf";
import logo from "../assets/LogoBanten.png";
import { formatDate } from "../assets/FormatDate";
import { buildFileUrl } from "../components/buildFileUrl";
import { formatRupiah } from "../components/formatRupiah";
import { downloadPengaduanPDF } from "../pdf";
// import { downloadProtectedFile } from "../components/downloadProtectedFile";
// import { viewPdf } from "../components/ViewPdfFile";


export default function ViewPengaduan() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [kasus, setKasus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [verifikasiStatus, setVerifikasiStatus] = useState("");
  const [alasanPenolakan, setAlasanPenolakan] = useState("");
  const [setujuKonfirmasi, setSetujuKonfirmasi] = useState(false);
  const [nomorDepan, setNomorDepan] = useState("");

  const fileUrl = kasus?.file_sidang ? buildFileUrl(kasus.file_sidang) : null;
  const wilayah = kasus?.wilayah;

  // Ambil user dari localStorage
  const userData = localStorage.getItem("user");
  const currentUser = userData ? JSON.parse(userData) : null;

  // 🔹 Tambahkan ref untuk menangkap area PDF
  const pdfRef = useRef();

  useEffect(() => {
    const fetchKasus = async () => {
      try {
        const data = await apiClient(`/kasus/${id}`);
        

        // 🧩 Normalisasi key agar konsisten
        const normalizedData = {
          ...data,
          alasanPenolakan: data.alasan_penolakan || data.alasanPenolakan || null,
        };
        setKasus(normalizedData);
      } catch (err) {
        console.error(err);
        alert(err.message || "Gagal ambil data");
        // navigate("/pengaduan");
      } finally {
        setLoading(false);
      }
    };
    fetchKasus();
  }, [id, navigate]);


  const handleSubmitKasus = async () => {
    if (kasus?.status !== "Draf" && kasus?.status !== "Ditolak") {
      alert("Kasus ini tidak dapat disubmit karena sudah diproses atau menunggu verifikasi.");
      return;
    }

    if (!setujuKonfirmasi) {
      alert("Harap mencentang konfirmasi terlebih dahulu.");
      return;
    }

    const yakin = window.confirm(
      "Apakah Anda yakin ingin submit kasus ini?\nSetelah disubmit, data tidak dapat diubah lagi."
    );
    if (!yakin) return;

    setSubmitting(true);
    try {
      const res = await apiClient(`/kasus/${id}/submit`, {
        method: "PUT",
        body: { konfirmasi: setujuKonfirmasi },
      });
      alert(res.message || "Kasus berhasil disubmit!");
      setKasus((prev) => ({ ...prev, status: res.status || "Diverifikasi" }));
      navigate(`/kasus/${id}/proses`);
    } catch (err) {
      console.error("Gagal submit kasus:", err);
      alert(err.message || "Gagal submit kasus");
    } finally {
      setSubmitting(false);
    }
  };


  const handleDownloadPDF = () => {
    if (!kasus) return;
    downloadPengaduanPDF(kasus);
  };
  

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-blue-400 border-t-transparent rounded-full"></div>
      </div>
    );

  if (!kasus)
    return (
      <div className="p-6 text-center text-red-500 font-semibold">
        Kasus tidak ditemukan 😕
      </div>
    );

  const renderImage = (path, alt) =>
    path ? (
      <img
        src={`http://localhost:3000${path}`}
        alt={alt}
        className="mt-2 w-40 border rounded-lg shadow-sm"
      />
    ) : null;
  
    const renderImageModern = (path, label = "Foto") => (
      <div className="mt-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
    
        <div className="flex justify-start">
          <div className="border rounded-xl p-3 shadow-sm bg-gray-50 hover:shadow-md transition-all w-40">
            {path ? (
              <img
                src={buildFileUrl(path)}
                alt={label}
                className="w-full h-40 object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-40 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-sm">
                Tidak ada foto
              </div>
            )}
          </div>
        </div>
      </div>
    );
    

  return (
    <>
      <KasusNavbar />
      

      <div className="max-w-5xl mx-auto" ref={pdfRef}>
        <div className="bg-white rounded-xl shadow p-6 max-w-3xl mx-auto mb-6">
          <h1 className="text-3xl font-bold text-gray-700 mb-2">
            📄 Detail Pengaduan
          </h1>
          <p className="text-sm text-gray-500">
            ID Kasus: <span className="font-mono">{kasus?.id}</span>
          </p>
          <span
            className={`inline-block mt-3 px-3 py-1 text-xs rounded-full font-medium ${kasus.status === "Draf"
              ? "bg-gray-200 text-gray-700"
              : kasus.status === "Diproses"
                ? "bg-yellow-100 text-yellow-700"
                : kasus.status === "Diterima"
                  ? "bg-green-100 text-green-700"
                  : kasus.status === "Selesai"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-red-100 text-red-700"

              }`}
          >
            Status: {kasus?.status?.toUpperCase()}
          </span>

          {/* 👇 Akan tampil ketika status Ditolak */}
          {kasus.status === "Ditolak" && kasus.alasanPenolakan && (
            <p className="mt-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-2">
              <strong>Alasan Penolakan:</strong> {kasus.alasanPenolakan}
            </p>
          )}
        </div>


        <div className="space-y-6">
          {/* Data Diri */}
          {kasus && (
            <section className="bg-white rounded-xl shadow p-6 max-w-3xl mx-auto mb-6">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-gray-700">👤 Data Diri</h2>
              </div>
              <div className="grid grid-cols-2 gap-4 text-gray-700 text-sm">
                <p><b>Nama:</b> {kasus.pengadu_nama}</p>
                <p><b>Umur:</b> {kasus.pengadu_umur}</p>
                <p><b>Jenis Kelamin:</b> {kasus.pengadu_jenis_kelamin}</p>
                <p><b>Email:</b> {kasus.pengadu_email}</p>
                <p><b>No HP:</b> {kasus.pengadu_no_hp}</p>
                <p><b>Kabupaten/Kota:</b> {kasus.pengadu_kota}</p>
                <p className="col-span-2"><b>Alamat:</b> {kasus.pengadu_alamat}</p>
              </div>
              {/* FOTO + FILE PENDUKUNG SIDE BY SIDE */}
              <div className="flex flex-col sm:flex-row gap-6 mt-4">

                {/* Foto Identitas */}
                {renderImageModern(kasus.pengadu_foto_identitas, "Foto Identitas")}

                {/* File Pendukung / jika ada */}
                {kasus.pengadu_file_pendukung && (
                  kasus.pengadu_file_pendukung.endsWith(".pdf") ? (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Identitas Pendukung
                      </p>
                      <a
                        href={buildFileUrl(kasus.pengadu_file_pendukung)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block border px-4 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-sm text-blue-600 shadow"
                      >
                        📄 Lihat File Pendukung (PDF)
                      </a>
                    </div>
                  ) : (
                    renderImageModern(
                      kasus.pengadu_file_pendukung,
                      "Identitas Pendukung"
                    )
                  )
                )}

              </div>
            </section>
          )}

          {/* Pelaku Usaha */}
          {Array.isArray(kasus?.pelaku_usaha) && kasus.pelaku_usaha.length > 0 ? (
            <section className="bg-white rounded-xl shadow p-6 max-w-3xl mx-auto mb-6">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-gray-700">🏢 Pelaku Usaha</h2>
              </div>

              <div className="space-y-4">

                {[...kasus.pelaku_usaha]
                  .sort((a, b) =>
                    new Date(a.created_at || 0) - new Date(b.created_at || 0) ||
                    a.id - b.id
                  )
                  .map((pu, index) => (
                    <div
                      key={pu.id || index}
                      className="border rounded-lg p-4 bg-gray-50"
                    >
                      <h3 className="font-semibold text-gray-800 mb-2">
                        Pelaku Usaha #{index + 1}
                      </h3>

                      <div className="grid grid-cols-2 gap-4 text-gray-700 text-sm">
                        <p><b>Nama Pemilik:</b> {pu.pemilik || "-"}</p>
                        <p><b>Perusahaan:</b> {pu.perusahaan || "-"}</p>
                        <p><b>Kabupaten/Kota:</b> {pu.kota || "-"}</p>
                        <p><b>No HP:</b> {pu.no_hp || "-"}</p>
                        <p className="col-span-2"><b>Alamat:</b> {pu.alamat || "-"}</p>
                      </div>
                    </div>
                  ))}

              </div>
            </section>
          ) : (
            <section className="bg-white rounded-xl shadow p-6 max-w-3xl mx-auto mb-6">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-gray-700">🏢 Pelaku Usaha</h2>
              </div>

              <p className="text-gray-500 italic">Belum ada pelaku usaha.</p>
            </section>
          )}

          {/* Tentang Pengaduan */}
          {kasus && (
            <section className="bg-white rounded-xl shadow p-6 max-w-3xl mx-auto mb-6">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-gray-700">📢 Tentang Pengaduan</h2>
              </div>
              <div className="grid grid-cols-2 gap-4 text-gray-700 text-sm">
                <p><b>Jenis Pengaduan:</b> {kasus.jenis_pengaduan}</p>
                <p><b>Tanggal:</b> {formatDate(kasus.tanggal_kejadian)}</p>
                <p><b>Lokasi:</b> {kasus.lokasi_kejadian}</p>
                <p><b>Jenis Kerugian:</b> {kasus.jenis_kerugian}</p>
                <p className="col-span-2"><b>Keterangan:</b> {kasus.keterangan_kerugian}</p>
              </div>
              
              {renderImageModern(kasus.foto_bukti, "Foto Bukti")}
            </section>
          )}

          {/* Kronologis */}
          {kasus && (
            <section className="bg-white rounded-xl shadow p-6 max-w-3xl mx-auto mb-6">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-gray-700">🕓 Kronologis</h2>
              </div>
              <p className="text-gray-700 text-sm whitespace-pre-line mb-2">
                {kasus.kronologis}
              </p>
              <p className="text-sm text-gray-700">
                <b>Jenis Tuntutan:</b> {kasus.jenis_tuntutan}
              </p>
              {renderImage(kasus.file_bukti, "Bukti Kronologis")}
            </section>
          )}

          {/* Hasil */}
          {/* Hasil – hanya muncul jika status Selesai */}
          {kasus && kasus.status === "Selesai" && (
            <section className="bg-white rounded-xl shadow p-6 max-w-3xl mx-auto mb-6">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-gray-700">📄 Hasil</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 text-sm mb-4">
                <p><b>Jumlah Kerugian:</b> {formatRupiah(kasus.jumlah_kerugian)}</p>
                <p><b>Metode Penyelesaian:</b> {kasus.metode_penyelesaian ?? "-"}</p>
                <p><b>Hasil Sidang:</b> {kasus.hasil_sidang ?? "-"}</p>
                {/* jika mau tambahkan field lain, susun di sini */}
              </div>

              <div className="mt-4">
                <label className="block font-semibold mb-1">File Sidang</label>

                {fileUrl ? (
                  <div className="p-4 border rounded-lg shadow-sm bg-white flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-800">
                        {/* {kasus?.file_sidang?.split('/').pop()} */}
                        file_sidang.pdf
                      </p>
                      <p className="text-sm text-gray-500">File hasil sidang</p>
                    </div>

                    <div className="flex gap-2">
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                      >
                        Lihat
                      </a>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">Tidak ada file sidang</p>
                )}
              </div>

  </section>
)}


        </div>

        {/* Checkbox Konfirmasi Submit */}

        {["Draf", "Ditolak"].includes(kasus.status) && (
          <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-300 p-3 rounded-lg mt-5 max-w-3xl mx-auto">
            <input
              type="checkbox"
              id="konfirmasi"
              className="mt-1 h-4 w-4"
              checked={setujuKonfirmasi}
              onChange={(e) => setSetujuKonfirmasi(e.target.checked)}
            />
            <label htmlFor="konfirmasi" className="text-sm text-gray-700">
              Saya menyatakan bahwa seluruh data yang saya isi sudah benar, lengkap, dan
              saya bertanggung jawab penuh atas pengajuan pengaduan ini.
            </label>
          </div>
        )}



        {/* Tombol Navigasi */}
        <div className="flex justify-between items-center mt-8 max-w-3xl mx-auto">
          
        <div>
        {["Diverifikasi", "Diterima", "Selesai"].includes(kasus.status) && (
          <button
            onClick={handleDownloadPDF}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition"
          >
            ⬇️ Download PDF
          </button>
        )}
        </div>


          <div className="flex space-x-3">
            {(kasus?.status === "Draf" || kasus?.status === "Ditolak") && (
              <button
                onClick={handleSubmitKasus}
                disabled={submitting || !setujuKonfirmasi}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-sm transition disabled:bg-green-300"
              >
                {submitting ? "Mengirim..." : "✅ Submit Kasus"}
              </button>
            )}
          </div>
        </div>

        <Outlet />
      </div>
    </>
  );
}
