import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Contoh data dummy
const data = [
  { name: "Jan", aplikasi: 40, kasus: 24 },
  { name: "Feb", aplikasi: 30, kasus: 13 },
  { name: "Mar", aplikasi: 20, kasus: 98 },
  { name: "Apr", aplikasi: 27, kasus: 39 },
  { name: "May", aplikasi: 18, kasus: 48 },
  { name: "Jun", aplikasi: 23, kasus: 38 },
  { name: "Jul", aplikasi: 34, kasus: 43 },
];

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Cards ringkas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white shadow rounded-xl p-4">
          <h3 className="text-gray-500 text-sm">Total Aplikasi</h3>
          <p className="text-2xl font-bold text-blue-600">205</p>
        </div>
        <div className="bg-white shadow rounded-xl p-4">
          <h3 className="text-gray-500 text-sm">Active</h3>
          <p className="text-2xl font-bold text-green-600">195</p>
        </div>
        <div className="bg-white shadow rounded-xl p-4">
          <h3 className="text-gray-500 text-sm">Master Data</h3>
          <p className="text-2xl font-bold text-orange-500">4</p>
        </div>
        <div className="bg-white shadow rounded-xl p-4">
          <h3 className="text-gray-500 text-sm">Hardware</h3>
          <p className="text-2xl font-bold text-purple-600">12</p>
        </div>
      </div>

      {/* Chart besar */}
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Statistik Aplikasi & Kasus</h2>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="aplikasi"
              stroke="#2563eb"
              strokeWidth={3}
            />
            <Line
              type="monotone"
              dataKey="kasus"
              stroke="#f43f5e"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>

      
      

  );
}
