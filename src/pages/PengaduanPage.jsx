import { useState, useEffect, useContext } from "react";
// import { UserContext } from "../context/UserContext";
import { Calendar, User, Building2, FileText, CheckCircle, FileUp } from "lucide-react";
import FloatingInput from "../assets/FloatingInput";

export default function PengaduanPage() {
  const [step, setStep] = useState(1);
  const [useProfile, setUseProfile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    tanggal: new Date().toISOString().split("T")[0],
    nomorRegistrasi: `REG-${Date.now()}`,
    
    nama_lengkap: "",
    tanggal_lahir: "",
    umur: "",
    jenis_kelamin: "",
    alamat: "",
    kode_pos: "",
    kota: "",
    no_hp: "",
    email: "",
    identitas: "",
    foto_identitas: null,

    namaPemilik: "",
    namaUsaha: "",
    alamatUsaha: "",
    kodeposUsaha: "",
    kotaUsaha: "",
    teleponUsaha:"",
    
    lampiran: [null], // minimal satu input file
    kronologis: "",
    berkas: null,
    persetujuan: false,
  });
    
    

  const steps = [
    { id: 1, label: "Pendaftaran", icon: Calendar },
    { id: 2, label: "Data Pengadu", icon: User },
    { id: 3, label: "Pelaku Usaha", icon: Building2 },
    { id: 4, label: "TentangPengaduan", icon: FileUp },
    { id: 5, label: "Kronologis", icon: FileText },
    { id: 6, label: "Konfirmasi", icon: CheckCircle },
  ];

  const handleToggleProfile = async () => {
    const newState = !useProfile;
    setUseProfile(newState);
  
    if (newState) {
      // === Aktifkan: Ambil dari profil ===
      setLoading(true);
      try {
        const res = await fetch("http://localhost:3000/api/profile", {
          credentials: "include", // penting agar cookie token dikirim
        });
        if (!res.ok) throw new Error("Gagal mengambil data profil");
  
        const data = await res.json();
  
        // console.log("Profil user:", data);
  
        setFormData({
          nama_lengkap: data.profile?.nama_lengkap || "",
          tanggal_lahir: data.profile?.tanggal_lahir
            ? data.profile.tanggal_lahir.split("T")[0]
            : "",
          umur: data.profile?.umur || "",
          jenis_kelamin: data.profile?.jenis_kelamin || "",
          alamat: data.profile?.alamat || "",
          kode_pos: data.profile?.kode_pos || "",
          kota: data.profile?.kota || "", // ✅ sesuai field backend
          no_hp: data.profile?.no_hp || "",
          email: data.email || "",
          identitas: data.profile?.identitas || "",
          foto_identitas: data.profile?.foto_identitas || "",
        });
      } catch (error) {
        console.error("Gagal mengambil data profil:", error);
        alert("Tidak dapat memuat data profil pengguna");
      } finally {
        setLoading(false);
      }
    } else {
      // === Nonaktifkan: Hapus semua data form ===
      setFormData({
        nama_lengkap: "",
        tanggal_lahir: "",
        umur:"",
        jenis_kelamin: "",
        alamat: "",
        kode_pos: "",
        kota: "",
        no_hp: "",
        email: "",
        identitas: "",
        foto_identitas: null,
      });
    }
  };
  
  

    // Handle tambah lampiran baru
  const handleAddFile = () => {
    setFormData((prev) => ({
      ...prev,
      lampiran: [...prev.lampiran, null],
    }));
  };

  // Handle hapus lampiran tertentu
  const handleRemoveFile = (index) => {
    setFormData((prev) => ({
      ...prev,
      lampiran: prev.lampiran.filter((_, i) => i !== index),
    }));
  };

  // Handle perubahan file
  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    setFormData((prev) => {
      const updated = [...prev.lampiran];
      updated[index] = file;
      return { ...prev, lampiran: updated };
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
  
    setFormData((prevData) => {
      let updatedData = { ...prevData };
  
      if (type === "file" && name === "foto_identitas") {
        updatedData.foto_identitas = files[0];
      } 
      else if (name === "tanggal_lahir") {
        // Hitung umur otomatis
        const today = new Date();
        const birthDate = new Date(value);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (
          monthDiff < 0 ||
          (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ) {
          age--;
        }
  
        updatedData.tanggal_lahir = value;
        updatedData.umur = age;
      } 
      else if (type === "checkbox") {
        updatedData[name] = checked;
  
        // Kosongkan deskripsi kalau uncheck
        if (name === "kerugianMaterial" && !checked) {
          updatedData.deskripsiMaterial = "";
        }
        if (name === "kerugianFisik" && !checked) {
          updatedData.deskripsiFisik = "";
        }
      } 
      else {
        updatedData[name] = value;
      }
  
      return updatedData;
    });
  };
  

  // const handleTanggalLahir = (e) => {
  //   const value = e.target.value;
  //   const birthDate = new Date(value);
  //   const ageDiff = Date.now() - birthDate.getTime();
  //   const age = new Date(ageDiff).getUTCFullYear() - 1970;

  //   setFormData((prev) => ({
  //     ...prev,
  //     tanggalLahir: value,
  //     umur: age >= 0 ? age : "",
  //   }));
  // };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.persetujuan) {
      alert("Anda harus menyetujui data sebelum mengirim.");
      return;
    }
    alert("Pengaduan berhasil dikirim:\n" + JSON.stringify(formData, null, 2));
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Form Pengaduan</h2>

      {/* Stepper */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((s, idx) => (
          <div key={s.id} className="flex-1 flex flex-col items-center">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                step === s.id
                  ? "bg-blue-500 border-blue-500 text-white"
                  : step > s.id
                  ? "bg-green-500 border-green-500 text-white"
                  : "border-gray-300 text-gray-400"
              }`}
            >
              <s.icon className="w-5 h-5" />
            </div>
            <span
              className={`mt-2 text-sm text-center ${
                step === s.id
                  ? "text-blue-600 font-medium"
                  : step > s.id
                  ? "text-green-700"
                  : "text-gray-400"
              }`}
            >
              {s.label}
            </span>
            {idx < steps.length - 1 && (
              <div
                className={`h-0.5 w-full ${
                  step > s.id ? "bg-green-500" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1 */}
        {step === 1 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Awal Pendaftaran</h2>
            <p className="mb-2">Tanggal: <strong>{formData.tanggal}</strong></p>
            <p>Nomor Registrasi: <strong>{formData.nomorRegistrasi}</strong></p>
          </div>
        )}

        {/* Step 2: Data Pengadu */}
        {step === 2 && (
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8 transition-all duration-300">
          {/* Header & Toggle Profil */}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-800">Data Pengadu</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {useProfile
                  ? loading
                    ? "Mengambil data profil..."
                    : "Menggunakan data profil"
                  : "Isi manual"}
              </span>
              <div
                onClick={handleToggleProfile}
                className={`relative w-14 h-7 flex items-center cursor-pointer transition-all duration-300 rounded-full ${
                  useProfile ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <div
                  className={`absolute left-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${
                    useProfile ? "translate-x-7" : "translate-x-0"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* FORM */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nama Lengkap */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Lengkap
              </label>
              <input
                type="text"
                name="nama_lengkap"
                value={formData.nama_lengkap}
                onChange={handleChange}
                disabled={useProfile && !loading}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Masukkan nama lengkap"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={useProfile && !loading}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Masukkan email aktif"
              />
            </div>

            {/* Nomor Telepon */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nomor Telepon
              </label>
              <input
                type="tel"
                name="no_hp"
                value={formData.no_hp}
                onChange={handleChange}
                disabled={useProfile && !loading}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="08xxxxxxxxxx"
              />
            </div>

            {/* Jenis Kelamin (Select) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jenis Kelamin
              </label>
              <select
                name="jenis_kelamin"
                value={formData.jenis_kelamin}
                onChange={handleChange}
                disabled={useProfile && !loading}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white"
              >
                <option value="">Pilih Jenis Kelamin</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>

            {/* Tanggal Lahir + Umur */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Lahir
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="date"
                  name="tanggal_lahir"
                  value={formData.tanggal_lahir}
                  onChange={handleChange}
                  disabled={useProfile && !loading}
                  className="flex-1 border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
                <span className="text-sm text-gray-700">
                  Umur: <strong>{formData.umur || "-"}</strong> th
                </span>
              </div>
            </div>

            {/* NIK */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                NIK
              </label>
              <input
                type="text"
                name="identitas"
                value={formData.identitas}
                onChange={handleChange}
                disabled={useProfile && !loading}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Masukkan NIK"
              />
            </div>

            {/* Alamat */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alamat Lengkap
              </label>
              <textarea
                name="alamat"
                rows="2"
                value={formData.alamat}
                onChange={handleChange}
                disabled={useProfile && !loading}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
                placeholder="Masukkan alamat lengkap"
              />
            </div>

            {/* Kota */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kota / Kabupaten
              </label>
              <select
                name="kota"
                value={formData.kota}
                onChange={handleChange}
                disabled={useProfile && !loading}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white"
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

            {/* Kode Pos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kode Pos
              </label>
              <input
                type="text"
                name="kode_pos"
                value={formData.kode_pos}
                onChange={handleChange}
                disabled={useProfile && !loading}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Masukkan kode pos"
              />
            </div>
          </div>

          {/* FOTO IDENTITAS */}
          <div className="border-t pt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Foto Identitas (KTP / SIM)
            </label>
            <input
              type="file"
              name="foto_Identitas"
              
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              accept="image/*"
              onChange={handleChange}
              disabled={useProfile && !loading}
            />

            {formData.foto_identitas && (
              <div className="mt-2">
                <img
                  src={
                    typeof formData.foto_identitas === "string"
                      ? formData.foto_identitas
                      : URL.createObjectURL(formData.foto_identitas)
                  }
                  alt="Preview"
                  className="w-40 h-40 object-cover rounded border"
                />
              </div>
            )}
          </div>
        </div>
      )}

        
        {/* Step 3 */}
        {step === 3 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-800">
              Data Pelaku Usaha
            </h3>

            {/* Nama Pemilik */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Pemilik
              </label>
              <input
                type="text"
                name="namaPemilik"
                value={formData.namaPemilik}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl p-2.5 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white"
              />
            </div>

            {/* Nama Perusahaan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Perusahaan
              </label>
              <input
                type="text"
                name="namaUsaha"
                value={formData.namaUsaha}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl p-2.5 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white"
              />
            </div>

            {/* Alamat Perusahaan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alamat Perusahaan
              </label>
              <input
                type="text"
                name="alamatUsaha"
                value={formData.alamatUsaha}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl p-2.5 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white"
              />
            </div>

            {/* Kode Pos + Kota */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Kode Pos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kode Pos
                </label>
                <input
                  type="text"
                  name="kodeposUsaha"
                  value={formData.kodeposUsaha}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl p-2.5 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white"
                />
              </div>

              {/* Kota / Kabupaten */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kota / Kabupaten
                </label>
                <select
                  name="kotaUsaha"
                  value={formData.kotaUsaha}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl p-2.5 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white"
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
            </div>

            {/* Nomor Telepon */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nomor Telepon
              </label>
              <input
                type="tel"
                name="teleponUsaha"
                value={formData.teleponUsaha}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl p-2.5 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white"
              />
            </div>
          </div>
        )}


        {/* Step 4 */}
        {step === 4 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-800">
              Tentang Pengaduan
            </h3>

            {/* Jenis Pengaduan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jenis Pengaduan
              </label>
              <select
                name="jenisAduan"
                value={formData.jenisAduan}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl p-2.5 shadow-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              >
                <option value="">Pilih Jenis Pengaduan</option>
                <option>Industri dan Pertambangan</option>
                <option>Pertanian dan Kehutanan</option>
                <option>Standar Mutu</option>
                <option>Jasa</option>
                <option>Iklan</option>
                <option>Klausula Baku</option>
                <option>Label</option>
                <option>Lain-lain</option>
              </select>
            </div>

            {/* Tanggal & Waktu Kejadian */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal Kejadian
                </label>
                <input
                  type="date"
                  name="tanggalKejadian"
                  value={formData.tanggalKejadian}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl p-2.5 shadow-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Waktu Kejadian
                </label>
                <input
                  type="time"
                  name="waktuKejadian"
                  value={formData.waktuKejadian}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl p-2.5 shadow-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
            </div>

            {/* Tempat Kejadian */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tempat Kejadian
              </label>
              <input
                type="text"
                name="tempatKejadian"
                value={formData.tempatKejadian}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl p-2.5 shadow-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>

            {/* Bentuk Kerugian */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bentuk Kerugian
              </label>

              {/* Material */}
              <div className="flex items-start gap-3 mb-2">
                <input
                  type="checkbox"
                  id="kerugianMaterial"
                  name="kerugianMaterial"
                  checked={formData.kerugianMaterial}
                  onChange={handleChange}
                  className="w-5 h-5 accent-blue-600 mt-1 cursor-pointer"
                />
                <div className="flex-1">
                  <label htmlFor="kerugianMaterial" className="text-sm font-medium text-gray-700">
                    Material
                  </label>
                  {formData.kerugianMaterial && (
                    <input
                      type="text"
                      name="deskripsiMaterial"
                      placeholder="Detail kerugian material"
                      value={formData.deskripsiMaterial}
                      onChange={handleChange}
                      className="mt-2 w-full border border-gray-300 rounded-xl p-2.5 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                  )}
                </div>
              </div>

              {/* Fisik */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="kerugianFisik"
                  name="kerugianFisik"
                  checked={formData.kerugianFisik}
                  onChange={handleChange}
                  className="w-5 h-5 accent-blue-600 mt-1 cursor-pointer"
                />
                <div className="flex-1">
                  <label htmlFor="kerugianFisik" className="text-sm font-medium text-gray-700">
                    Fisik
                  </label>
                  {formData.kerugianFisik && (
                    <input
                      type="text"
                      name="deskripsiFisik"
                      placeholder="Detail kerugian fisik"
                      value={formData.deskripsiFisik}
                      onChange={handleChange}
                      className="mt-2 w-full border border-gray-300 rounded-xl p-2.5 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Lampiran Bukti */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lampiran Bukti (Gambar atau PDF)
              </label>

              {formData.lampiran.map((file, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row items-center gap-3 mb-2 border border-gray-200 p-3 rounded-xl bg-gray-50 shadow-sm"
                >
                  <input
                    type="text"
                    name={`labelLampiran-${index}`}
                    placeholder="Judul bukti"
                    className="w-full sm:w-1/3 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    value={formData[`labelLampiran-${index}`] || ""}
                    onChange={handleChange}
                  />
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => handleFileChange(e, index)}
                    className="w-full sm:w-2/3 text-sm border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                  {file && (
                    <span className="text-xs text-gray-500 truncate w-32">
                      {file.name}
                    </span>
                  )}
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      className="text-red-500 hover:text-red-700 text-sm transition"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}

              {/* <button
                type="button"
                onClick={handleAddFile}
                className="mt-2 flex items-center gap-2 px-3 py-2 border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition shadow-sm"
              >
                ➕ Tambah Lampiran
              </button> */}
            </div>
          </div>
        )}

        {/* Step 5 */}
        {step === 5 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-800">
              Kronologis & Berkas Pendukung
            </h3>

            {/* Kronologis */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kronologis Pengaduan
              </label>
              <textarea
                name="kronologis"
                value={formData.kronologis}
                onChange={handleChange}
                placeholder="Tuliskan kronologis pengaduan Anda..."
                className="border border-gray-300 px-3 py-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
                rows="4"
                required
              />
            </div>

            {/* Jenis Tuntutan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jenis Tuntutan Ganti Rugi yang Diinginkan
              </label>

              <div className="space-y-3 bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm">
                {[
                  {
                    id: "barang",
                    name: "gantiBarang",
                    label: "Penggantian barang/jasa yang sejenis atau setara lainnya",
                  },
                  {
                    id: "uang",
                    name: "gantiUang",
                    label: "Pengembalian uang",
                  },
                  {
                    id: "rawat",
                    name: "gantiRawat",
                    label: "Perawatan kesehatan dan/atau",
                  },
                  {
                    id: "santunan",
                    name: "gantiSantunan",
                    label: "Pemberian santunan",
                  },
                  {
                    id: "teguran",
                    name: "gantiTeguran",
                    label: "Teguran kepada pelaku usaha",
                  },
                ].map((item) => (
                  <div key={item.id} className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id={item.id}
                      name={item.name}
                      checked={formData[item.name]}
                      onChange={handleChange}
                      className="mt-0.5 w-5 h-5 transform scale-110 accent-blue-600 cursor-pointer"
                    />
                    <label htmlFor={item.id} className="text-sm text-gray-700">
                      {item.label}
                    </label>
                  </div>
                ))}

                {/* Moril */}
                <div className="grid grid-cols-12 gap-3 items-start">
                  <div className="col-span-12 md:col-span-3 flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="moril"
                      name="gantiMoril"
                      checked={formData.gantiMoril}
                      onChange={handleChange}
                      className="mt-0.5 w-5 h-5 transform scale-110 accent-blue-600 cursor-pointer"
                    />
                    <label htmlFor="moril" className="text-sm text-gray-700">
                      Moril
                    </label>
                  </div>
                  {formData.gantiMoril && (
                    <input
                      type="text"
                      name="deskripsiMoril"
                      className="col-span-12 md:col-span-9 border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="Tuliskan detail tuntutan moril"
                      value={formData.deskripsiMoril}
                      onChange={handleChange}
                    />
                  )}
                </div>

                {/* Lain-lain */}
                <div className="grid grid-cols-12 gap-3 items-start">
                  <div className="col-span-12 md:col-span-3 flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="lainLain"
                      name="gantiLain"
                      checked={formData.gantiLain}
                      onChange={handleChange}
                      className="mt-0.5 w-5 h-5 transform scale-110 accent-blue-600 cursor-pointer"
                    />
                    <label htmlFor="lainLain" className="text-sm text-gray-700">
                      Lain-lain
                    </label>
                  </div>
                  {formData.gantiLain && (
                    <input
                      type="text"
                      name="deskripsiLain"
                      className="col-span-12 md:col-span-9 border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="Tuliskan jenis tuntutan lain"
                      value={formData.deskripsiLain}
                      onChange={handleChange}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Step 6 - Konfirmasi Data */}
        {step === 6 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-800">
              Konfirmasi Data
            </h3>

            {/* 🗓️ Awal Pendaftaran */}
            <div className="bg-gray-50 border rounded-xl p-6 shadow-sm">
              <h4 className="text-md font-semibold text-gray-700 mb-3">
                🗓️ Pendaftaran Awal
              </h4>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                <div>
                  <dt className="font-medium text-gray-600">Tanggal Pendaftaran</dt>
                  <dd className="text-gray-800">{formData.tanggal || "-"}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-600">Nomor Registrasi</dt>
                  <dd className="text-gray-800">{formData.nomorRegistrasi || "-"}</dd>
                </div>
              </dl>
            </div>

            {/* Data Ringkasan */}
            <div className="bg-gray-50 border rounded-xl p-6 shadow-sm">
              <h4 className="text-md font-semibold text-gray-700 mb-3">
                🧍 Data Diri
              </h4>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                <div>
                  <dt className="font-medium text-gray-600">Nama Lengkap</dt>
                  <dd className="text-gray-800">{formData.nama_lengkap || "-"}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-600">Email</dt>
                  <dd className="text-gray-800">{formData.email || "-"}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-600">Tanggal Lahir</dt>
                  <dd className="text-gray-800">{formData.tanggal_lahir || "-"}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-600">Umur</dt>
                  <dd className="text-gray-800">{formData.umur ? `${formData.umur} tahun` : "-"}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-600">Jenis Kelamin</dt>
                  <dd className="text-gray-800">{formData.jenis_kelamin || "-"}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-600">Kota / Kabupaten</dt>
                  <dd className="text-gray-800">{formData.kota || "-"}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="font-medium text-gray-600">Alamat</dt>
                  <dd className="text-gray-800">{formData.alamat || "-"}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-600">Kode Pos</dt>
                  <dd className="text-gray-800">{formData.kode_pos || "-"}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-600">Nomor HP</dt>
                  <dd className="text-gray-800">{formData.no_hp || "-"}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="font-medium text-gray-600">Foto Identitas</dt>
                  <dd>
                    {formData.foto_identitas ? (
                      <img
                        src={
                          typeof formData.foto_identitas === "string"
                            ? formData.foto_identitas
                            : URL.createObjectURL(formData.foto_identitas)
                        }
                        alt="Foto Identitas"
                        className="w-32 h-32 object-cover rounded-lg border mt-2"
                      />
                    ) : (
                      <span className="text-gray-800">Tidak ada</span>
                    )}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Data Pelaku Usaha */}
            <div className="bg-gray-50 border rounded-xl p-6 shadow-sm">
              <h4 className="text-md font-semibold text-gray-700 mb-3">
                🏢 Data Pelaku Usaha
              </h4>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                <div>
                  <dt className="font-medium text-gray-600">Nama Pemilik</dt>
                  <dd className="text-gray-800">{formData.namaPemilik || "-"}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-600">Nama Perusahaan</dt>
                  <dd className="text-gray-800">{formData.namaUsaha || "-"}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-600">Telepon Usaha</dt>
                  <dd className="text-gray-800">{formData.teleponUsaha || "-"}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-600">Kota / Kabupaten</dt>
                  <dd className="text-gray-800">{formData.kotaUsaha || "-"}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="font-medium text-gray-600">Alamat Usaha</dt>
                  <dd className="text-gray-800">{formData.alamatUsaha || "-"}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-600">Kode Pos</dt>
                  <dd className="text-gray-800">{formData.kodeposUsaha || "-"}</dd>
                </div>
              </dl>
            </div>

            {/* Tentang Pengaduan */}
            <div className="bg-gray-50 border rounded-xl p-6 shadow-sm">
              <h4 className="text-md font-semibold text-gray-700 mb-3">
                📋 Tentang Pengaduan
              </h4>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                <div>
                  <dt className="font-medium text-gray-600">Jenis Pengaduan</dt>
                  <dd className="text-gray-800">{formData.jenisAduan || "-"}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-600">Tanggal Kejadian</dt>
                  <dd className="text-gray-800">{formData.tanggalKejadian || "-"}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-600">Waktu Kejadian</dt>
                  <dd className="text-gray-800">{formData.waktuKejadian || "-"}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="font-medium text-gray-600">Tempat Kejadian</dt>
                  <dd className="text-gray-800">{formData.tempatKejadian || "-"}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="font-medium text-gray-600">Kerugian</dt>
                  <dd className="text-gray-800">
                    {[
                      formData.kerugianMaterial && "Material",
                      formData.kerugianFisik && "Fisik",
                    ]
                      .filter(Boolean)
                      .join(", ") || "-"}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Kronologis & Tuntutan */}
            <div className="bg-gray-50 border rounded-xl p-6 shadow-sm">
              <h4 className="text-md font-semibold text-gray-700 mb-3">
                🧾 Kronologis & Tuntutan
              </h4>
              <dl className="grid grid-cols-1 gap-y-3 text-sm">
                <div>
                  <dt className="font-medium text-gray-600">Kronologis</dt>
                  <dd className="text-gray-800 whitespace-pre-line">
                    {formData.kronologis || "-"}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-600">Jenis Tuntutan</dt>
                  <dd className="text-gray-800">
                    {[
                      formData.gantiBarang && "Penggantian barang/jasa",
                      formData.gantiUang && "Pengembalian uang",
                      formData.gantiRawat && "Perawatan kesehatan",
                      formData.gantiSantunan && "Pemberian santunan",
                      formData.gantiTeguran && "Teguran kepada pelaku usaha",
                      formData.gantiMoril && `Moril (${formData.deskripsiMoril})`,
                      formData.gantiLain && `Lain-lain (${formData.deskripsiLain})`,
                    ]
                      .filter(Boolean)
                      .join(", ") || "-"}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Persetujuan */}
            <div className="flex items-start gap-3 mt-6 bg-blue-50 border border-blue-200 p-4 rounded-lg shadow-sm">
              <label className="relative inline-flex items-center cursor-pointer mt-1">
                <input
                  type="checkbox"
                  name="persetujuan"
                  checked={formData.persetujuan}
                  onChange={handleChange}
                  className="sr-only peer"
                  required
                />
                <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 transition-all duration-300"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 peer-checked:translate-x-5"></div>
              </label>

              <p className="text-sm text-gray-700">
                Dengan ini saya menyatakan bahwa data yang saya isi adalah benar dan
                dapat dipertanggungjawabkan sesuai dengan peraturan perundang-undangan
                yang berlaku.
              </p>
            </div>
          </div>
        )}



        {/* Navigation */}
        <div className="flex justify-between mt-6">
          {step > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="px-4 py-2 bg-gray-500 text-white rounded"
            >
              Kembali
            </button>
          )}
          {step < 6 ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-4 py-2 bg-blue-500 text-white rounded ml-auto"
            >
              Lanjut
            </button>
          ) : (
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded ml-auto"
            >
              Kirim
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
