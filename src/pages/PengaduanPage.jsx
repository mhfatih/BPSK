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
    
    nama: "",
    tanggalLahir: "",
    umur: "",
    gender: "",
    alamat: "",
    kodepos: "",
    kota: "",
    telepon: "",
    email: "",
    nik: "",
    fotoIdentitas: null,

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
      setLoading(true);
      try {
        const res = await fetch("/api/profile"); // Ganti sesuai endpoint API kamu
        const data = await res.json();
  
        setFormData({
          ...formData,
          nama: data.nama || "",
          tanggalLahir: data.tanggalLahir || "",
          gender: data.gender || "",
          alamat: data.alamat || "",
          kodepos: data.kodepos || "",
          kota: data.kota || "",
          telepon: data.telepon || "",
          email: data.email || "",
          nik: data.nik || "",
        });
      } catch (error) {
        console.error("Gagal mengambil data profil:", error);
      } finally {
        setLoading(false);
      }
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
    const { name, value, type, files, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "file"
          ? files[0]
          : type === "checkbox"
          ? checked
          : value,
    }));
  };

  const handleTanggalLahir = (e) => {
    const value = e.target.value;
    const birthDate = new Date(value);
    const ageDiff = Date.now() - birthDate.getTime();
    const age = new Date(ageDiff).getUTCFullYear() - 1970;

    setFormData((prev) => ({
      ...prev,
      tanggalLahir: value,
      umur: age >= 0 ? age : "",
    }));
  };

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

        {/* Step 2 */}
        {step === 2 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold mb-4">Data Pengadu</h2>
            {/* 🔥 Pilihan pakai profil atau manual */}
          
            {/* 🌙 Toggle Ambil dari Profil */}
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">
                {useProfile
                  ? loading
                    ? "Mengambil data profil..."
                    : "Menggunakan data dari profil."
                  : "Isi data secara manual."}
              </p>

              {/* Toggle Switch (Animated) */}
              <div
                onClick={handleToggleProfile}
                className={`relative w-14 h-7 flex items-center cursor-pointer transition-all duration-300 ${
                  useProfile ? "bg-blue-600" : "bg-gray-300"
                } rounded-full shadow-inner`}
              >
                <div
                  className={`absolute left-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${
                    useProfile ? "translate-x-7" : "translate-x-0"
                  }`}
                />
              </div>
            </div>
            
            <div className="relative">
            
            <FloatingInput
                label="Nama Lengkap"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                disabled={useProfile && !loading}
            />
            <div className="flex items-center pt-3 pb-3 gap-5">
              <input
                type="date"
                name="tanggalLahir"
                className="border p-2 rounded"
                value={formData.tanggalLahir}
                onChange={handleTanggalLahir}
                disabled={useProfile && !loading} //kalau pakai profil → tidak bisa edit
              />
              <span>Umur: {formData.umur || "-"} tahun</span>
            </div>
            <div className="flex gap-4 pt-2 pb-2">
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Laki-laki"
                  checked={formData.gender === "Laki-laki"}
                  onChange={handleChange}
                  disabled={useProfile && !loading}               
                /> Laki-laki
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Perempuan"
                  checked={formData.gender === "Perempuan"}
                  onChange={handleChange}
                  disabled={useProfile && !loading}               
                /> Perempuan
              </label>
            </div>
            <div className="flex items-center pt-2 pb-2 gap-5">
            <FloatingInput
                label="Alamat Lengkap"
                name="alamat"
                value={formData.alamat}
                onChange={handleChange}
                disabled={useProfile && !loading}                  
            />
            </div>                  

            <div className="flex items-center pt-2 pb-2 gap-5">
            <FloatingInput
                label="Kode Pos"
                name="kodepos"
                value={formData.kodepos}
                onChange={handleChange}
                disabled={useProfile && !loading}                 
            />
            </div>                 
            <div className="flex items-center pt-2 pb-2 gap-5">
            <select
              name="kota"
              className="w-full border p-2 rounded"
              value={formData.kota}
              onChange={handleChange}
              disabled={useProfile && !loading}         
            >
              <option value="">Pilih Kota/Kabupaten</option>
              <option>Bandung</option>
              <option>Jakarta</option>
              <option>Surabaya</option>
              <option>Yogyakarta</option>
            </select>
            </div>  

            <div className="flex items-center pt-2 pb-2 gap-5">           
            <FloatingInput
                label="Nomor Telepon"
                name="telepon"
                type="tel"                  
                value={formData.telepon}
                onChange={handleChange}
                disabled={useProfile && !loading}                   
            />
            </div>  

            <div className="flex items-center pt-2 pb-2 gap-5">           
            <FloatingInput
                label="Email"
                name="email"
                type="email"                  
                value={formData.email}
                onChange={handleChange}
                disabled={useProfile && !loading}                  
            />
            </div>                
            
            <div className="flex items-center pt-2 pb-2 gap-5">           
            <FloatingInput
                label="NIK"
                name="nik"
                type="text"                  
                value={formData.nik}
                onChange={handleChange}
                disabled={useProfile && !loading}                  
            />
            </div>  
            
            <input
              type="file"
              name="fotoIdentitas"
              className="w-full border p-2 rounded"
              accept="image/*,"
              onChange={handleChange}
              disabled={useProfile && !loading}            
            />

            {formData.fotoIdentitas && (
            <div className="mt-2">
                <img
                src={URL.createObjectURL(formData.fotoIdentitas)}
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
          <div className="space-y-4">
            <h3 className="font-semibold text-lg mb-2">Data Pelaku Usaha</h3>
            <div className="flex items-center pt-2 pb-2 gap-5">           
            <FloatingInput
                label="Nama Pemilik"
                name="namaPemilik"
                type="text"                  
                value={formData.namaPemilik}
                onChange={handleChange}
                //   disabled={useProfile} // kalau pakai profil → tidak bisa edit                   
            />
            </div>  
            
            <div className="flex items-center pt-2 pb-2 gap-5">           
            <FloatingInput
                label="Nama Perusahaan"
                name="namaPerusahaan"
                type="text"                  
                value={formData.namaUsaha}
                onChange={handleChange}
                //   disabled={useProfile} // kalau pakai profil → tidak bisa edit                   
            />
            </div>
            <div className="flex items-center pt-2 pb-2 gap-5">           
            <FloatingInput
                label="Alamat Perusahaan"
                name="alamatUsaha"
                type="text"                  
                value={formData.alamatUsaha}
                onChange={handleChange}
                //   disabled={useProfile} // kalau pakai profil → tidak bisa edit                   
            />
            </div>  
                            
            <div className="flex items-center pt-2 pb-2 gap-5">
            <FloatingInput
                label="Kode Pos"
                name="kodeposUsaha"
                value={formData.kodeposUsaha}
                onChange={handleChange}
                //   disabled={useProfile} // kalau pakai profil → tidak bisa edit                   
            />
            </div>                 
            <div className="flex items-center pt-2 pb-2 gap-5">
            <select
              name="kotaUsaha"
              className="w-full border p-2 rounded"
              value={formData.kotaUsaha}
              onChange={handleChange}
            //   disabled={useProfile} // kalau pakai profil → tidak bisa edit            
            >
              <option value="">Pilih Kota/Kabupaten</option>
              <option>Bandung</option>
              <option>Jakarta</option>
              <option>Surabaya</option>
              <option>Yogyakarta</option>
            </select>
            </div>  

            <div className="flex items-center pt-2 pb-2 gap-5">           
            <FloatingInput
                label="Nomor Telepon"
                name="teleponUsaha"
                type="tel"                  
                value={formData.teleponUsaha}
                onChange={handleChange}
                //   disabled={useProfile} // kalau pakai profil → tidak bisa edit                   
            />
            </div>  
  
          </div>
        )}
        

        {/* Step 4 */}
        {step === 4 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg mb-2">Tentang Pengaduan</h3>
            
            <div className="flex-col  pb-1 gap-5">
            <label className="text-sm text-gray-600 mb-1">Jenis Pengaduan</label>
            <select
              name="jenisPengaduan"
              className="w-full border p-2 rounded"
              value={formData.jenisAduan}
              onChange={handleChange}
            //   disabled={useProfile} // kalau pakai profil → tidak bisa edit            
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

            <div className="flex items-center gap-5 pt-3 pb-3">
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">Tanggal Kejadian</label>
                <input
                  type="date"
                  name="tanggalKejadian"
                  className="border p-2 rounded"
                  value={formData.tanggalKejadian}
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">Waktu Kejadian</label>
                <input
                  type="time"
                  name="waktuKejadian"
                  className="border p-2 rounded"
                  value={formData.waktuKejadian}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Tempat Kejadian</label>
                <input
                  type="text"
                  name="tempatKejadian"
                  className="border p-2 rounded"
                  value={formData.tempatKejadian}
                  onChange={handleChange}
                />
            </div>

            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">Bentuk Kerugian</label>

                {/* Checkbox Material */}
                <div className="grid grid-cols-12 gap-2 mb-2 items-center">
                  <div className="col-span-2 flex items-center gap-2 py-3">
                    <input
                      type="checkbox"
                      id="material"
                      name="kerugianMaterial"
                      className="w-5 h-5 transform scale-125 accent-blue-600 cursor-pointer"
                      checked={formData.kerugianMaterial}
                      onChange={handleChange}
                    />
                    <label htmlFor="material" className="text-sm">
                      Material
                    </label>
                  </div>
                  {formData.kerugianMaterial && (
                    <input
                      type="text"
                      name="deskripsiMaterial"
                      className="col-span-10 border p-2 rounded"
                      placeholder="Detail kerugian material"
                      value={formData.deskripsiMaterial}
                      onChange={handleChange}
                    />
                  )}
                </div>

              {/* Checkbox Fisik */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-2 flex items-center gap-2 py-3">
                  <input
                    type="checkbox"
                    id="fisik"
                    name="kerugianFisik"
                    className="w-5 h-5 transform scale-125 accent-blue-600 cursor-pointer"
                    checked={formData.kerugianFisik}
                    onChange={handleChange}
                  />
                  <label htmlFor="fisik" className="text-sm">
                    Fisik
                  </label>
                </div>
                {formData.kerugianFisik && (
                  <input
                    type="text"
                    name="deskripsiFisik"
                    className="col-span-10 border p-2 rounded"
                    placeholder="Detail kerugian fisik"
                    value={formData.deskripsiFisik}
                    onChange={handleChange}
                  />
                )}
              </div>

            </div>

            {/* Lampiran Bukti */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lampiran Bukti (Gambar atau PDF)
              </label>

              {formData.lampiran.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 mb-2 border p-2 rounded bg-gray-50"
                >
                  <input
                  type="text"
                  name="labelLampiran"
                  placeholder="Bukti-Bukti"
                  className="border p-2 rounded"
                  value={formData.tempatKejadian}
                  onChange={handleChange}
                />
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => handleFileChange(e, index)}
                    className="flex-1 text-sm"
                  />
                  {file && (
                  <span className="text-xs text-gray-600 truncate w-32">
                    {file.name}
                  </span>
                  )}
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      ✕
                    </button>
                  )}
                </div>
                
              ))}

              
              <button
                type="button"
                onClick={handleAddFile}
                className="mt-2 flex items-center gap-2 px-3 py-2 border border-blue-500 text-blue-600 rounded hover:bg-blue-50 transition"
              >
                ➕ Tambah Lampiran
              </button>
              
            </div>

            {/* <input
              type="file"
              name="berkas"
              onChange={handleChange}
              className="border px-3 py-2 rounded w-full"
            />
            {formData.berkas && (
              <p className="text-sm text-gray-600">File dipilih: {formData.berkas.name}</p>
            )} */}
          </div>
        )}
              
        {/* Step 5 */}
        {step === 5 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg mb-2">Kronologis & Berkas Pendukung</h3>
            <textarea
              name="kronologis"
              value={formData.kronologis}
              onChange={handleChange}
              placeholder="Tuliskan kronologis pengaduan Anda..."
              className="border px-3 py-2 rounded w-full"
              rows="4"
              required
            />
            <div className="flex-col  pb-1 gap-5">
            <label className="text-sm text-gray-600 mb-1">Jenis Tuntutan Ganti Rugi Yang Diinginkan</label>

                <div className="col-span-2 flex items-center gap-2 py-3">
                  <input
                    type="checkbox"
                    id="barang"
                    name="gantiBarang"
                    className="w-5 h-5 transform scale-125 accent-blue-600 cursor-pointer"
                    checked={formData.gantiBarang}
                    onChange={handleChange}
                  />
                  <label htmlFor="barang" className="text-sm">
                    Penggantian barang/jasa yang sejenis atau setara lainnya
                  </label>
                </div>
                <div className="col-span-2 flex items-center gap-2 py-3">
                  <input
                    type="checkbox"
                    id="uang"
                    name="gantiUang"
                    className="w-5 h-5 transform scale-125 accent-blue-600 cursor-pointer"
                    checked={formData.gantiUang}
                    onChange={handleChange}
                  />
                  <label htmlFor="uang" className="text-sm">
                   Pengembalian uang, atau
                  </label>
                </div>
                <div className="col-span-2 flex items-center gap-2 py-3">
                  <input
                    type="checkbox"
                    id="rawat"
                    name="gantiRawat"
                    className="w-5 h-5 transform scale-125 accent-blue-600 cursor-pointer"
                    checked={formData.gantiRawat}
                    onChange={handleChange}
                  />
                  <label htmlFor="rawat" className="text-sm">
                   Perawatan kesehatan dan/atau
                  </label>
                </div>
                <div className="col-span-2 flex items-center gap-2 py-3">
                  <input
                    type="checkbox"
                    id="santunan"
                    name="gantiSantunan"
                    className="w-5 h-5 transform scale-125 accent-blue-600 cursor-pointer"
                    checked={formData.gantiSantunan}
                    onChange={handleChange}
                  />
                  <label htmlFor="santunan" className="text-sm">
                    Pemberian santunan
                  </label>
                </div>
                <div className="col-span-2 flex items-center gap-2 py-3">
                  <input
                    type="checkbox"
                    id="teguran"
                    name="gantiTeguran"
                    className="w-5 h-5 transform scale-125 accent-blue-600 cursor-pointer"
                    checked={formData.gantiTeguran}
                    onChange={handleChange}
                  />
                  <label htmlFor="teguran" className="text-sm">
                    Teguran kepada pelaku usaha
                  </label>
                </div>
                {/* Checkbox Moril */}
                <div className="grid grid-cols-12 gap-2 py-3 items-center">
                  <div className="col-span-2 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="moril"
                      name="gantiMoril"
                      className="w-5 h-5 transform scale-125 accent-blue-600 cursor-pointer"
                      checked={formData.gantiMoril}
                      onChange={handleChange}
                    />
                    <label htmlFor="moril" className="text-sm">
                      Moril
                    </label>
                  </div>
                  {formData.gantiMoril && (
                    <input
                      type="text"
                      name="deskripsiMoril"
                      className="col-span-10 border p-2 rounded"
                      placeholder=" "
                      value={formData.deskripsiMoril}
                      onChange={handleChange}
                    />
                  )}
                </div>
                {/* Checkbox Lain-lain */}
                <div className="grid grid-cols-12 gap-2 py-3 items-center">
                  <div className="col-span-2 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="lainLain"
                      name="gantiLain"
                      className="w-5 h-5 transform scale-125 accent-blue-600 cursor-pointer"
                      checked={formData.gantiLain}
                      onChange={handleChange}
                    />
                    <label htmlFor="lain" className="text-sm flex items-center">
                      Lain-lain
                    </label>
                  </div>
                  {formData.gantiLain && (
                    <input
                      type="text"
                      name="deskripsiLain"
                      className="col-span-10 border p-2 rounded"
                      placeholder=" "
                      value={formData.deskripsiLain}
                      onChange={handleChange}
                    />
                  )}
                </div>

            
            </div> 
          </div>
        )}

        
        {/* Step 6 - Konfirmasi Data */}
        {step === 6 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold border-b pb-2 text-gray-800">
              Konfirmasi Data
            </h3>

            {/* Data Ringkasan */}
            <div className="bg-gray-50 border rounded-xl p-5 shadow-sm">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <div>
                  <dt className="font-medium text-gray-600">No Registrasi</dt>
                  <dd className="text-gray-800">{formData.nomorRegistrasi || "-"}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-600">Nama</dt>
                  <dd className="text-gray-800">{formData.nama || "-"}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-600">Email</dt>
                  <dd className="text-gray-800">{formData.email || "-"}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-600">Pelaku Usaha</dt>
                  <dd className="text-gray-800">{formData.pelakuUsaha || "-"}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="font-medium text-gray-600">Alamat Usaha</dt>
                  <dd className="text-gray-800">{formData.alamatUsaha || "-"}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="font-medium text-gray-600">Kronologis</dt>
                  <dd className="text-gray-800 whitespace-pre-line">
                    {formData.kronologis || "-"}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-600">Berkas</dt>
                  <dd className="text-gray-800">
                    {formData.berkas ? formData.berkas.name : "Tidak ada"}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Persetujuan */}
            <div className="flex items-center gap-3 mt-6 bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <label className="relative inline-flex items-center cursor-pointer">
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

              <span className="text-sm text-gray-700">
                Demikian formulir ini saya isi dengan benar dan jujur serta dapat dipertanggungjawabkan sesuai dengan peraturan perundang-undangan yang berlaku.
              </span>
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
