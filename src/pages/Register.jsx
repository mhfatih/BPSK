import React, { useState } from "react";
import { apiClient } from "../api/apiClient";
import AuthLayout from "../components/AuthLayout";
import PasswordStrength from "../components/PasswordStrength";

const Register = () => {
  const [email, setEmail] = useState("");
  const [nama, setNama] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Password dan konfirmasi tidak sama");
      setLoading(false);
      return;
    }

    try {
      await apiClient("/register", {
        method: "POST",
        body: {
          email,
          nama,
          password,
          confirm_password: confirmPassword,
        },
      });

      window.location.href = "/verify-otp";
    } catch (err) {
      console.error("Register error:", err);
      setError(err.message || "Gagal registrasi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Daftar Akun E-BPSK Banten"
      subtitle="Silakan isi data Anda untuk membuat akun"
    >
      
      <form onSubmit={handleRegister} className="space-y-4">

        {error && (
          <div className="bg-red-50 text-red-700 border border-red-200 p-2 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* NAMA */}
        <div>
          <label className="block text-gray-700 text-sm mb-1">Nama</label>
          <input
            type="text"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            className="w-full border rounded-xl p-2.5 shadow-sm focus:ring-2 focus:ring-blue-500/40 outline-none"
            placeholder="Masukkan nama lengkap"
            required
          />
        </div>

        {/* EMAIL */}
        <div>
          <label className="block text-gray-700 text-sm mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-xl p-2.5 shadow-sm focus:ring-2 focus:ring-blue-500/40 outline-none"
            placeholder="Masukkan email"
            required
          />
        </div>

        {/* PASSWORD */}
        <div>
          <label className="block text-gray-700 text-sm mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-xl p-2.5 shadow-sm focus:ring-2 focus:ring-blue-500/40 outline-none"
            placeholder="Masukkan password"
            required
          />
          <PasswordStrength password={password} />
        </div>

        {/* CONFIRM PASSWORD */}
        <div>
          <label className="block text-gray-700 text-sm mb-1">Konfirmasi Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border rounded-xl p-2.5 shadow-sm focus:ring-2 focus:ring-blue-500/40 outline-none"
            placeholder="Ulangi password"
            required
          />
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white py-2.5 rounded-xl shadow-md font-medium transition transform hover:-translate-y-0.5"
        >
          {loading ? "Memproses..." : "Daftar"}
        </button>
      </form>

      <p className="text-center text-sm mt-4 text-gray-600">
        Sudah punya akun?{" "}
        <a href="/login" className="text-blue-700 hover:underline font-semibold">
          Masuk di sini
        </a>
      </p>
    </AuthLayout>
  );
};

export default Register;
