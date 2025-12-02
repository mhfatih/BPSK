import React, { useEffect, useMemo, useState } from "react";
import { apiClient } from "../api/apiClient";
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
import { Bar, Pie, Line } from "react-chartjs-2";
import { Info, TrendingUp } from "lucide-react";

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

export default function DashboardModern() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // filters
  const [year, setYear] = useState(new Date().getFullYear());
  const [wilayahFilter, setWilayahFilter] = useState("Semua");
  const [jenisFilter, setJenisFilter] = useState("Semua");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await apiClient("/dashboard");
        setData(res || {});
      } catch (err) {
        console.error("Gagal ambil dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  // safe accessors / fallbacks
  const statusArr = data?.status || [];
  const wilayahArr = data?.wilayah || [];
  const jenisArr = data?.jenis_pengaduan || [];
  const sidangPerBulan = data?.sidang_per_bulan || [];
  const latestCases = data?.latest_cases || data?.recent_cases || [];
  const topPerusahaan = data?.top_perusahaan || [];

  // derive filter options
  const wilayahOptions = useMemo(() => {
    const opts = new Set(wilayahArr.map((w) => w.wilayah));
    return ["Semua", ...Array.from(opts)];
  }, [wilayahArr]);

  const jenisOptions = useMemo(() => {
    const opts = new Set(jenisArr.map((j) => j.jenis_pengaduan));
    return ["Semua", ...Array.from(opts)];
  }, [jenisArr]);

  // prepare chart data with filters applied
  const statusChart = useMemo(() => {
    const labels = statusArr.map((s) => s.status);
    const values = statusArr.map((s) => s.jumlah);
    return {
      labels,
      datasets: [
        {
          label: "Jumlah Kasus",
          data: values,
          backgroundColor: labels.map((_, i) => `rgba(${40 + i * 30}, 99, 255, 0.8)`),
        },
      ],
    };
  }, [statusArr]);

  const wilayahChart = useMemo(() => {
    const labels = wilayahArr.map((w) => w.wilayah);
    const values = wilayahArr.map((w) => w.jumlah);
    const colors = ["#60A5FA", "#FBBF24", "#34D399", "#F87171", "#A78BFA", "#F472B6"];
    return {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: labels.map((_, i) => colors[i % colors.length]),
        },
      ],
    };
  }, [wilayahArr]);

  const jenisChart = useMemo(() => {
    const labels = jenisArr.map((j) => j.jenis_pengaduan);
    const values = jenisArr.map((j) => j.jumlah);
    return {
      labels,
      datasets: [
        {
          label: "Jumlah",
          data: values,
          backgroundColor: "rgba(59,130,246,0.85)",
        },
      ],
    };
  }, [jenisArr]);

  const sidangChart = useMemo(() => {
    // attempt to filter by year if bulan includes year property
    const labels = sidangPerBulan.map((s) => s.bulan);
    const values = sidangPerBulan.map((s) => s.jumlah);
    return {
      labels,
      datasets: [
        {
          label: "Sidang per Bulan",
          data: values,
          fill: false,
          borderColor: "rgba(16,185,129,0.9)",
          tension: 0.2,
        },
      ],
    };
  }, [sidangPerBulan]);

  // quick insights
  const insights = useMemo(() => {
    const topStatus = statusArr.slice().sort((a, b) => b.jumlah - a.jumlah)[0];
    const topWilayah = wilayahArr.slice().sort((a, b) => b.jumlah - a.jumlah)[0];
    const topJenis = jenisArr.slice().sort((a, b) => b.jumlah - a.jumlah)[0];
    return {
      topStatus: topStatus ? `${topStatus.status} (${topStatus.jumlah})` : "-",
      topWilayah: topWilayah ? `${topWilayah.wilayah} (${topWilayah.jumlah})` : "-",
      topJenis: topJenis ? `${topJenis.jenis_pengaduan} (${topJenis.jumlah})` : "-",
    };
  }, [statusArr, wilayahArr, jenisArr]);

  if (loading) return <p className="text-center mt-10">Loading data...</p>;
  if (!data) return <p className="text-center text-red-600 mt-10">Gagal memuat data.</p>;

  return (
    <div className="p-4 md:p-6">
      {/* Header, filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Dashboard Kasus BPSK</h1>
          <p className="text-sm text-gray-500 mt-1">Ringkasan kinerja & statistik pengaduan</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="border rounded px-3 py-2 text-sm bg-white"
          >
            {/* try to render a small range of years */}
            {Array.from({ length: 5 }).map((_, i) => {
              const y = new Date().getFullYear() - i;
              return (
                <option key={y} value={y}>
                  {y}
                </option>
              );
            })}
          </select>

          {/* <select
            value={wilayahFilter}
            onChange={(e) => setWilayahFilter(e.target.value)}
            className="border rounded px-3 py-2 text-sm bg-white"
          >
            {wilayahOptions.map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select> */}

          {/* <select
            value={jenisFilter}
            onChange={(e) => setJenisFilter(e.target.value)}
            className="border rounded px-3 py-2 text-sm bg-white"
          >
            {jenisOptions.map((j) => (
              <option key={j} value={j}>
                {j}
              </option>
            ))}
          </select> */}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="p-4 bg-white rounded-2xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Kasus</p>
              <p className="text-2xl font-bold text-gray-800">{data.total_kasus ?? 0}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <TrendingUp className="text-blue-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">Periode: {year}</p>
        </div>

        <div className="p-4 bg-white rounded-2xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Perusahaan Terlibat</p>
              <p className="text-2xl font-bold text-gray-800">{data.total_perusahaan ?? 0}</p>
            </div>
            <div className="p-3 bg-indigo-50 rounded-lg">
              {/* <Bank className="text-indigo-600" /> */}
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">Unique companies</p>
        </div>

        <div className="p-4 bg-white rounded-2xl shadow-sm border col-span-1 sm:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Kerugian</p>
              <p className="text-xl font-semibold text-gray-800">Rp {data.kerugian?.total_kerugian?.toLocaleString() ?? 0}</p>
              <p className="text-sm text-gray-500 mt-1">Rata-rata: Rp {data.kerugian?.rata_kerugian?.toLocaleString() ?? 0}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <Info className="text-green-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">Data akumulasi kerugian</p>
        </div>
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Left: Status bar (wide) */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl shadow-sm border">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-800">Distribusi Status</h3>
            <p className="text-sm text-gray-500">Urut berdasarkan jumlah</p>
          </div>
          <div className="h-72">
            <Bar data={statusChart} options={{ maintainAspectRatio: false }} />
          </div>

          <div className="mt-4 flex flex-wrap gap-2 text-sm text-gray-600">
            <span className="px-3 py-1 bg-gray-100 rounded-full">Top status: {insights.topStatus}</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full">Top wilayah: {insights.topWilayah}</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full">Top jenis: {insights.topJenis}</span>
          </div>
        </div>

        {/* Right: Pie wilayah */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-800">Wilayah</h3>
            <p className="text-sm text-gray-500">Persentase kasus per wilayah</p>
          </div>

          <div className="h-56">
            <Pie data={wilayahChart} options={{ maintainAspectRatio: false }} />
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
            {wilayahArr.map((w) => (
              <div key={w.wilayah} className="flex items-center justify-between">
                <span className="text-gray-700">{w.wilayah}</span>
                <span className="font-semibold">{w.jumlah}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lower charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-5 rounded-2xl shadow-sm border">
          <h3 className="text-lg font-semibold mb-3">Jenis Pengaduan</h3>
          <div className="h-64">
            <Bar data={jenisChart} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border">
          <h3 className="text-lg font-semibold mb-3">Sidang per Bulan</h3>
          <div className="h-64">
            <Line data={sidangChart} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      {/* Insights + mini tables */}
      <div className="grid  gap-6 w-full">
        <div className="bg-white p-5 rounded-2xl shadow-sm border">
          <h3 className="text-lg font-semibold mb-3">Insights</h3>
          <ul className="text-sm text-gray-700 space-y-2">
            <li>• Status terbanyak: <strong>{insights.topStatus}</strong></li>
            <li>• Wilayah terbanyak: <strong>{insights.topWilayah}</strong></li>
            <li>• Jenis pengaduan terbanyak: <strong>{insights.topJenis}</strong></li>
            <li>• Total kasus: <strong>{data.total_kasus ?? 0}</strong></li>
          </ul>
        </div>

        {/* <div className="bg-white p-5 rounded-2xl shadow-sm border lg:col-span-2">
          <h3 className="text-lg font-semibold mb-3">Kasus Terbaru</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="text-left text-gray-600">
                  <th className="pb-2">No. Reg</th>
                  <th className="pb-2">Pengadu</th>
                  <th className="pb-2">Perusahaan</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {latestCases.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-gray-500">Tidak ada data</td>
                  </tr>
                ) : (
                  latestCases.map((c) => (
                    <tr key={c.id} className="border-t">
                      <td className="py-3">{c.no_registrasi || "-"}</td>
                      <td className="py-3">{c.pengadu_nama || "-"}</td>
                      <td className="py-3">{(c.perusahaan_list || []).join(", ") || "-"}</td>
                      <td className="py-3 font-medium">{c.status || "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div> */}
      </div>

    </div>
  );
}
