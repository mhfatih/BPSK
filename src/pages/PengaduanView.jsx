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
  const [setujuKonfirmasi, setSetujuKonfirmasi] = useState(false);
  const [nomorDepan, setNomorDepan] = useState("");

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
    } catch (err) {
      console.error("Gagal submit kasus:", err);
      alert(err.message || "Gagal submit kasus");
    } finally {
      setSubmitting(false);
    }
  };

  const bulanKeRomawi = (bulan) => {
    const mapping = ["I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII"];
    return mapping[bulan];
  };
  
  const getDefaultNomorRegistrasi = (nomorDepan, wilayah) => {
    const now = new Date();
    const romawi = bulanKeRomawi(now.getMonth());
    const tahun = now.getFullYear();
  
    return `${nomorDepan}/Reg/BPSK${wilayah}.BTN/${romawi}/${tahun}`;
  };

  const nomorRegisFinal = getDefaultNomorRegistrasi(nomorDepan, kasus?.wilayah);

  // 🧾 Fungsi untuk download ke PDF
  const handleDownloadPDF = () => {
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const img = new Image();
      img.src = logo;
  
      const checkPageBreak = () => {
        if (y > 270) {
          pdf.addPage();
          y = 20;
        }
      };
  
      pdf.addImage(img, "PNG", 12, 15, 25, 20);
      pdf.addImage(img, "PNG", 175, 15, 25, 20);
  
      pdf.setFont("times", "bold");
      pdf.setFontSize(14);
      pdf.text("BADAN PENYELESAIAN SENGKETA KONSUMEN (BPSK)", 105, 20, { align: "center" });
      pdf.text("PROVINSI BANTEN WILAYAH KERJA PROVINSI I", 105, 27, { align: "center" });
  
      pdf.setFont("times", "italic");
      pdf.setFontSize(10);
      pdf.text("Ruko Permata Cisadane, Jl. Teuku Umar Bojong Jaya, Karawaci Kota Tangerang Banten 15115", 105, 33, { align: "center" });
  
      pdf.setDrawColor(0);
      pdf.setLineWidth(0.6);
      pdf.line(15, 37, 195, 37);
  
      pdf.setFontSize(13);
      pdf.setFont("times", "bold");
      pdf.text("LAPORAN PENGADUAN KASUS KONSUMEN", 105, 50, { align: "center" });
  
      pdf.setFont("times", "normal");
      pdf.setFontSize(11);
      let y = 65;
  
      // 🔸 Data Diri Pelapor
      pdf.text("DATA DIRI PELAPOR:", 20, y); y += 7;
      [
        `Nama              : ${kasus?.pengadu_nama || "-"}`,
        `Jenis Kelamin     : ${kasus?.pengadu_jenis_kelamin || "-"}`,
        `No. HP            : ${kasus?.pengadu_no_hp || "-"}`,
        `Alamat            : ${kasus?.pengadu_alamat || "-"}`,
        `Email             : ${kasus?.pengadu_email || "-"}`,
        `Kabupaten/Kota    : ${kasus?.pengadu_kota || "-"}`
      ].forEach(line => {
        pdf.text(line, 25, y); y += 6; checkPageBreak();
      });
      y += 4;
  
      // 🔸 Data Pelaku Usaha
      const pelakuList = kasus?.pelaku_usaha || [];
      if (pelakuList.length > 0) {
        pelakuList.forEach((pelaku, index) => {
          pdf.text(`Pelaku Usaha #${index + 1}:`, 25, y); y += 6; checkPageBreak();
          [
            `  Perusahaan      : ${pelaku?.perusahaan || "-"}`,
            `  Nama Pemilik    : ${pelaku?.pemilik || "-"}`,
            `  Kota            : ${pelaku?.kota || "-"}`,
            `  Alamat          : ${pelaku?.alamat || "-"}`,
            `  No. HP          : ${pelaku?.no_hp || "-"}`,
            `  Email           : ${pelaku?.email || "-"}`,
            `  Kode Pos        : ${pelaku?.kode_pos || "-"}`
          ].forEach(line => {
            pdf.text(line, 30, y); y += 6; checkPageBreak();
          });
          y += 2;
        });
      } else {
        pdf.text("Tidak ada data pelaku usaha.", 25, y); y += 8; checkPageBreak();
      }
  
      // 🔸 Tentang Pengaduan
      pdf.text("TENTANG PENGADUAN:", 20, y); y += 7; checkPageBreak();
      [
        `Jenis Pengaduan   : ${kasus?.jenis_pengaduan || "-"}`,
        `Tanggal Kejadian  : ${new Date(kasus?.tanggal_kejadian).toLocaleDateString("id-ID") || "-"}`,
        `Lokasi            : ${kasus?.lokasi_kejadian || kasus?.pelaku_usaha?.pengadu_pekerjaan || "-"}`,
        `Jenis Kerugian    : ${kasus?.jenis_kerugian || "-"}`
      ].forEach(line => {
        pdf.text(line, 25, y); y += 6; checkPageBreak();
      });
  
      const keteranganText = pdf.splitTextToSize(kasus?.keterangan_kerugian || "Tidak ada keterangan.", 170);
      pdf.text("Keterangan:", 25, y); y += 6; checkPageBreak();
      pdf.text(keteranganText, 30, y); y += keteranganText.length * 6 + 4; checkPageBreak();
  
      // 🔸 Kronologis
      const kronoText = pdf.splitTextToSize(kasus?.kronologis || "Tidak ada kronologi.", 170);
      pdf.text("KRONOLOGIS:", 20, y); y += 7; checkPageBreak();
      pdf.text(kronoText, 25, y); y += kronoText.length * 6 + 4; checkPageBreak();
  
      // 🔸 Jenis Tuntutan
      pdf.text(`Jenis Tuntutan    : ${kasus?.jenis_tuntutan || "-"}`, 25, y); y += 10; checkPageBreak();
  
      // 🔸 Bukti
      pdf.text("BUKTI PENDUKUNG:", 20, y); y += 7; checkPageBreak();
      [
        `Bukti Pembelian   : ${kasus?.bukti_pembelian || "-"}`,
        `Bukti Saksi       : ${kasus?.bukti_saksi || "-"}`,
        `Barang Bukti      : ${kasus?.barang_bukti || "-"}`
      ].forEach(line => {
        pdf.text(line, 25, y); y += 6; checkPageBreak();
      });
      y += 4;
  
      // 🔸 Hasil Musyawarah
      const hasilText = pdf.splitTextToSize(kasus?.hasil_musyawarah || "Belum ada hasil musyawarah.", 170);
      pdf.text("HASIL MUSYAWARAH:", 20, y); y += 7; checkPageBreak();
      pdf.text(hasilText, 25, y); y += hasilText.length * 6 + 4; checkPageBreak();
  
      // 🔸 Status Proses
      pdf.text("STATUS PENANGANAN:", 20, y); y += 7; checkPageBreak();
      [
        `Diproses oleh     : ${kasus?.processed_by || "-"}`,
        `Tanggal Proses    : ${new Date(kasus?.processed_at).toLocaleDateString("id-ID") || "-"}`,
        `Diselesaikan oleh : ${kasus?.finished_by || "-"}`,
        `Tanggal Selesai   : ${new Date(kasus?.finished_at).toLocaleDateString("id-ID") || "-"}`
      ].forEach(line => {
        pdf.text(line, 25, y); y += 6; checkPageBreak();
      });
      y += 10;
  
      // 🔸 Tanda tangan
      pdf.text("Banten, " + new Date().toLocaleDateString("id-ID"), 140, y); y += 25; checkPageBreak();
      pdf.text("(....................................)", 140, y);
      pdf.text("Petugas Verifikator", 145, y + 7);
  
      pdf.save(`Pengaduan_${kasus?.no_registrasi || "data"}.pdf`);
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
            <section className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-gray-700">👤 Data Diri</h2>
                {renderEditButton(`/pengaduan/${id}/data-diri`)}
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
              {renderImage(kasus.foto_identitas, "Foto Identitas")}
            </section>
          )}

          {/* Pelaku Usaha */}
          {Array.isArray(kasus?.pelaku_usaha) && kasus.pelaku_usaha.length > 0 ? (
            <section className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-gray-700">🏢 Pelaku Usaha</h2>
                {renderEditButton(`/pengaduan/${id}/pelaku-usaha`)}
              </div>

              <div className="space-y-4">
                {kasus.pelaku_usaha.map((pu, index) => (
                  <div
                    key={pu.id || index}
                    className="border rounded-lg p-4 bg-gray-50"
                  >
                    <h3 className="font-semibold text-gray-800 mb-2">
                      Pelaku Usaha #{index + 1}
                    </h3>

                    <div className="grid grid-cols-2 gap-4 text-gray-700 text-sm">
                      <p><b>Nama Pemilik:</b> {pu.nama_pemilik || "-"}</p>
                      <p><b>Perusahaan:</b> {pu.perusahaan || "-"}</p>
                      <p><b>Kota:</b> {pu.kota || "-"}</p>
                      <p><b>No HP:</b> {pu.no_hp || "-"}</p>
                      <p className="col-span-2"><b>Alamat:</b> {pu.alamat || "-"}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : (
            <section className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-gray-700">🏢 Pelaku Usaha</h2>
                {renderEditButton(`/pengaduan/${id}/pelaku-usaha`)}
              </div>

              <p className="text-gray-500 italic">Belum ada pelaku usaha.</p>
            </section>
          )}



          {/* Tentang Pengaduan */}
          {kasus && (
            <section className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-gray-700">📢 Tentang Pengaduan</h2>
                {renderEditButton(`/pengaduan/${id}/tentang-pengaduan`)}
              </div>
              <div className="grid grid-cols-2 gap-4 text-gray-700 text-sm">
                <p><b>Jenis Pengaduan:</b> {kasus.jenis_pengaduan}</p>
                <p><b>Tanggal:</b> {formatDate(kasus.tanggal_kejadian)}</p>
                <p><b>Lokasi:</b> {kasus.lokasi_kejadian}</p>
                <p><b>Jenis Kerugian:</b> {kasus.jenis_kerugian}</p>
                <p className="col-span-2"><b>Keterangan:</b> {kasus.keterangan_kerugian}</p>
              </div>
              {renderImage(kasus.foto_bukti, "Foto Bukti")}
            </section>
          )}

          {/* Kronologis */}
          {kasus && (
            <section className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-gray-700">🕓 Kronologis</h2>
                {renderEditButton(`/pengaduan/${id}/kronologis-pengaduan`)}
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
        </div>

        {/* Checkbox Konfirmasi Submit */}
        
        {["Draf", "Ditolak"].includes(kasus.status) && (
          <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-300 p-3 rounded-lg mt-5">
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
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={() => navigate(`/pengaduan/${id}/kronologis-pengaduan`)}
            className="px-5 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg shadow-sm transition"
          >
            ← Kembali
          </button>

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

            {/* ✅ Section Verifikasi Kasus (Hanya untuk admin/superadmin) */}

            {["admin", "superadmin"].includes(currentUser?.role) &&
              ["Diverifikasi"].includes(kasus?.status) && (
                <section className="bg-white shadow-sm border border-gray-200 rounded-xl p-6 mb-6 transition-all hover:shadow-md">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <span className="text-blue-500 text-xl">🧾</span> Verifikasi Kasus
                    </h2>
                    <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      Role: <b className="capitalize">{currentUser?.role}</b>
                    </span>
                  </div>

                  <div className="flex flex-col gap-6">

                    {/* Dropdown Status */}
                    <div className="flex flex-col gap-2">
                      <label className="text-gray-700 font-medium">Status Verifikasi</label>
                      <select
                        className="border border-gray-300 text-gray-700 rounded-lg p-3 bg-gray-50 hover:bg-white focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                        value={verifikasiStatus}
                        onChange={(e) => setVerifikasiStatus(e.target.value)}
                      >
                        <option value="">-- Pilih Status --</option>
                        <option value="Diterima">✅ Diterima</option>
                        <option value="Ditolak">❌ Ditolak</option>
                      </select>
                    </div>

                    {/* Nomor Registrasi (untuk status Diterima) */}
                    {verifikasiStatus === "Diterima" && (
                      <div className="flex flex-col gap-2">
                        <label className="text-gray-700 font-medium">Nomor Registrasi (Bagian Depan)</label>
                        <input
                          type="text"
                          className="border border-gray-300 rounded-lg p-3 bg-gray-50 focus:ring-2 focus:ring-blue-200 outline-none"
                          placeholder="Contoh: 001"
                          value={nomorDepan}
                          onChange={(e) => setNomorDepan(e.target.value)}
                        />

                        {nomorDepan && (
                          <p className="text-sm text-gray-600">
                            Nomor Registrasi Final:&nbsp;
                            <b>{getDefaultNomorRegistrasi(nomorDepan, kasus?.wilayah)}</b>
                          </p>
                        )}
                      </div>
                    )}


                    {/* Alasan Penolakan */}
                    {verifikasiStatus === "Ditolak" && (
                      <div className="flex flex-col gap-2">
                        <label className="text-gray-700 font-medium">Alasan Penolakan</label>
                        <textarea
                          className="w-full border border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100 rounded-lg p-3 bg-gray-50 resize-none transition-all outline-none"
                          rows="4"
                          placeholder="Tuliskan alasan penolakan..."
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

                          // Validasi nomor registrasi untuk status Diterima
                          if (verifikasiStatus === "Diterima" && !nomorDepan) {
                            alert("Nomor registrasi wajib diisi untuk status Diterima.");
                            return;
                          }

                          try {
                            const res = await apiClient(`/kasus/${id}/verify`, {
                              method: "PUT",
                              body: {
                                status: verifikasiStatus,
                                alasanPenolakan: verifikasiStatus === "Ditolak" ? alasanPenolakan : null,
                                no_registrasi:
                                  verifikasiStatus === "Diterima" ? nomorRegisFinal : null,
                              },
                            });

                            alert(res.message || "Verifikasi berhasil!");

                            setKasus((prev) => ({
                              ...prev,
                              status: res.status || verifikasiStatus,
                              nomorRegistrasi:
                                res.nomorRegistrasi ??
                                (verifikasiStatus === "Diterima"
                                  ? getDefaultNomorRegistrasi(nomorDepan, kasus?.wilayah)
                                  : null),
                              alasanPenolakan:
                                res.alasanPenolakan ??
                                (verifikasiStatus === "Ditolak" ? alasanPenolakan : null),
                            }));
                          } catch (err) {
                            console.error("Gagal verifikasi kasus:", err);
                            alert(err.message || "Gagal memverifikasi kasus");
                          }
                        }}
                        className={`
                          px-6 py-3 rounded-lg font-medium text-white shadow-md transition-all
                          ${
                            verifikasiStatus === "Ditolak"
                              ? "bg-red-600 hover:bg-red-700"
                              : verifikasiStatus === "Diterima"
                              ? "bg-green-600 hover:bg-green-700"
                              : "bg-blue-600 hover:bg-blue-700"
                          }
                        `}
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
