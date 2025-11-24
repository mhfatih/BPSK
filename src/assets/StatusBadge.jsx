import { Clock, CheckCircle, XCircle, ClipboardCheck, SquarePen, Eye } from "lucide-react";

const StatusBadge = ({ status }) => {

  const cleanStatus = status?.trim() || "";

  const iconMap = {
    Draf: <SquarePen className="w-4 h-4 mr-1" />,
    Diverifikasi: <Eye className="w-4 h-4 mr-1" />,
    Diterima: <CheckCircle className="w-4 h-4 mr-1" />,
    Ditolak: <XCircle className="w-4 h-4 mr-1" />,
    Diproses: <Clock className="w-4 h-4 mr-1" />,
    Selesai: <ClipboardCheck className="w-4 h-4 mr-1" />,
  };

  const colorMap = {
    Draf: "bg-gray-200 text-gray-700",
    Diverifikasi: "bg-yellow-100 text-yellow-800",
    Diterima: "bg-green-100 text-green-800",
    Ditolak: "bg-red-100 text-red-800",
    Diproses: "bg-yellow-100 text-yellow-800",
    Selesai: "bg-blue-100 text-blue-800",
  };

  console.log("=== STATUSBADGE DIPANGGIL ===", status);



  console.log("STATUS BADGE =", status, " | clean =", cleanStatus);
  
  console.log("ICON =", iconMap[cleanStatus]);
  console.warn("STATUSBADGE DIPANGGIL:", status);

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
        colorMap[cleanStatus] || "bg-gray-100 text-gray-600"
      }`}
    >
      {console.log("Render JSX:", cleanStatus)}
      {iconMap[cleanStatus]}
      
      {cleanStatus}
    </span>
  );
  
};

export default StatusBadge;
