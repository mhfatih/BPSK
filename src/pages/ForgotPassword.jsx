import { useState } from "react";
import { apiClient } from "../api/apiClient";
import logo from "../assets/LogoBanten.png"; 
import bgImage from "../assets/background.jpg";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Email wajib diisi");
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await apiClient("/forgot-password", {
        method: "POST",
        body: { email },
      });

      setMessage(res.message);
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="flex h-screen">
      {/* Bagian kiri (background image) */}
      <div
        className="hidden md:flex w-1/2 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.85), rgba(255,255,255,0.85)), url(${bgImage})`,
        }}
      ></div>

      {/* Bagian kanan (form) */}
      <div className="flex w-full md:w-1/2 items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">

          {/* Logo + Judul */}
          <div className="flex flex-col items-center mb-6">
            <img src={logo} alt="Logo" className="w-20 h-20 mb-2" />
            <h2 className="text-2xl font-bold text-blue-900 text-center">
              Reset Password
            </h2>
            <p className="text-gray-600 text-sm text-center">
              Masukkan email untuk menerima link reset password.
            </p>
          </div>

          {/* Notifikasi */}
          {message && (
            <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4 border border-green-300 text-sm">
              {message}
            </div>
          )}

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 border border-red-300 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full border rounded-lg p-2 text-sm bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Masukkan email kamu..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-lg text-white font-medium shadow transition ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-700 hover:bg-blue-800"
              }`}
            >
              {loading ? "Mengirim..." : "Kirim"}
            </button>
          </form>

          <p className="text-center text-sm mt-4 text-gray-600">
            Kembali ke{" "}
            <a
              href="/login"
              className="text-blue-700 font-semibold hover:underline"
            >
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
