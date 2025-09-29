import { Link } from "react-router-dom";
import { useState } from "react";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    konfpass: "",
  });

  const handleSubmit = (e) => {
      e.preventDefault();
      
      if (form.password !== form.konfpass) {
        alert("Password dan Konfirmasi Password tidak sama!");
        return;
      }

    console.log("Register data:", form);
    // TODO: panggil API register pakai fetch/axios
    };
    


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* Box Register */}
      <div className="bg-gray-700 text-white shadow-2xl rounded-lg p-6 w-full max-w-md">
        {/* Header */}
        <h2 className="text-lg font-semibold text-center mb-1">E-Lapor</h2>
        <p className="text-sm text-center text-gray-300 mb-6">
          Sistem Pengaduan Sengketa Konsumen - Registrasi
        </p>
      <form
        onSubmit={handleSubmit}
        
      >

        <input
        type="text"
        placeholder="Nama Lengkap"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="w-full mb-4 p-3 rounded-md text-black border focus:ring-2 focus:ring-teal-400"
        required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full mb-4 p-3 rounded-md text-black border focus:ring-2 focus:ring-teal-400"
            required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full mb-4 p-3 rounded-md text-black border focus:ring-2 focus:ring-teal-400"
            required
        />
        <input
            type="password"
            placeholder="Konfirmasi Password"
            value={form.konfpass}
            onChange={(e) => setForm({ ...form, konfpass: e.target.value })}
            className="w-full mb-4 p-3 rounded-md text-black border focus:ring-2 focus:ring-teal-400"
            required
        />
        


        <button
          type="submit"
          className="w-full bg-teal-500 hover:bg-teal-600 text-white py-2 rounded-md font-medium"
        >
          Registrasi
        </button>

        <p className="text-sm text-center mt-4 text-gray-300">
          Sudah punya akun?{" "}
          <Link to="/login" className="text-blue-400 font-medium hover:underline">
            Login
          </Link>
        </p>
      </form>
          </div>
          </div>
  );
}
