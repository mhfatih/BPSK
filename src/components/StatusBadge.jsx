// src/components/ui/StatusBadge.jsx
export default function StatusBadge({ status }) {
    const map = {
      Draf: "bg-gray-100 text-gray-700",
      Diproses: "bg-yellow-100 text-yellow-800",
      Ditolak: "bg-red-100 text-red-700",
      Diterima: "bg-green-100 text-green-700",
      Selesai: "bg-blue-100 text-blue-700",
    };
    return (
      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${map[status] || "bg-gray-100 text-gray-700"}`}>
        {status}
      </span>
    );
  }