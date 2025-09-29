import { useState } from "react";
import { Link } from "react-router-dom";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    konfpass: "",
    captcha: "",
  });
  const { executeRecaptcha } = useGoogleReCaptcha();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!executeRecaptcha) {
            alert("Captcha belum siap, coba lagi.");
            return;
        }

        const handleCaptcha = (value) => {
            console.log("Captcha value:", value);
            setVerified(true); // ✅ jika user lolos captcha
        };
      
        // ✅ Dapatkan token dari reCAPTCHA v3
        const token = await executeRecaptcha("login_form");
        console.log("reCAPTCHA token:", token);

        // Kirim data + token ke backend
        const payload = { ...form, recaptchaToken: token };
        console.log("Payload:", payload);

        // contoh fetch:
    // await fetch("/api/login", { method: "POST", body: JSON.stringify(payload) })
    }
    
  

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
          <input
            type="password"
            placeholder="Konfirmasi Password"
            value={form.konfpass}
            onChange={(e) => setForm({ ...form, konfpass: e.target.value })}
                      className="w-full mb-4 p-3 rounded-md text-black border focus:ring-2 focus:ring-[#1E88E5]"
                      required
          />

          {/* Captcha
          <ReCAPTCHA
            sitekey="6LcudNUrAAAAAJ1LjiIKcWK-ixsSP4ZVZCTX4Pd1" // ganti dengan site key dari Google reCAPTCHA
            onChange={handleCaptcha}
            className="mb-4"
          /> */}
            
        

          {/* Tombol Login */}
          <button
            type="submit"
            className="w-full bg-[#1E88E5] hover:bg-[#1565C0] text-white py-2 rounded-md font-medium transition"
          >
            Login
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
