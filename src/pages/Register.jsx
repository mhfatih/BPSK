import React, { useState } from "react";
import { apiClient } from "../api/apiClient";
import logo from "../assets/LogoBanten.png";
import bgImage from "../assets/LogoBanten.png";

const Register = () => {
  const [email, setEmail] = useState("");
  const [nama, setNama] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

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
        body: { email, nama, password, confirm_password: confirmPassword },
      });

      // Reset form
      setEmail("");
      setNama("");
      setPassword("");
      setConfirmPassword("");

      // Tampilkan popup sukses
      setShowSuccessPopup(true);
    } catch (err) {
      console.error("Register error:", err);
      setError(err.message || "Gagal registrasi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen relative">
      {/* Bagian Kiri */}
      <div
        className="hidden md:flex w-1/2 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.85), rgba(255,255,255,0.85)), url(${bgImage})`,
        }}
      ></div>

      {/* Bagian Kanan */}
      <div className="flex w-full md:w-1/2 items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center mb-6">
            <img src={logo} alt="Logo" className="w-20 h-20 mb-2" />
            <h2 className="text-2xl font-bold text-blue-900 text-center">
              Daftar Akun E-BPSK Banten
            </h2>
            <p className="text-gray-600 text-sm text-center">
              Silahkan isi data anda untuk membuat akun
            </p>
          </div>

          <form onSubmit={handleRegister}>
            {error && (
              <div className="bg-red-100 text-red-600 p-2 rounded mb-3 text-sm">
                {error}
              </div>
            )}

            <div className="mb-3">
              <label className="block text-gray-700 text-sm mb-1">Nama</label>
              <input
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Masukkan nama lengkap"
                required
              />
            </div>

            <div className="mb-3">
              <label className="block text-gray-700 text-sm mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Masukkan email"
                required
              />
            </div>

            <div className="mb-3">
              <label className="block text-gray-700 text-sm mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Masukkan password"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-1">
                Konfirmasi Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Ulangi password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 rounded-lg transition font-medium shadow"
            >
              {loading ? "Memproses..." : "Daftar"}
            </button>
          </form>

          <p className="text-center text-sm mt-4 text-gray-600">
            Sudah mempunyai akun?{" "}
            <a href="/login" className="text-blue-700 hover:underline font-semibold">
              masuk di sini
            </a>
          </p>
        </div>
      </div>

      {/* Pop-up Sukses */}
      {showSuccessPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-80 text-center">
            <img
              src={logo}
              alt="Logo Banten"
              className="w-16 h-16 mx-auto mb-3"
            />

            <h3 className="text-2xl font-bold text-blue-900 text-center mb-2">
              Registrasi Berhasil
            </h3>
            <p className="text-gray-500 mb-4 mt-2 text-center">
              Akun Anda berhasil dibuat! Silakan login untuk melanjutkan.
            </p>
            <button
              onClick={() => (window.location.href = "/login")}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 rounded-lg transition font-medium shadow"
            >
              Ke Halaman Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
