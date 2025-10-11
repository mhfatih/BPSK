import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Register() {
  const [form, setForm] = useState({
    nama_lengkap: "",
    email: "",
    password: "",
    role:"user",
    confirm_password: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Registrasi berhasil!");

        // ✅ Jika backend mengirim token JWT
        if (data.token) {
          localStorage.setItem("token", data.token);
        }

        navigate("/login"); // atau navigate("/dashboard") kalau auto-login
      } else {
        alert(data.message || "Registrasi gagal");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Terjadi kesalahan koneksi ke server.");
    } finally {
      setLoading(false);
    }
  };
    


  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
      {/* Box Register */}
      <div className="bg-white text-gray-800 shadow-2xl rounded-lg p-6 w-full max-w-md border-t-4 border-[#43A047]">
        {/* Header */}
        <h2 className="text-xl font-bold text-center mb-1 text-[#43A047]">E-Lapor</h2>
        <p className="text-sm text-center text-gray-600 mb-6">
          Sistem Pengaduan Sengketa Konsumen - Registrasi
        </p>
      <form
        onSubmit={handleSubmit}
      >
        <input
        type="text"
        placeholder="Nama Lengkap"
        value={form.nama_lengkap}
        onChange={(e) => setForm({ ...form, nama_lengkap: e.target.value })}
        className="w-full mb-4 p-3 rounded-md text-black border focus:ring-2 focus:ring-[#43A047]"
        required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full mb-4 p-3 rounded-md text-black border focus:ring-2 focus:ring-[#43A047]"
            required
          />
          
        {/* 👇 Role hidden, tetap dikirim ke API */}
        <input type="hidden" value={form.role} readOnly />
        
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full mb-4 p-3 rounded-md text-black border focus:ring-2 focus:ring-[#43A047]"
            required
        />
        <input
            type="password"
            placeholder="Konfirmasi Password"
            value={form.confirm_password}
            onChange={(e) => setForm({ ...form, confirm_password: e.target.value })}
            className="w-full mb-4 p-3 rounded-md text-black border focus:ring-2 focus:ring-[#43A047]"
            required
        />
        
        <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#43A047] hover:bg-[#2E7D32] text-white py-2 rounded-md font-medium transition ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Mendaftarkan..." : "Daftar"}
          </button>

        <p className="text-sm text-center mt-4">
          Sudah punya akun?{" "}
          <Link to="/login" className="text-[#1E88E5] font-medium hover:underline">
            Login
          </Link>
        </p>
      </form>
          </div>
          </div>
  );
}
