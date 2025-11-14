import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../api/apiClient";

import { formatDate } from "../assets/FormatDate";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null); // preview foto
  // const [currentUser, setCurrentUser] = useState(null);
  // const [role, setRole] = useState(""); // role bisa dari session / cookie
  // const token = localStorage.getItem("token");

  // 🔹 Ambil profil dari backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiClient("/profile", { method: "GET" });
        console.log("Response dari API:", data);

        // ✅ API langsung kirim objek user, bukan { user: {...} }
        setProfile(data);
      } catch (err) {
        console.error("Gagal ambil profil:", err);
        alert(err.message || "Gagal memuat profil");
        if (
          err.message.includes("Token") ||
          err.message.includes("Unauthorized")
        ) {
          navigate("/login");
        }
      }
    };

    fetchProfile();
  }, [navigate]);

  
  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        [name]: value,
      },
    }));
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          foto_identitas: file,
        },
      }));
      setPreview(URL.createObjectURL(file));
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      Object.entries(profile.profile).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      const res = await apiClient("/profile", {
        method: "PUT",
        body: formData, // apiClient otomatis mendeteksi FormData
      });

      alert(res.message || "Profil berhasil diperbarui!");
      setProfile(res.user || res.data?.user || profile);
      setEditMode(false);
      setPreview(null);
    } catch (err) {
      console.error("Error update profil:", err);
      alert(err.message || "Gagal memperbarui profil");
    } finally {
      setLoading(false);
    }
  };


  if (!profile) {
    return <p className="text-center mt-10">Memuat data profil...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-700">Profil Saya</h2>

      {!editMode ? (
        <>
          <div className="flex flex-col items-center mb-6">
            <img
              src={
                preview ||
                profile.profile.foto_identitas ||
                "https://via.placeholder.com/120x120.png?text=No+Image"
              }
              alt="Foto Identitas"
              className="w-32 h-32 rounded-full object-cover mb-3 border"
            />
            <p className="text-gray-700 font-medium">{profile.profile.nama_lengkap}</p>
            <p className="text-sm text-gray-500">{profile.email}</p>
            <p className="text-sm text-gray-500 capitalize">{profile.role}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><strong>Tanggal Lahir:</strong> {formatDate(profile.profile.tanggal_lahir) || "-"}</div>
            <div><strong>Jenis Kelamin:</strong> {profile.profile.jenis_kelamin || "-"}</div>
            <div><strong>Kota:</strong> {profile.profile.kota || "-"}</div>
            <div><strong>Alamat:</strong> {profile.profile.alamat || "-"}</div>
            <div><strong>Kode Pos:</strong> {profile.profile.kode_pos || "-"}</div>
            <div><strong>No. HP:</strong> {profile.profile.no_hp || "-"}</div>
            <div><strong>Identitas:</strong> {profile.profile.identitas || "-"}</div>
          </div>

          <button
            onClick={() => setEditMode(true)}
            className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          >
            Edit Profil
          </button>
        </>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Nama Lengkap</label>
            <input
              type="text"
              name="nama_lengkap"
              value={profile.profile.nama || ""}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Tanggal Lahir</label>
              <input
                type="date"
                name="tanggal_lahir"
                value={profile.profile.tanggal_lahir || ""}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Jenis Kelamin</label>
              <select
                name="jenis_kelamin"
                value={profile.profile.jenis_kelamin || ""}
                onChange={handleChange}
                className="w-full border rounded p-2"
              >
                <option value="">Pilih</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Alamat</label>
            <textarea
              name="alamat"
              value={profile.profile.alamat || ""}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            
            <div>
              <label className="block text-sm font-medium">Kota / Kabupaten</label>
              <select
                  name="kota"
                  value={profile.profile.kota}
                  onChange={handleChange}
                  className="w-full border border rounded  p-2.5"
                >
                <option value="">Pilih Kota/Kabupaten</option>
                <option value="Kota Tangerang">Kota Tangerang</option>
                <option value="Kota Tangerang Selatan">Kota Tangerang Selatan</option>
                <option value="Kabupaten Tangerang">Kabupaten Tangerang</option>
                <option value="Kabupaten Serang">Kabupaten Serang</option>
                <option value="Kota Serang">Kota Serang</option>  
                <option value="Kota Cilegon">Kota Cilegon</option>
                <option value="Kabupaten Pandeglang">Kabupaten Pandeglang</option>  
                <option value="Kabupaten Lebak">Kabupaten Lebak</option>  
                </select>             
            </div>
              
            <div>
              <label className="block text-sm font-medium">Kode Pos</label>
              <input
                type="text"
                name="kode_pos"
                value={profile.profile.kode_pos || ""}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">No. HP</label>
              <input
                type="text"
                name="no_hp"
                value={profile.profile.no_hp || ""}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Nomor Identitas</label>
            <input
              type="text"
              name="identitas"
              value={profile.profile.identitas || ""}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Foto Identitas</label>
            <input
              type="file"
              name="foto_identitas"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border rounded p-2"
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="w-24 h-24 object-cover rounded mt-2"
              />
            )}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              disabled={loading}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
            <button
              type="button"
              onClick={() => setEditMode(false)}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
            >
              Batal
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
