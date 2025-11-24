// src/components/ui/Card.jsx
export function Card({ title, value, icon }) {
    return (
      <div className="bg-white shadow-sm rounded-2xl p-5 hover:shadow-lg transition">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400">{title}</p>
            <p className="text-2xl font-semibold text-gray-800">{value}</p>
          </div>
          <div className="text-2xl text-blue-600">{icon}</div>
        </div>
      </div>
    );
  }