import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { apiClient } from "../api/apiClient";
import PasswordStrength from "../components/PasswordStrength"; // optional

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

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

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Silakan masukkan password baru kamu"
    >
      {message && (
        <div className="bg-green-50 border border-green-300 text-green-700 p-3 rounded-lg text-sm mb-4">
          {message}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-300 text-red-700 p-3 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Password Baru */}
        <div>
          <label className="block text-gray-700 text-sm mb-1">
            Password Baru
          </label>
          <input
            type="password"
            className="w-full border rounded-xl p-2.5 shadow-sm bg-gray-50 focus:ring-2 focus:ring-blue-600/40 outline-none"
            placeholder="Masukkan password baru..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />

          {/* Opsional */}
          <PasswordStrength password={password} />
        </div>

        {/* Konfirmasi Password */}
        <div>
          <label className="block text-gray-700 text-sm mb-1">
            Konfirmasi Password
          </label>
          <input
            type="password"
            className="w-full border rounded-xl p-2.5 shadow-sm bg-gray-50 focus:ring-2 focus:ring-blue-600/40 outline-none"
            placeholder="Konfirmasi password..."
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        {/* Tombol Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white py-2.5 rounded-xl shadow-md font-medium transition duration-200 transform hover:-translate-y-0.5 disabled:bg-blue-400"
        >
          {loading ? "Memproses..." : "Reset Password"}
        </button>

        <p className="text-center text-sm text-gray-600 mt-2">
          Kembali ke{" "}
          <a href="/login" className="text-blue-700 font-semibold hover:underline">
            Login
          </a>
        </p>
      </form>
    </AuthLayout>
  );
}
