import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    konfpass: "",
    role:"user", // default role (user/admin tergantung sistem)
    captcha: "",
  });
  const { executeRecaptcha } = useGoogleReCaptcha();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    if (!executeRecaptcha) {
      alert("Captcha belum siap, coba lagi.");
      setLoading(false);
      return;
    }
  
    try {
      const token = await executeRecaptcha("login_form");
  
      const payload = {
        email: form.email,
        password: form.password,
        konfpassword: form.konfpass,
        role: form.role,
        recaptchaToken: token,
      };
  
      const res = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include", // 🟢 penting untuk cookie
      });
  
      const data = await res.json();
  
      if (res.ok) {
        alert("Login berhasil!");
        localStorage.setItem("token", data.token); // simpan token JWT misalnya
        localStorage.setItem("user", JSON.stringify(data.user)); // simpan nama_lengkap
        console.log("User after login:", data.user)
        navigate("/dashboard");
        
      } else {
        alert(data.message || "Login gagal!");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan koneksi.");
    } finally {
      setLoading(false);
    }
  };
  
    
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
      {/* Box login */}
          <div className="bg-white text-gray-800 shadow-2xl rounded-lg p-6 w-full max-w-md border-t-4 border-[#1E88E5]">
        {/* Header */}
        <h2 className="text-xl font-bold text-center mb-1 text-[#1E88E5]">
          E-Lapor
        </h2>
        <p className="text-sm text-center text-gray-600 mb-6">
          Sistem Pengaduan Sengketa Konsumen - Login
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <input
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full mb-4 p-3 rounded-md text-black border focus:ring-2 focus:ring-[#1E88E5]"
                      required
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full mb-4 p-3 rounded-md text-black border focus:ring-2 focus:ring-[#1E88E5]"
            required
                  />
                  
            {/* Password */}
          {/* <input
            type="password"
            placeholder="Konfirmasi Password"
            value={form.konfpass}
            onChange={(e) => setForm({ ...form, konfpass: e.target.value })}
                      className="w-full mb-4 p-3 rounded-md text-black border focus:ring-2 focus:ring-[#1E88E5]"
                      required
          /> */}

          {/* 👇 Role hidden, tetap dikirim ke API */}
          <input type="hidden" value={form.role} readOnly />

          {/* Captcha
          <ReCAPTCHA
            sitekey="6LcudNUrAAAAAJ1LjiIKcWK-ixsSP4ZVZCTX4Pd1" // ganti dengan site key dari Google reCAPTCHA
            onChange={handleCaptcha}
            className="mb-4"
          /> */}
            
        

          {/* Tombol Login */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#1E88E5] hover:bg-[#1565C0] text-white py-2 rounded-md font-medium transition ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Memproses..." : "Login"}
          </button>
        </form>

        {/* Link tambahan */}
        <div className="mt-5 text-sm text-gray-600">
          <p className="text-sm text-center mt-4">
            Belum punya akun?{" "}
            <Link to="/register" className="text-[#43A047] font-medium hover:underline">
                Daftar
            </Link>
        </p>
          {/* <p className="mb-2">
            Belum dapat link aktivasi?{" "}
            <button className="bg-yellow-400 text-black px-2 py-1 rounded text-xs font-medium hover:bg-yellow-500">
              Kirim Ulang Aktivasi
            </button>
          </p> */}
          {/* <p>
            Lupa password?{" "}
            <button className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium hover:bg-red-600">
              Ganti Password
            </button>
          </p> */}
        </div>
      </div>
    </div>
  );
}

// Bungkus dengan provider
