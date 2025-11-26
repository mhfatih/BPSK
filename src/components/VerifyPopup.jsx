// src/components/VerifyPopup.jsx
export default function VerifyPopup({ open, onClose, onConfirm }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full text-center">

        <h2 className="text-xl font-semibold mb-3">Konfirmasi</h2>
        <p className="text-gray-600 mb-6">
          Apakah kamu yakin ingin melanjutkan tindakan ini?
        </p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
          >
            Batal
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Ya, Lanjutkan
          </button>
        </div>
      </div>
    </div>
  );
}
