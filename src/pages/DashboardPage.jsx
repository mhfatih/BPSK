import { useEffect, useState } from "react";
import { apiClient } from "../api/apiClient";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const result = await apiClient("/dashboard");
        setData(result);
      } catch (err) {
        console.error("Gagal ambil dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading data...</p>;
  if (!data) return <p className="text-center text-red-600 mt-10">Gagal memuat data.</p>;

  // Chart Data
  const statusChart = {
    labels: data.status.map((s) => s.status),
    datasets: [
      {
        label: "Jumlah Kasus",
        data: data.status.map((s) => s.jumlah),
      },
    ],
  };

  const wilayahChart = {
    labels: data.wilayah.map((w) => w.wilayah),
    datasets: [
      {
        label: "Kasus per Wilayah",
        data: data.wilayah.map((w) => w.jumlah),
      },
    ],
  };

  const jenisChart = {
    labels: data.jenis_pengaduan.map((j) => j.jenis_pengaduan),
    datasets: [
      {
        label: "Jumlah",
        data: data.jenis_pengaduan.map((j) => j.jumlah),
      },
    ],
  };

  const sidangChart = {
    labels: data.sidang_per_bulan.map((s) => s.bulan),
    datasets: [
      {
        label: "Sidang per Bulan",
        data: data.sidang_per_bulan.map((s) => s.jumlah),
      },
    ],
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6 text-gray-700">Dashboard Kasus BPSK</h1>

      {/* Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-white shadow rounded-lg border">
          <h2 className="text-sm text-gray-500">Total Kasus</h2>
          <p className="text-3xl font-bold">{data.total_kasus}</p>
        </div>

        <div className="p-6 bg-white shadow rounded-lg border">
          <h2 className="text-sm text-gray-500">Total Perusahaan Terlibat</h2>
          <p className="text-3xl font-bold">{data.total_perusahaan}</p>
        </div>

        <div className="p-6 bg-white shadow rounded-lg border">
          <h2 className="text-sm text-gray-500">Total Kerugian</h2>
          <p className="text-xl font-semibold">Rp {data.kerugian.total_kerugian?.toLocaleString()}</p>
          <h2 className="text-sm text-gray-500 mt-2">Rata-rata Kerugian</h2>
          <p className="text-lg">Rp {data.kerugian.rata_kerugian?.toLocaleString()}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Status */}
        <div className="bg-white p-6 shadow rounded-lg border">
          <h2 className="text-lg font-semibold mb-4">Kasus Berdasarkan Status</h2>
          <Bar data={statusChart} />
        </div>

        {/* Wilayah */}
        <div className="bg-white p-6 shadow rounded-lg border">
          <h2 className="text-lg font-semibold mb-4">Kasus per Wilayah</h2>
          <Pie data={wilayahChart} />
        </div>

        {/* Jenis */}
        <div className="bg-white p-6 shadow rounded-lg border">
          <h2 className="text-lg font-semibold mb-4">Jenis Pengaduan</h2>
          <Bar data={jenisChart} />
        </div>

        {/* Sidang */}
        <div className="bg-white p-6 shadow rounded-lg border">
          <h2 className="text-lg font-semibold mb-4">Sidang per Bulan</h2>
          <Line data={sidangChart} />
        </div>
      </div>
    </div>
  );
}
