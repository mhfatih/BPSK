import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiClient } from "../api/apiClient";
import logo from "../assets/LogoBanten.png";
import bgImage from "../assets/background.jpg";

export default function ResetPassword() {
  const { token } = useParams(); // Ambil token dari URL
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null);
    setMessage(null);

    if (!password || !confirmPassword) {
      setError("Password wajib diisi");
      return;
    }

    if (password !== confirmPassword) {
      setError("Password tidak sama");
      return;
    }

    setLoading(true);

    try {
      const res = await apiClient(`/reset-password/${token}`, {
        method: "POST",
        body: {
          password,
          confirm_password: confirmPassword,
        },
      });

      setMessage(res.message);

      // Redirect otomatis setelah 2 detik
      setTimeout(() => {
        navigate("/login");
      }, 2000);

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

      {/* Bagian kanan */}
      <div className="flex w-full md:w-1/2 items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center mb-6">
            <img src={logo} alt="Logo" className="w-20 h-20 mb-2" />
            <h2 className="text-2xl font-bold text-blue-900 text-center">
              Reset Password
            </h2>
            <p className="text-gray-600 text-sm text-center">
              Silakan masukkan password baru kamu.
            </p>
          </div>

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

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-1">
                Password Baru
              </label>
              <input
                type="password"
                className="w-full border rounded-lg p-2 text-sm bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Password baru..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="mb-5">
              <label className="block text-gray-700 text-sm mb-1">
                Konfirmasi Password
              </label>
              <input
                type="password"
                className="w-full border rounded-lg p-2 text-sm bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Konfirmasi password..."
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              {loading ? "Memproses..." : "Reset Password"}
            </button>
          </form>

          <p className="text-center text-sm mt-4 text-gray-600">
            Kembali ke{" "}
            <a href="/login" className="text-blue-700 hover:underline font-semibold">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
