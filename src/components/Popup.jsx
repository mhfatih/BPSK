import React from "react";

const Popup = ({
  show,
  title,
  message,
  mode = "info", // info, success, confirm, input
  confirmText = "OK",
  cancelText = "Batal",
  onClose,
  onConfirm,
  onCancel,
  inputValue,
  setInputValue,
  logo,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-80 text-center">

        {logo && (
          <img src={logo} alt="Logo" className="w-16 h-16 mx-auto mb-3" />
        )}

        <h3 className="text-xl font-bold text-blue-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4">{message}</p>

        {/* Mode input (punya text field) */}
        {mode === "input" && (
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full border rounded-lg p-2 text-sm mb-4"
            placeholder="Isi di sini..."
          />
        )}

        {/* Tombol */}
        <div className="flex gap-3">
          {mode === "confirm" && (
            <button
              onClick={onCancel}
              className="flex-1 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              {cancelText}
            </button>
          )}

          <button
            onClick={mode === "confirm" ? onConfirm : onClose}
            className="flex-1 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
