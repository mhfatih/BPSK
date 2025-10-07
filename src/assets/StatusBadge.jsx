import { Clock, CheckCircle, XCircle, ClipboardCheck } from "lucide-react";

const StatusBadge = ({ status }) => {
  const iconMap = {
    Pending: <Clock size={16} className="mr-1" />,
    Diterima: <CheckCircle size={16} className="mr-1" />,
    Ditolak: <XCircle size={16} className="mr-1" />,
    Selesai: <ClipboardCheck size={16} className="mr-1" />,
  };

  const colorMap = {
    Pending: "bg-yellow-100 text-yellow-800",
    Diterima: "bg-green-100 text-green-800",
    Ditolak: "bg-red-100 text-red-800",
    Selesai: "bg-blue-100 text-blue-800",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
        colorMap[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {iconMap[status]}
      {status}
    </span>
  );
};

export default StatusBadge;
