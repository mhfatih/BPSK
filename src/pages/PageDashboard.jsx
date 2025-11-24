// src/pages/DashboardPage.jsx
import React, { useEffect, useState } from "react";
import { Card } from "../components/Card";
import { apiClient } from "../api/apiClient";
import { LineChart, Line, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

export default function DashboardPage() {
  const [summary, setSummary] = useState({
    total: 0, diproses: 0, selesai: 0, ditolak: 0
  });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // contoh fetch ringkasan — sesuaikan endpointmu
    (async () => {
      try {
        const data = await apiClient("/kasus/summary", { method: "GET" });
        setSummary(data.summary || { total: 0, diproses: 0, selesai: 0, ditolak: 0 });
        setChartData(data.chart || [
          { name: "Jan", a: 10 },
          { name: "Feb", a: 20 },
        ]);
      } catch (err) {
        console.warn("Gagal ambil summary:", err);
      }
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Total Pengaduan" value={summary.total} icon="📄" />
        <Card title="Dalam Proses" value={summary.diproses} icon="⚙️" />
        <Card title="Selesai" value={summary.selesai} icon="✅" />
        <Card title="Ditolak" value={summary.ditolak} icon="❌" />
      </div>

      <div className="bg-white rounded-2xl shadow p-6">
        <h3 className="font-semibold text-gray-700 mb-4">Tren Bulanan</h3>
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="a" stroke="#2563eb" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
