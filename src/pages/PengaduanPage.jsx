import { useState, useEffect, useContext } from "react";
// import { UserContext } from "../context/UserContext";
import { Calendar, User, Building2, FileText, CheckCircle, FileUp } from "lucide-react";
import FloatingInput from "../assets/FloatingInput";

export default function PengaduanPage() {
  const [step, setStep] = useState(1);
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
    
    kronologis: "",
    berkas: null,
    persetujuan: false,
  });
    
    // Kalau pilih pakai profil → auto isi data
//   useEffect(() => {
//     if (useProfile && user) {
//       setFormData((prev) => ({
//         ...prev,
//         nama: user.nama || "",
//         tanggalLahir: user.tanggalLahir || "",
//         umur: user.tanggalLahir
//           ? new Date().getFullYear() -
//             new Date(user.tanggalLahir).getFullYear()
//           : "",
//         gender: user.gender || "",
//         alamat: user.alamat || "",
//         kota: user.kota || "",
//         telepon: user.telepon || "",
//         email: user.email || "",
//         fotoIdentitas: user.fotoIdentitas || null,
//       }));
//     }
//   }, [useProfile, user]);

  const steps = [
    { id: 1, label: "Pendaftaran", icon: Calendar },
    { id: 2, label: "Data Pengadu", icon: User },
    { id: 3, label: "Pelaku Usaha", icon: Building2 },
    { id: 4, label: "TentangPengaduan", icon: FileUp },
    { id: 5, label: "Kronologis", icon: FileText },
    { id: 6, label: "Konfirmasi", icon: CheckCircle },
  ];

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
          <div className="flex gap-4 mb-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                // checked={useProfile}
                // onChange={() => setUseProfile(true)}
              />
              Gunakan Profil Saya
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                // checked={!useProfile}
                // onChange={() => setUseProfile(false)}
              />
              Isi Manual
            </label>
          </div>
            <div className="relative">
            
            <FloatingInput
                label="Nama Lengkap"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
            />
            <div className="flex items-center pt-3 pb-3 gap-5">
              <input
                type="date"
                name="tanggalLahir"
                className="border p-2 rounded"
                value={formData.tanggalLahir}
                onChange={handleTanggalLahir}
                // disabled={useProfile} // kalau pakai profil → tidak bisa edit
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
                //   disabled={useProfile} // kalau pakai profil → tidak bisa edit                
                /> Laki-laki
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Perempuan"
                  checked={formData.gender === "Perempuan"}
                  onChange={handleChange}
                //   disabled={useProfile} // kalau pakai profil → tidak bisa edit                
                /> Perempuan
              </label>
            </div>
            <div className="flex items-center pt-2 pb-2 gap-5">
            <FloatingInput
                label="Alamat Lengkap"
                name="alamat"
                value={formData.alamat}
                onChange={handleChange}
                //   disabled={useProfile} // kalau pakai profil → tidak bisa edit                   
            />
            </div>                  

            <div className="flex items-center pt-2 pb-2 gap-5">
            <FloatingInput
                label="Kode Pos"
                name="kodepos"
                value={formData.kodepos}
                onChange={handleChange}
                //   disabled={useProfile} // kalau pakai profil → tidak bisa edit                   
            />
            </div>                 
            <div className="flex items-center pt-2 pb-2 gap-5">
            <select
              name="kota"
              className="w-full border p-2 rounded"
              value={formData.kota}
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
                name="telepon"
                type="tel"                  
                value={formData.telepon}
                onChange={handleChange}
                //   disabled={useProfile} // kalau pakai profil → tidak bisa edit                   
            />
            </div>  

            <div className="flex items-center pt-2 pb-2 gap-5">           
            <FloatingInput
                label="Email"
                name="email"
                type="email"                  
                value={formData.email}
                onChange={handleChange}
                //   disabled={useProfile} // kalau pakai profil → tidak bisa edit                   
            />
            </div>                
            
            <div className="flex items-center pt-2 pb-2 gap-5">           
            <FloatingInput
                label="NIK"
                name="nik"
                type="text"                  
                value={formData.nik}
                onChange={handleChange}
                //   disabled={useProfile} // kalau pakai profil → tidak bisa edit                   
            />
            </div>  
            
            <input
              type="file"
              name="fotoIdentitas"
              className="w-full border p-2 rounded"
              accept="image/*,"
              onChange={handleChange}
            //   disabled={useProfile} // kalau pakai profil → tidak bisa edit            
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
                  <div className="col-span-2 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="material"
                      name="kerugianMaterial"
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
                <div className="col-span-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="fisik"
                    name="kerugianFisik"
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

            <input
              type="file"
              name="berkas"
              onChange={handleChange}
              className="border px-3 py-2 rounded w-full"
            />
            {formData.berkas && (
              <p className="text-sm text-gray-600">File dipilih: {formData.berkas.name}</p>
            )}
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
            <input
              type="file"
              name="berkas"
              onChange={handleChange}
              className="border px-3 py-2 rounded w-full"
            />
            {formData.berkas && (
              <p className="text-sm text-gray-600">File dipilih: {formData.berkas.name}</p>
            )}
          </div>
        )}

        {/* Step 6 */}
        {step === 6 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg mb-2">Konfirmasi Data</h3>
            <p><strong>No Registrasi:</strong> {formData.nomorRegistrasi}</p>
            <p><strong>Nama:</strong> {formData.nama}</p>
            <p><strong>Email:</strong> {formData.email}</p>
            <p><strong>Pelaku Usaha:</strong> {formData.pelakuUsaha}</p>
            <p><strong>Alamat Usaha:</strong> {formData.alamatUsaha}</p>
            <p><strong>Kronologis:</strong> {formData.kronologis}</p>
            <p><strong>Berkas:</strong> {formData.berkas ? formData.berkas.name : "Tidak ada"}</p>

            <div className="flex items-center gap-2 mt-4">
              <input
                type="checkbox"
                name="persetujuan"
                checked={formData.persetujuan}
                onChange={handleChange}
                required
              />
              <label className="text-sm text-gray-700">
                Saya menyatakan data yang saya isi adalah benar.
              </label>
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
