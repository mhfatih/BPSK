import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import { Clock, CheckCircle, XCircle, ClipboardCheck, Edit3 } from "lucide-react";
import StatusBadge from "../assets/StatusBadge";

export default function KasusDetail({ data }) {
  const { id } = useParams(); // ambil id dari URL
  const navigate = useNavigate();
  const [kasus, setKasus] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    // ✅ sementara pakai dummy data
    const dummy = {
      id,
      nomor: `REG-${2025000 + parseInt(id)}`,
      pengadu: `Pengadu ${id}`,
      pelakuUsaha: `PT Usaha ${id}`,
      tanggal: "2025-09-21",
      status: "Pending",
      deskripsi: "Pengaduan mengenai sengketa pembelian barang elektronik.",
      dokumen: [
        { id: 1, nama: "Surat Pengaduan.pdf", url: "#" },
        { id: 2, nama: "Bukti Transaksi.jpg", url: "#" },
      ],
    };
    setKasus(dummy);
    setNewStatus(dummy.status);
  }, [id]);

  if (!kasus) {
    return <p className="p-4">Memuat data...</p>;
  }

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Laporan Pengaduan Sengketa Konsumen", 10, 20);

    doc.setFontSize(12);
    doc.text(`Nomor Pendaftaran: ${kasus.nomor}`, 10, 40);
    doc.text(`Pengadu: ${kasus.pengadu}`, 10, 50);
    doc.text(`Pelaku Usaha: ${kasus.pelakuUsaha}`, 10, 60);
    doc.text(
        `Tanggal Pengaduan: ${new Date(kasus.tanggal).toLocaleDateString("id-ID")}`,
        10,
        70
      );
    doc.text(`Status: ${kasus.status}`, 10, 80);

    doc.text("Deskripsi:", 10, 100);
    doc.text(kasus.deskripsi || "-", 10, 110, { maxWidth: 180 });

    doc.save(`Surat_Pengaduan_${kasus.nomor}.pdf`);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-xl border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Detail Kasus #{kasus.id}
      </h2>

      {/* Informasi utama */}
      <div className="space-y-3 text-gray-700 mb-6">
        <p><strong>No. Registrasi:</strong> {kasus.nomor}</p>
        <p><strong>Pengadu:</strong> {kasus.pengadu}</p>
        <p><strong>Pelaku Usaha:</strong> {kasus.pelakuUsaha}</p>
        <p>
          <strong>Tanggal Pengaduan:</strong>{" "}
          {new Date(kasus.tanggal).toLocaleDateString("id-ID")}
        </p>

        <div className="flex items-center gap-2">
          <strong>Status:</strong>
          {!editMode ? (
            <>
              <StatusBadge status={kasus.status} />
              <button
                onClick={() => setEditMode(true)}
                className="text-blue-600 hover:text-blue-800"
                title="Edit Status"
              >
                <Edit3 size={18} />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="border px-3 py-1 rounded text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="Pending">Pending</option>
                <option value="Diterima">Diterima</option>
                <option value="Ditolak">Ditolak</option>
                <option value="Selesai">Selesai</option>
              </select>
              <button
                onClick={handleSaveStatus}
                className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
              >
                Simpan
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="px-3 py-1 text-sm bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Batal
              </button>
            </div>
          )}
        </div>

        <p>
          <strong>Deskripsi:</strong> <br />
          <span className="text-gray-600">{kasus.deskripsi}</span>
        </p>
      </div>

      {/* Dokumen */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-800 mb-2">Dokumen Terlampir</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
          {kasus.dokumen.map((doc) => (
            <li key={doc.id}>
              <a
                href={doc.url}
                className="text-blue-600 hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                {doc.nama}
              </a>
            </li>
          ))}
        </ul>
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
