import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Outlet } from "react-router-dom";
import { apiClient } from "../api/apiClient";

import jsPDF from "jspdf";
import logo from "../assets/LogoBanten.png";
import { formatDate } from "../assets/FormatDate";

export default function ViewPengaduan() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [kasus, setKasus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [verifikasiStatus, setVerifikasiStatus] = useState("");
  const [alasanPenolakan, setAlasanPenolakan] = useState("");

  // Ambil user dari localStorage
  const userData = localStorage.getItem("user");
  const currentUser = userData ? JSON.parse(userData) : null;

  // 🔹 Tambahkan ref untuk menangkap area PDF
  const pdfRef = useRef();

  useEffect(() => {
    const fetchKasus = async () => {
      try {
        const data = await apiClient(`/kasus/${id}`);
        console.log("Data kasus dari API:", data);

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

    const yakin = window.confirm(
      "Apakah Anda yakin ingin submit kasus ini?\nSetelah disubmit, data tidak dapat diubah lagi."
    );
    if (!yakin) return;

    setSubmitting(true);
    try {
      const res = await apiClient(`/kasus/${id}/submit`, {
        method: "PUT",
      });
      alert(res.message || "Kasus berhasil disubmit!");
      setKasus((prev) => ({ ...prev, status: res.status || "Diproses" }));
    } catch (err) {
      console.error("Gagal submit kasus:", err);
      alert(err.message || "Gagal submit kasus");
    } finally {
      setSubmitting(false);
    }
  };

  // 🧾 Fungsi untuk download ke PDF
  const handleDownloadPDF = () => {
    try {
      const pdf = new jsPDF("p", "mm", "a4");

      const img = new Image();
      img.src = logo;
      pdf.addImage(img, "PNG", 12, 15, 25, 20); // x, y, width, height
      pdf.addImage(img, "PNG", 175, 15, 25, 20); // x, y, width, height
      // 🔹 KOP SURAT
      pdf.setFont("times", "bold");
      pdf.setFontSize(14);
      pdf.text("BADAN PENYELESAIAN SENGKETA KONSUMEN (BPSK)", 105, 20, { align: "center" });
      pdf.text("PROVINSI BANTEN WILAYAH KERJA PROVINSI I", 105, 27, { align: "center" });

      pdf.setFont("times", "italic");
      pdf.setFontSize(10);
      pdf.text("Ruko Permata Cisadane, Jl. Teuku Umar Bojong Jaya, Karawaci Kota Tangerang Banten 15115", 105, 33, { align: "center" });

      // 🔹 Garis pembatas bawah kop surat
      pdf.setDrawColor(0);
      pdf.setLineWidth(0.6);
      pdf.line(15, 37, 195, 37);

      // 🔹 Judul Dokumen
      pdf.setFontSize(13);
      pdf.setFont("times", "bold");
      pdf.text("LAPORAN PENGADUAN KASUS KONSUMEN", 105, 50, { align: "center" });

      // 🔹 Isi Dokumen
      pdf.setFont("times", "normal");
      pdf.setFontSize(11);
      let y = 65;

      pdf.text(`Nomor Kasus   : ${kasus?.id || "-"}`, 20, y);
      y += 8;
      pdf.text(`Nama Pelapor  : ${kasus?.pelapor || "-"}`, 20, y);
      y += 8;
      pdf.text(`Jenis Pengaduan : ${kasus?.jenis_pengaduan || "-"}`, 20, y);
      y += 8;
      pdf.text(`Tanggal Kejadian : ${formatDate(kasus?.tanggal_kejadian) || "-"}`, 20, y);
      y += 8;
      pdf.text(`Lokasi Kejadian : ${kasus?.lokasi_kejadian || "-"}`, 20, y);
      y += 8;
      pdf.text(`Jenis Kerugian : ${kasus?.jenis_kerugian || "-"}`, 20, y);
      y += 10;

      // 🔹 Paragraf penjelasan
      const keterangan = kasus?.keterangan_kerugian || "Tidak ada keterangan tambahan.";
      const splitText = pdf.splitTextToSize(keterangan, 170);
      pdf.text("Keterangan Kerugian:", 20, y);
      y += 7;
      pdf.text(splitText, 25, y);
      y += splitText.length * 6 + 10;

      // 🔹 Tanda tangan
      pdf.text("Banten, " + new Date().toLocaleDateString("id-ID"), 140, y);
      y += 25;
      pdf.text("(....................................)", 140, y);
      pdf.text("Petugas Verifikator", 145, y + 7);

      // 🔹 Simpan PDF
      pdf.save(`Pengaduan_${kasus?.id || "data"}.pdf`);
    } catch (err) {
      console.error("Gagal membuat PDF:", err);
      alert("Terjadi kesalahan saat membuat PDF");
    }
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

  const renderEditButton = (route) =>
    (kasus?.status === "Draf" || kasus?.status === "Ditolak") && (
      <button
        onClick={() => navigate(route)}
        className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-md text-xs font-medium transition"
      >
        ✏️ Edit
      </button>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* 🔽 Tombol Download PDF */}
      <button
        onClick={handleDownloadPDF}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition"
      >
        ⬇️ Download PDF
      </button>
      <div className="max-w-5xl mx-auto" ref={pdfRef}>
        <div className="bg-white shadow-md rounded-2xl p-6 mb-6">
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

          {/* 👇 Akan tampil terus selama data kasus punya alasanPenolakan */}
          {kasus.alasanPenolakan && (
            <p className="mt-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-2">
              <strong>Alasan Penolakan:</strong> {kasus.alasanPenolakan}
            </p>
          )}
        </div>


        <div className="space-y-6">
          {/* Data Diri */}
          {kasus?.data_diri && (
            <section className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-gray-700">👤 Data Diri</h2>
                {renderEditButton(`/dashboard/pengaduan/${id}/data-diri`)}
              </div>
              <div className="grid grid-cols-2 gap-4 text-gray-700 text-sm">
                <p><b>Nama:</b> {kasus.data_diri.pengadu_nama}</p>
                <p><b>Umur:</b> {kasus.data_diri.pengadu_umur}</p>
                <p><b>Jenis Kelamin:</b> {kasus.data_diri.pengadu_jenis_kelamin}</p>
                <p><b>Email:</b> {kasus.data_diri.pengadu_email}</p>
                <p><b>No HP:</b> {kasus.data_diri.pengadu_no_hp}</p>
                <p className="col-span-2"><b>Alamat:</b> {kasus.data_diri.pengadu_alamat}</p>
              </div>
              {renderImage(kasus.data_diri?.foto_identitas, "Foto Identitas")}
            </section>
          )}

          {/* Pelaku Usaha */}
          {kasus?.pelaku_usaha && (
            <section className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-gray-700">🏢 Pelaku Usaha</h2>
                {renderEditButton(`/dashboard/pengaduan/${id}/pelaku-usaha`)}
              </div>
              <div className="grid grid-cols-2 gap-4 text-gray-700 text-sm">
                <p><b>Nama Pemilik:</b> {kasus.pelaku_usaha.nama_pemilik}</p>
                <p><b>Perusahaan:</b> {kasus.pelaku_usaha.perusahaan}</p>
                <p><b>Kota:</b> {kasus.pelaku_usaha.kota}</p>
                <p><b>No HP:</b> {kasus.pelaku_usaha.no_hp}</p>
                <p className="col-span-2"><b>Alamat:</b> {kasus.pelaku_usaha.alamat}</p>
              </div>
            </section>
          )}

          {/* Tentang Pengaduan */}
          {kasus?.pengaduan && (
            <section className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-gray-700">📢 Tentang Pengaduan</h2>
                {renderEditButton(`/dashboard/pengaduan/${id}/tentang-pengaduan`)}
              </div>
              <div className="grid grid-cols-2 gap-4 text-gray-700 text-sm">
                <p><b>Jenis Pengaduan:</b> {kasus.pengaduan.jenis_pengaduan}</p>
                <p><b>Tanggal:</b> {formatDate(kasus.pengaduan.tanggal_kejadian)}</p>
                <p><b>Lokasi:</b> {kasus.pengaduan.lokasi_kejadian}</p>
                <p><b>Jenis Kerugian:</b> {kasus.pengaduan.jenis_kerugian}</p>
                <p className="col-span-2"><b>Keterangan:</b> {kasus.pengaduan.keterangan_kerugian}</p>
              </div>
              {renderImage(kasus.pengaduan?.foto_bukti, "Foto Bukti")}
            </section>
          )}

          {/* Kronologis */}
          {kasus?.kronologis && (
            <section className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-gray-700">🕓 Kronologis</h2>
                {renderEditButton(`/dashboard/pengaduan/${id}/kronologis-pengaduan`)}
              </div>
              <p className="text-gray-700 text-sm whitespace-pre-line mb-2">
                {kasus.kronologis.kronologis}
              </p>
              <p className="text-sm text-gray-700">
                <b>Jenis Tuntutan:</b> {kasus.kronologis.jenis_tuntutan}
              </p>
              {renderImage(kasus.kronologis?.file_bukti, "Bukti Kronologis")}
            </section>
          )}
        </div>

        {/* Tombol Navigasi */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={() => navigate(`/dashboard/pengaduan/${id}/kronologis-pengaduan`)}
            className="px-5 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg shadow-sm transition"
          >
            ← Kembali
          </button>

          <div className="flex space-x-3">
            {(kasus?.status === "Draf" || kasus?.status === "Ditolak") && (
              <button
                onClick={handleSubmitKasus}
                disabled={submitting}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-sm transition disabled:bg-green-300"
              >
                {submitting ? "Mengirim..." : "✅ Submit Kasus"}
              </button>
            )}

            {/* ✅ Section Verifikasi Kasus (Hanya untuk admin/superadmin) */}

            {["admin", "superadmin"].includes(currentUser?.role) &&
              ["Diproses", "Diterima"].includes(kasus?.status) && (
                <section className="bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl p-6 border border-gray-100 mb-6 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                      <span className="text-blue-600">🧾</span> Verifikasi Kasus
                    </h2>
                    <span className="text-sm text-gray-500">
                      Role: <b className="capitalize">{currentUser?.role}</b>
                    </span>
                  </div>

                  <div className="flex flex-col gap-4">
                    {/* Dropdown Status */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">Pilih Status Verifikasi</label>
                      <select
                        className="border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-100 rounded-lg p-3 w-full transition-all outline-none"
                        value={verifikasiStatus}
                        onChange={(e) => setVerifikasiStatus(e.target.value)}
                      >
                        <option value="">-- Pilih Status --</option>
                        <option value="Diterima">✅ Diterima</option>
                        <option value="Ditolak">❌ Ditolak</option>
                        {/* <option value="Selesai">🏁 Selesai</option> */}
                      </select>
                    </div>

                    {/* Alasan Penolakan */}
                    {verifikasiStatus === "Ditolak" && (
                      <div>
                        <label className="block text-gray-700 font-medium mb-1">Alasan Penolakan</label>
                        <textarea
                          className="w-full border border-gray-300 focus:border-red-500 focus:ring focus:ring-red-100 rounded-lg p-3 resize-none outline-none transition-all"
                          rows="3"
                          placeholder="Tuliskan alasan penolakan di sini..."
                          value={alasanPenolakan}
                          onChange={(e) => setAlasanPenolakan(e.target.value)}
                        />
                      </div>
                    )}

                    {/* Tombol Aksi */}
                    <div className="flex justify-end">
                      <button
                        onClick={async () => {
                          if (!verifikasiStatus) {
                            alert("Silakan pilih status verifikasi terlebih dahulu.");
                            return;
                          }

                          try {
                            const res = await await apiClient(`/kasus/${id}/verify`, {
                              method: "PUT",
                              body: {
                                status: verifikasiStatus,
                                alasanPenolakan: verifikasiStatus === "Ditolak" ? alasanPenolakan : null
                              }
                            });

                            alert(res.message || "Verifikasi berhasil!");
                            setKasus((prev) => ({
                              ...prev,
                              status: res.status || verifikasiStatus,
                              alasanPenolakan: res.alasanPenolakan || alasanPenolakan,
                            }));
                          } catch (err) {
                            console.error("Gagal verifikasi kasus:", err);
                            alert(err.message || "Gagal memverifikasi kasus");
                          }
                        }}
                        className={`px-6 py-3 rounded-lg font-medium text-white shadow-md transition-all 
                        ${verifikasiStatus === "Ditolak"
                            ? "bg-red-600 hover:bg-red-700"
                            : verifikasiStatus === "Diterima"
                              ? "bg-green-600 hover:bg-green-700"
                              : "bg-blue-600 hover:bg-blue-700"
                          }`}
                      >
                        Kirim Verifikasi
                      </button>
                    </div>
                  </div>
                </section>
              )}

          </div>
        </div>

        <Outlet />
      </div>
    </div>
  );
}
