import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../api/apiClient";
import PasswordStrength from "../components/PasswordStrength";

export default function ChangePasswordPage() {
  const navigate = useNavigate();

  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  

  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.new_password !== passwordData.confirm_password) {
      alert("Password baru dan konfirmasi tidak cocok!");
      return;
    }

    try {
      const res = await apiClient("/change-password", {
        method: "PUT",
        body: passwordData,
      });

      alert(res.message || "Password berhasil diubah!");
      navigate("/profile");
    } catch (err) {
      alert(err.message || "Gagal mengubah password");
    }
  };

  // 🟩 warna strength bar
  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500"];

  return (
    <div className="max-w-lg mx-auto bg-white border border-gray-200 p-8 mt-10 rounded-xl shadow-sm">
      <h1 className="text-2xl font-semibold mb-6 text-gray-700">
        Ubah Password
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Password Lama */}
        <div>
          <label className="block text-sm mb-1 font-medium">Password Lama</label>
          <input
            type="password"
            value={passwordData.old_password}
            onChange={(e) =>
              setPasswordData({ ...passwordData, old_password: e.target.value })
            }
            className="w-full border rounded-lg p-3 focus:ring focus:ring-blue-300"
            required
          />
        </div>

        {/* Password Baru */}
              
        <div>
          <label className="block text-sm mb-1 font-medium">Password Baru</label>
          <input
            type="password"
            value={passwordData.new_password}
            onChange={(e) => {
              setPasswordData({ ...passwordData, new_password: e.target.value });
              evaluateStrength(e.target.value);
            }}
            className="w-full border rounded-lg p-3 focus:ring focus:ring-blue-300"
            required
          />

          
          <PasswordStrength password={passwordData.new_password} />


        </div>

        {/* Konfirmasi Password */}
        <div>
          <label className="block text-sm mb-1 font-medium">
            Konfirmasi Password Baru
          </label>
          <input
            type="password"
            value={passwordData.confirm_password}
            onChange={(e) =>
              setPasswordData({
                ...passwordData,
                confirm_password: e.target.value,
              })
            }
            className="w-full border rounded-lg p-3 focus:ring focus:ring-blue-300"
            required
          />
        </div>

        {/* Tombol */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            Batal
          </button>

          <button
            type="submit"
            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          >
            Simpan Password
          </button>
        </div>
      </form>
    </div>
  );
}
