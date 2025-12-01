import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../api/apiClient";

export default function EditProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiClient("/profile", { method: "GET" });
        setProfile(data);
        setPreview(data.profile.foto_identitas);
      } catch (err) {
        alert("Gagal memuat profil");
        navigate("/login");
      }
    };
    fetchProfile();
  }, [navigate]);

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile((prev) => ({
        ...prev,
        profile: { ...prev.profile, foto_identitas: file },
      }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      Object.entries(profile.profile).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      await apiClient("/profile", {
        method: "PUT",
        body: formData,
      });

      alert("Profil berhasil diperbarui!");
      navigate("/profile");
    } catch (err) {
      alert("Gagal memperbarui profil");
    } finally {
      setLoading(false);
    }
  };

  if (!profile) return <p className="text-center mt-10">Memuat...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 mt-8 bg-white shadow-lg rounded-2xl border border-gray-200">
      <h1 className="text-2xl font-semibold text-gray-700 mb-6">
        Edit Profil
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* FOTO */}
        <div className="flex items-center gap-5">
          <img
            src={
              preview ||
              "https://via.placeholder.com/120x120.png?text=No+Image"
            }
            className="w-28 h-28 rounded-xl object-cover border shadow"
          />
          <div>
            <label className="text-sm font-medium">Foto Identitas</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 block w-full border rounded-lg p-2"
            />
          </div>
        </div>

        {/* GRID FORM */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium">Nama Lengkap</label>
            <input
              type="text"
              name="nama_lengkap"
              value={profile.profile.nama || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Tanggal Lahir</label>
            <input
              type="date"
              name="tanggal_lahir"
              value={profile.profile.tanggal_lahir || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Jenis Kelamin</label>
            <select
              name="jenis_kelamin"
              value={profile.profile.jenis_kelamin || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            >
              <option value="">Pilih</option>
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">No. HP</label>
            <input
              type="text"
              name="no_hp"
              value={profile.profile.no_hp || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div className="col-span-2">
            <label className="text-sm font-medium">Alamat</label>
            <textarea
              name="alamat"
              value={profile.profile.alamat || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 h-24"
            ></textarea>
          </div>

          <div>
            <label className="text-sm font-medium">Kota</label>
            <select
              name="kota"
              value={profile.profile.kota || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            >
              <option value="">Pilih</option>
              <option value="Kota Tangerang">Kota Tangerang</option>
              <option value="Kota Tangerang Selatan">Kota Tangerang Selatan</option>
              <option value="Kabupaten Tangerang">Kabupaten Tangerang</option>
              <option value="Kota Serang">Kota Serang</option>
              <option value="Kabupaten Serang">Kabupaten Serang</option>
              <option value="Kota Cilegon">Kota Cilegon</option>
              <option value="Kabupaten Pandeglang">Kabupaten Pandeglang</option>
              <option value="Kabupaten Lebak">Kabupaten Lebak</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Kode Pos</label>
            <input
              type="text"
              name="kode_pos"
              value={profile.profile.kode_pos || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div className="col-span-2">
            <label className="text-sm font-medium">Nomor Identitas</label>
            <input
              type="text"
              name="identitas"
              value={profile.profile.identitas || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg text-gray-800"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </form>
    </div>
  );
}
