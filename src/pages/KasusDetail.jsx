import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import { Clock, CheckCircle, XCircle, ClipboardCheck, Edit3 } from "lucide-react";
import StatusBadge from "../assets/StatusBadge";
import PengaduanPage from "./PengaduanPage";

export default function KasusDetail({ data }) {
  const { id } = useParams(); // ambil id dari URL
  const navigate = useNavigate();
  const [kasus, setKasus] = useState(null);
  const [status, setStatus] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  // 🟢 Dummy role — ganti dengan sistem loginmu (misalnya dari context/auth)
const USER_ROLE = "admin"; // atau "user"

  useEffect(() => {
    // ✅ Dummy data simulasi dari formData
    const dummy = {
      id,
      nomorRegistrasi: `REG-${Date.now()}`,
      tanggal: new Date().toISOString().split("T")[0],
      nama: "Budi Santoso",
      tanggalLahir: "1990-05-12",
      umur: 35,
      gender: "Laki-laki",
      alamat: "Jl. Merdeka No. 12",
      kodepos: "40123",
      kota: "Bandung",
      telepon: "08123456789",
      email: "budi@example.com",
      nik: "3210123456789000",
      fotoIdentitas: "https://via.placeholder.com/150",
      namaPemilik: "Budi Santoso",
      namaUsaha: "PT Elektronik Jaya",
      alamatUsaha: "Jl. Industri No. 45",
      kodeposUsaha: "40111",
      kotaUsaha: "Bandung",
      teleponUsaha: "0229876543",
      kronologis:
        "Saya membeli produk elektronik namun mengalami kerusakan dan tidak dapat klaim garansi.",
      lampiran: ["BuktiTransaksi.pdf", "FotoKerusakan.jpg"],
      persetujuan: true,
      status: "Pending",
    };

    setKasus(dummy);
    setStatus(dummy.status);
  }, [id]);

  if (!kasus) return <p className="p-4">Memuat data...</p>;

  // 🧾 Download PDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Laporan Pengaduan Konsumen", 10, 20);

    doc.setFontSize(12);
    doc.text(`Nomor Registrasi: ${kasus.nomorRegistrasi}`, 10, 40);
    doc.text(`Nama: ${kasus.nama}`, 10, 50);
    doc.text(`Email: ${kasus.email}`, 10, 60);
    doc.text(`Telepon: ${kasus.telepon}`, 10, 70);
    doc.text(`Alamat: ${kasus.alamat}`, 10, 80);
    doc.text(`Kronologis: ${kasus.kronologis}`, 10, 100, { maxWidth: 180 });
    doc.text(`Status: ${kasus.status}`, 10, 130);

    doc.save(`Pengaduan_${kasus.nomorRegistrasi}.pdf`);
  };

  // 🟡 Simulasi ubah status
  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    setKasus((prev) => ({ ...prev, status: newStatus }));
  };

  // 🏷️ Badge warna status
  const getStatusColor = (status) => {
    switch (status) {
      case "Diterima":
        return "bg-green-100 text-green-700 border-green-400";
      case "Ditolak":
        return "bg-red-100 text-red-700 border-red-400";
      case "Selesai":
        return "bg-blue-100 text-blue-700 border-blue-400";
      default:
        return "bg-yellow-100 text-yellow-700 border-yellow-400";
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-xl border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Detail Kasus #{kasus.id}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <p><strong>No Registrasi:</strong> {kasus.nomorRegistrasi}</p>
          <p><strong>Tanggal:</strong> {kasus.tanggal}</p>
          <p><strong>Nama:</strong> {kasus.nama}</p>
          <p><strong>Email:</strong> {kasus.email}</p>
          <p><strong>Telepon:</strong> {kasus.telepon}</p>
          <p><strong>Kota:</strong> {kasus.kota}</p>
        </div>
        <div>
          <p><strong>Nama Usaha:</strong> {kasus.namaUsaha}</p>
          <p><strong>Alamat Usaha:</strong> {kasus.alamatUsaha}</p>
          <p><strong>Kota Usaha:</strong> {kasus.kotaUsaha}</p>
          <p><strong>Telepon Usaha:</strong> {kasus.teleponUsaha}</p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold text-gray-700 mb-2">Kronologis</h3>
        <p className="bg-gray-50 border p-3 rounded-lg text-sm text-gray-800">
          {kasus.kronologis}
        </p>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold text-gray-700 mb-2">Lampiran</h3>
        <ul className="list-disc pl-5 space-y-1 text-blue-600 text-sm">
          {kasus.lampiran.map((f, i) => (
            <li key={i}>
              <a href="#" className="hover:underline">{f}</a>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <span className={`px-3 py-1 text-sm rounded-full border ${getStatusColor(status)}`}>
          {status}
        </span>

        {/* 🟠 Tampilkan tombol ubah status hanya jika admin */}
        {USER_ROLE === "admin" && (
          <div className="flex gap-2 ml-2">
            {["Pending", "Diterima", "Ditolak", "Selesai"].map((s) => (
              <button
                key={s}
                onClick={() => handleStatusChange(s)}
                className={`px-3 py-1 rounded-full text-xs border ${
                  status === s
                    ? getStatusColor(s)
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tombol aksi */}
      <div className="flex gap-3">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition"
        >
          ← Kembali
        </button>
        <button
          onClick={handleDownloadPDF}
          className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-md transition"
        >
          Download Semua
        </button>
      </div>
    </div>
  );
}
