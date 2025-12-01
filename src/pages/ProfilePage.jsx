import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../api/apiClient";
import { formatDate } from "../assets/FormatDate";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiClient("/profile", { method: "GET" });
        setProfile(data);
      } catch (err) {
        alert("Gagal memuat profil");
        navigate("/login");
      }
    };
    fetchProfile();
  }, [navigate]);

  if (!profile)
    return <p className="text-center mt-10">Memuat data profil...</p>;

  const user = profile.profile;

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10">
      {/* Card Wrapper */}
      <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
        
        {/* Header & Foto */}
        <div className="flex flex-col items-center mb-8">
          <img
            src={
              user.foto_identitas ||
              "https://via.placeholder.com/150.png?text=No+Image"
            }
            alt="Foto Profil"
            className="w-32 h-32 rounded-xl object-cover border shadow"
          />

          <h2 className="text-2xl font-semibold mt-4 text-gray-800">
            {user.nama_lengkap}
          </h2>

          <p className="text-gray-500 text-sm">{profile.email}</p>
          <span className="text-xs px-3 py-1 mt-2 bg-blue-100 text-blue-700 rounded-full capitalize">
            {profile.role}
          </span>
        </div>

        {/* Informasi Profil */}
        <div className="grid grid-cols-2 gap-6 text-sm">
          <InfoItem label="Tanggal Lahir" value={formatDate(user.tanggal_lahir)} />
          <InfoItem label="Jenis Kelamin" value={user.jenis_kelamin} />
          <InfoItem label="Kota / Kabupaten" value={user.kota} />
          <InfoItem label="Alamat" value={user.alamat} />
          <InfoItem label="Kode Pos" value={user.kode_pos} />
          <InfoItem label="No. HP" value={user.no_hp} />
          <InfoItem label="Nomor Identitas" value={user.identitas} />
        </div>

        {/* Buttons */}
        <div className="mt-10 flex gap-4 justify-end">
          <button
            onClick={() => navigate("/profile/edit")}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition shadow-sm"
          >
            Edit Profil
          </button>

          <button
            onClick={() => navigate("/profile/change-password")}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg transition shadow-sm"
          >
            Ubah Password
          </button>
        </div>
      </div>
    </div>
  );
}

/* 🔹 Komponen kecil agar rapih */
function InfoItem({ label, value }) {
  return (
    <div className="flex flex-col">
      <span className="text-gray-500 text-xs font-medium">{label}</span>
      <span className="text-gray-800 mt-1 font-semibold">
        {value || "-"}
      </span>
    </div>
  );
}
