import { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import { apiClient } from "../api/apiClient";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Email wajib diisi");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await apiClient("/forgot-password", {
        method: "POST",
        body: { email },
      });

      setMessage(res.message);
    } catch (err) {
      setError(err.message || "Terjadi kesalahan");
    }

    setLoading(false);
  };

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Masukkan email untuk menerima link reset password"
    >
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Success */}
        {message && (
          <div className="bg-green-50 text-green-700 border border-green-200 p-2 rounded-lg text-sm shadow-sm">
            {message}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 text-red-700 border border-red-200 p-2 rounded-lg text-sm shadow-sm">
            {error}
          </div>
        )}

        {/* Email */}
        <div>
          <label className="block text-gray-700 text-sm mb-1">Email</label>
          <input
            type="email"
            className="w-full border rounded-xl p-2.5 shadow-sm bg-gray-50
                       focus:ring-2 focus:ring-blue-500/40 outline-none transition"
            placeholder="Alamat Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-700 to-blue-800 
                     hover:from-blue-800 hover:to-blue-900
                     text-white py-2.5 rounded-xl shadow-md font-medium
                     transition transform hover:-translate-y-0.5"
        >
          {loading ? "Mengirim..." : "Kirim Link Reset"}
        </button>

        {/* Back to Login */}
        <p className="text-center text-sm text-gray-600 pt-1">
          Kembali ke{" "}
          <a href="/login" className="text-blue-700 font-semibold hover:underline">
            Login
          </a>
        </p>
      </form>
    </AuthLayout>
  );
}
