// src/components/Tooltip.jsx
import React from "react";

const Tooltip = ({ text, children }) => {
  if (!text) return children;

  return (
    <div className="relative group inline-block">
      {/* Elemen yang di-hover */}
      {children}

      {/* Tooltip-nya */}
      <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 bg-gray-800 text-white text-sm rounded-lg px-3 py-1 w-max max-w-xs shadow-lg z-10 transition-all duration-200">
        {text}
      </span>
    </div>
  );
};

export default Tooltip;
