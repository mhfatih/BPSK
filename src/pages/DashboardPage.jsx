import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  HiOutlineDocumentText,
  HiOutlineCog,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
} from "react-icons/hi";

// ✅ Data dummy contoh (bisa diganti dengan data API)
const summary = [
  { title: "Total Pengaduan", value: 132, icon: <HiOutlineDocumentText size={28} />, color: "text-blue-600 bg-blue-100" },
  { title: "Dalam Proses", value: 56, icon: <HiOutlineCog size={28} />, color: "text-yellow-600 bg-yellow-100" },
  { title: "Selesai", value: 62, icon: <HiOutlineCheckCircle size={28} />, color: "text-green-600 bg-green-100" },
  { title: "Ditolak", value: 14, icon: <HiOutlineXCircle size={28} />, color: "text-red-600 bg-red-100" },
];

const data = [
  { name: "Jan", pengaduan: 40, selesai: 24 },
  { name: "Feb", pengaduan: 30, selesai: 13 },
  { name: "Mar", pengaduan: 20, selesai: 48 },
  { name: "Apr", pengaduan: 27, selesai: 39 },
  { name: "May", pengaduan: 18, selesai: 42 },
  { name: "Jun", pengaduan: 23, selesai: 33 },
  { name: "Jul", pengaduan: 34, selesai: 51 },
];

const latestReports = [
  { id: 1, nama: "User A", judul: "Sengketa Pembelian Motor", status: "Proses" },
  { id: 2, nama: "User B", judul: "Layanan Garansi HP", status: "Ditolak" },
  { id: 3, nama: "User C", judul: "Produk Rusak", status: "Selesai" },
  { id: 4, nama: "User D", judul: "Kesalahan Transaksi Online", status: "Proses" },
];

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* ===== RINGKASAN KARTU ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {summary.map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-md p-5 flex items-center gap-4 hover:shadow-lg hover:scale-[1.02] transition"
          >
            <div className={`p-3 rounded-full ${item.color}`}>{item.icon}</div>
            <div>
              <h3 className="text-gray-500 text-sm">{item.title}</h3>
              <p className="text-2xl font-bold text-gray-700">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ===== GRAFIK TREN ===== */}
      <div className="bg-white shadow rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Tren Pengaduan & Kasus Selesai (Per Bulan)
        </h2>

        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorPengaduan" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorSelesai" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" className="text-gray-200" />
            <XAxis dataKey="name" tick={{ fill: "#6b7280" }} />
            <YAxis tick={{ fill: "#6b7280" }} />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="pengaduan"
              stroke="#3b82f6"
              fill="url(#colorPengaduan)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="selesai"
              stroke="#10b981"
              fill="url(#colorSelesai)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* ===== AKTIVITAS TERBARU ===== */}
      <div className="bg-white shadow rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Aktivitas Pengaduan Terbaru
        </h2>
        <ul className="divide-y divide-gray-200">
          {latestReports.map((r) => (
            <li key={r.id} className="py-4 flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-800">{r.judul}</p>
                <p className="text-sm text-gray-500">{r.nama}</p>
              </div>
              <span
                className={`text-sm font-semibold px-3 py-1 rounded-full ${
                  r.status === "Selesai"
                    ? "bg-green-100 text-green-600"
                    : r.status === "Ditolak"
                    ? "bg-red-100 text-red-600"
                    : "bg-yellow-100 text-yellow-600"
                }`}
              >
                {r.status}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
