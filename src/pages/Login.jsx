import React, { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import { apiClient } from "../api/apiClient";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await apiClient("/login", {
        method: "POST",
        body: { email, password },
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({ id: data.id, role: data.role }));

      window.location.href = "/dashboard";
    } catch (err) {
      setError(err.message || "Gagal login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Selamat Datang"
      subtitle="Masukkan akun Anda untuk masuk"
    >
      <form onSubmit={handleLogin} className="space-y-4">

        {error && (
          <div className="bg-red-50 text-red-700 border border-red-200 p-2 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-gray-700 text-sm mb-1">Email</label>
          <input
            type="email"
            className="w-full border rounded-xl p-2.5 shadow-sm focus:ring-2 focus:ring-blue-500/40 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Alamat Email"
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm mb-1">Password</label>
          <input
            type="password"
            className="w-full border rounded-xl p-2.5 shadow-sm focus:ring-2 focus:ring-blue-500/40 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Kata Sandi"
          />
        </div>

        <div className="text-right">
          <a href="/forgot-password" className="text-blue-700 text-sm font-medium hover:underline">
            Lupa password?
          </a>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white py-2.5 rounded-xl shadow-md font-medium transition transform hover:-translate-y-0.5"
        >
          {loading ? "Memproses..." : "Masuk"}
        </button>

        <p className="text-center text-sm text-gray-600 pt-1">
          Belum punya akun?{" "}
          <a href="/register" className="text-blue-700 font-semibold hover:underline">
            Daftar
          </a>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;
