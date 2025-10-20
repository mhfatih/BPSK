// src/pages/MultiStepPengaduan.jsx
import React, { useEffect, useState } from "react";

/**
 * MultiStepPengaduan.jsx
 * - Pastikan backend berjalan di API_BASE dan cookie auth tersedia (credentials: "include")
 * - Endpoints backend (sesuai diskusi):
 *   POST /api/kasus/kasus-add
 *   POST /api/kasus/:id/data-diri-update    (multipart/form-data)
 *   POST /api/kasus/:id/pelaku-usaha-update (application/json)
 *   POST /api/kasus/:id/tentang-pengaduan-update (multipart/form-data)
 *   POST /api/kasus/:id/kronologis-update  (application/json)
 *   POST /api/kasus/:id/submit-kasus        (application/json)
 */

const API_BASE = "http://localhost:3000/api";

export default function MultiStepPengaduan() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [kasusId, setKasusId] = useState(null);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [formData, setFormData] = useState({
    // step 1
    tanggal: new Date().toISOString().split("T")[0],
    nomorRegistrasi: `REG-${Date.now()}`,

    // step 2 - data pengadu
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
    foto_identitas: null, // File

    // step 3 - pelaku usaha
    namaPemilik: "",
    namaUsaha: "",
    alamatUsaha: "",
    kodeposUsaha: "",
    kotaUsaha: "",
    teleponUsaha: "",

    // step 4 - tentang pengaduan
    jenis_pengaduan: "",
    tanggal_kejadian: "",
    waktu_kejadian: "",
    lokasi_kejadian: "",
    bentuk_kerugian: "",
    detail_kerugian: "",
    
    // lampiran: array of Files
    lampiran: [{ jenis: "", label: "", file: null }],

    // step 5 - kronologis/tuntutan
    kronologis: "",
    gantiBarang: false,
    gantiUang: false,
    gantiRawat: false,
    gantiSantunan: false,
    gantiTeguran: false,
    gantiMoril: false,
    deskripsiMoril: "",
    gantiLain: false,
    deskripsiLain: "",

    // step 6 - confirmation
    persetujuan: false,
  });

  // compute umur when tanggal_lahir changes
  useEffect(() => {
    if (!formData.tanggal_lahir) {
      setFormData((f) => ({ ...f, umur: "" }));
      return;
    }
    const today = new Date();
    const birth = new Date(formData.tanggal_lahir);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    setFormData((f) => ({ ...f, umur: age >= 0 ? age : "" }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.tanggal_lahir]);

  // generic change handler
  const handleChange = (e) => {
    const { name, type, value, checked, files } = e.target;
    if (type === "checkbox") {
      setFormData((f) => ({ ...f, [name]: checked }));
    } else if (type === "file") {
      // single file field
      setFormData((f) => ({ ...f, [name]: files[0] || null }));
    } else {
      setFormData((f) => ({ ...f, [name]: value }));
    }
  };

  // Handler lampiran
const handleAddLampiran = () => {
    setFormData(prev => ({
      ...prev,
      lampiran: [...prev.lampiran, { jenis: "", label: "", file: null }],
    }));
  };
  
  const handleRemoveLampiran = (index) => {
    setFormData(prev => ({
      ...prev,
      lampiran: prev.lampiran.filter((_, i) => i !== index),
    }));
  };
  
  const handleLampiranJenisChange = (e, index) => {
    const newLampiran = [...formData.lampiran];
    newLampiran[index].jenis = e.target.value;
    setFormData(prev => ({ ...prev, lampiran: newLampiran }));
  };

  // helper read response safely (try JSON else text)
  const parseResponse = async (res) => {
    const txt = await res.text();
    try {
      return JSON.parse(txt);
    } catch {
      return { message: txt || `HTTP ${res.status}` };
    }
  };

  // create kasus draft
  const createKasus = async () => {
    setError("");
    setLoading(true);
    setSuccessMsg("");
    try {
      const res = await fetch(`${API_BASE}/kasus/kasus-add`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const data = await parseResponse(res);
      if (!res.ok) throw new Error(data.message || "Gagal membuat kasus");
      setKasusId(data.kasus_id);
      setSuccessMsg("Draft kasus dibuat.");
      return data.kasus_id;
    } catch (err) {
      console.error(err);
      setError(err.message || "Gagal membuat kasus");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Data Diri (multipart)
  const submitDataDiri = async (id, isDraft = false) => {
    setError("");
    setSuccessMsg("");
    setLoading(true);
    try {
      const body = new FormData();
      body.append("nama_lengkap", formData.nama_lengkap || "");
      body.append("tanggal_lahir", formData.tanggal_lahir || "");
      body.append("jenis_kelamin", formData.jenis_kelamin || "");
      body.append("kota", formData.kota || "");
      body.append("alamat", formData.alamat || "");
      body.append("email", formData.email || "");
      body.append("no_hp", formData.no_hp || "");
      body.append("kode_pos", formData.kode_pos || "");
      body.append("identitas", formData.identitas || "");
      if (formData.foto_identitas) body.append("foto_identitas", formData.foto_identitas);
      // if saving draft, backend may accept incomplete data, we still send
      body.append("use_profile", "false");

      const res = await fetch(`${API_BASE}/kasus/${id}/data-diri-update`, {
        method: "POST",
        credentials: "include",
        body,
      });
      const data = await parseResponse(res);
      if (!res.ok) throw new Error(data.message || "Gagal menyimpan data diri");
      setSuccessMsg("Data diri tersimpan.");
      return true;
    } catch (err) {
      console.error(err);
      setError(err.message || "Gagal menyimpan data diri");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Pelaku usaha (JSON)
  const submitPelakuUsaha = async (id, isDraft = false) => {
    setError("");
    setSuccessMsg("");
    setLoading(true);
    try {
      const payload = {
        nama_pemilik: formData.namaPemilik || "",
        perusahaan: formData.namaUsaha || "",
        kota: formData.kotaUsaha || "",
        alamat: formData.alamatUsaha || "",
        kode_pos: formData.kodeposUsaha || "",
        no_hp: formData.teleponUsaha || "",
      };

      const res = await fetch(`${API_BASE}/kasus/${id}/pelaku-usaha-update`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await parseResponse(res);
      if (!res.ok) throw new Error(data.message || "Gagal menyimpan pelaku usaha");
      setSuccessMsg("Data pelaku usaha tersimpan.");
      return true;
    } catch (err) {
      console.error(err);
      setError(err.message || "Gagal menyimpan pelaku usaha");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Tentang pengaduan (multipart + files)
  const submitTentangPengaduan = async (id, isDraft = false) => {
    setError("");
    setSuccessMsg("");
    setLoading(true);
    try {
      const body = new FormData();
      body.append("jenis_pengaduan", formData.jenis_pengaduan || "");
      body.append("tanggal_kejadian", formData.tanggal_kejadian || "");
      body.append("waktu_kejadian", formData.waktu_kejadian || "");
      body.append("lokasi_kejadian", formData.lokasi_kejadian || "");

      // compose kerugian text from checkboxes
      const kerugianArr = [];
      if (formData.kerugian_material) kerugianArr.push(`Material:${formData.keterangan_material || "-"}`);
      if (formData.kerugian_fisik) kerugianArr.push(`Fisik:${formData.keterangan_fisik || "-"}`);
      body.append("kerugian", kerugianArr.join(" | ") || "");

      // we map first three lampiran as placeholders for bukti_pembelian, bukti_saksi, barang_bukti
      body.append("bukti_pembelian", formData.lampiran[0] ? formData.lampiran[0].name : "");
      body.append("bukti_saksi", formData.lampiran[1] ? formData.lampiran[1].name : "");
      body.append("barang_bukti", formData.lampiran[2] ? formData.lampiran[2].name : "");

      // append lampiran files as bukti[]
      formData.lampiran.forEach((f) => {
        if (f) body.append("bukti[]", f);
      });

      const res = await fetch(`${API_BASE}/kasus/${id}/tentang-pengaduan-update`, {
        method: "POST",
        credentials: "include",
        body,
      });
      const data = await parseResponse(res);
      if (!res.ok) throw new Error(data.message || "Gagal menyimpan pengaduan");
      setSuccessMsg("Data pengaduan tersimpan.");
      return true;
    } catch (err) {
      console.error(err);
      setError(err.message || "Gagal menyimpan pengaduan");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Kronologis (JSON)
  const submitKronologis = async (id, isDraft = false) => {
    setError("");
    setSuccessMsg("");
    setLoading(true);
    try {
      const payload = {
        kronologis: formData.kronologis || "",
        jenisTuntutan: [
          formData.gantiBarang && "Barang",
          formData.gantiUang && "Uang",
          formData.gantiRawat && "Rawat",
          formData.gantiSantunan && "Santunan",
          formData.gantiTeguran && "Teguran",
          formData.gantiMoril && `Moril:${formData.deskripsiMoril || "-"}`,
          formData.gantiLain && `Lain:${formData.deskripsiLain || "-"}`,
        ]
          .filter(Boolean)
          .join(", "),
      };

      const res = await fetch(`${API_BASE}/kasus/${id}/kronologis-update`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await parseResponse(res);
      if (!res.ok) throw new Error(data.message || "Gagal menyimpan kronologis");
      setSuccessMsg("Kronologis tersimpan.");
      return true;
    } catch (err) {
      console.error(err);
      setError(err.message || "Gagal menyimpan kronologis");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Submit final (submit-kasus)
  const submitFinal = async (id) => {
    setError("");
    setSuccessMsg("");
    setLoading(true);
    try {
      const payload = { konfirmasi: !!formData.persetujuan };
      const res = await fetch(`${API_BASE}/kasus/${id}/submit-kasus`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await parseResponse(res);
      if (!res.ok) throw new Error(data.message || "Gagal submit kasus");
      setSuccessMsg("Kasus berhasil dikirim. Terima kasih.");
      return true;
    } catch (err) {
      console.error(err);
      setError(err.message || "Gagal submit kasus");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Handler untuk tombol Next: melakukan validasi ringan & submit step
  const handleNext = async () => {
    setError("");
    setSuccessMsg("");
    // ensure there's a kasus draft
    let id = kasusId;
    if (!id) {
      id = await createKasus();
      if (!id) return;
    }

    if (step === 1) {
      // nothing to submit for step 1 besides ensuring draft exists
      setStep(2);
      return;
    }

    if (step === 2) {
      // required fields for progressing
      if (!formData.nama_lengkap || !formData.email) {
        setError("Nama dan email wajib diisi.");
        return;
      }
      const ok = await submitDataDiri(id, false);
      if (!ok) return;
      setKasusId(id);
      setStep(3);
      return;
    }

    if (step === 3) {
      // basic validation
      if (!formData.namaPemilik || !formData.namaUsaha) {
        setError("Nama pemilik dan nama usaha wajib diisi.");
        return;
      }
      const ok = await submitPelakuUsaha(id, false);
      if (!ok) return;
      setStep(4);
      return;
    }

    if (step === 4) {
      if (!formData.jenis_pengaduan || !formData.tanggal_kejadian || !formData.lokasi_kejadian) {
        setError("Jenis, tanggal, dan tempat kejadian wajib diisi.");
        return;
      }
      const ok = await submitTentangPengaduan(id, false);
      if (!ok) return;
      setStep(5);
      return;
    }

    if (step === 5) {
      if (!formData.kronologis) {
        setError("Kronologis wajib diisi.");
        return;
      }
      const ok = await submitKronologis(id, false);
      if (!ok) return;
      setStep(6);
      return;
    }
  };

  const handlePrev = () => {
    setError("");
    setSuccessMsg("");
    if (step > 1) setStep((s) => s - 1);
  };

  // Save Draft (saves current step without strict validation)
  const handleSaveDraft = async () => {
    setError("");
    setSuccessMsg("");
    let id = kasusId;
    if (!id) {
      id = await createKasus();
      if (!id) return;
    }

    try {
      // Save depending on current step (but can also save previous steps)
      if (step === 1) {
        setSuccessMsg("Draft dibuat.");
        setKasusId(id);
        return;
      }
      if (step === 2) {
        const ok = await submitDataDiri(id, true);
        if (ok) setKasusId(id);
        return;
      }
      if (step === 3) {
        await submitPelakuUsaha(id, true);
        return;
      }
      if (step === 4) {
        await submitTentangPengaduan(id, true);
        return;
      }
      if (step === 5) {
        await submitKronologis(id, true);
        return;
      }
    } catch (err) {
      console.error(err);
      setError("Gagal menyimpan draft");
    }
  };

  // final submit handler (submit-kasus)
  const handleSubmitFinal = async (e) => {
    e.preventDefault();
    setError("");
    if (!formData.persetujuan) {
      setError("Harus menyetujui pernyataan sebelum mengirim.");
      return;
    }
    if (!kasusId) {
      setError("Kasus belum dibuat (draft). Tekan Simpan Draft / lanjutkan steps terlebih dahulu.");
      return;
    }

    const ok = await submitFinal(kasusId);
    if (!ok) return;
    // Reset form minimal after success
    setStep(1);
    setKasusId(null);
    setFormData({
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
      teleponUsaha: "",
      jenis_pengaduan: "",
      tanggal_kejadian: "",
      waktu_kejadian: "",
      lokasi_kejadian: "",
      bentuk_kerugian: "",
      detail_kerugian: "",
      lampiran: [null],
      kronologis: "",
      gantiBarang: false,
      gantiUang: false,
      gantiRawat: false,
      gantiSantunan: false,
      gantiTeguran: false,
      gantiMoril: false,
      deskripsiMoril: "",
      gantiLain: false,
      deskripsiLain: "",
      persetujuan: false,
    });
  };

  // small UI helper render for file preview
  const renderFileName = (file) => {
    if (!file) return "Tidak ada";
    return file.name || String(file);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
      <h1 className="text-2xl font-semibold mb-4">Form Pengaduan (Multi-step) — Simpan tiap step</h1>

      {/* Stepper */}
      <div className="mb-6">
        <div className="flex items-center gap-4">
          {[{ id: 1, label: "Pendaftaran" }, { id: 2, label: "Data Pengadu" }, { id: 3, label: "Pelaku Usaha" }, { id: 4, label: "Tentang Pengaduan" }, { id: 5, label: "Kronologis" }, { id: 6, label: "Konfirmasi" }].map((s) => (
            <div key={s.id} className="flex-1">
              <div className={`w-full flex items-center gap-3 ${s.id < step ? "text-green-600" : s.id === step ? "text-blue-600" : "text-gray-400"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${s.id < step ? "bg-green-500 text-white border-green-500" : s.id === step ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-400 border-gray-300"}`}>
                  {s.id}
                </div>
                <div className="hidden sm:block text-sm font-medium">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* messages */}
      {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
      {successMsg && <div className="mb-4 text-sm text-green-600">{successMsg}</div>}
      {kasusId && <div className="mb-4 text-sm text-gray-600">Draft ID: <strong>{kasusId}</strong></div>}

      <form onSubmit={handleSubmitFinal}>
        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Awal Pendaftaran</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Tanggal</label>
                <input type="date" name="tanggal" value={formData.tanggal} onChange={handleChange} className="w-full border rounded p-2" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Nomor Registrasi</label>
                <input type="text" readOnly value={formData.nomorRegistrasi} className="w-full border rounded p-2 bg-gray-50" />
              </div>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Data Pengadu</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Nama Lengkap</label>
                <input type="text" name="nama_lengkap" value={formData.nama_lengkap} onChange={handleChange} className="w-full border rounded p-2" required />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Tanggal Lahir</label>
                <div className="flex gap-3">
                  <input type="date" name="tanggal_lahir" value={formData.tanggal_lahir} onChange={handleChange} className="flex-1 border rounded p-2" />
                  <div className="w-32 inline-flex items-center justify-center border rounded p-2 bg-gray-50">
                    Umur: <span className="ml-2 font-medium">{formData.umur || "-"}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Jenis Kelamin</label>
                <select name="jenis_kelamin" value={formData.jenis_kelamin} onChange={handleChange} className="w-full border rounded p-2">
                  <option value="">Pilih</option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">NIK</label>
                <input name="identitas" value={formData.identitas} onChange={handleChange} className="w-full border rounded p-2" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">Alamat Lengkap</label>
                <textarea name="alamat" value={formData.alamat} onChange={handleChange} className="w-full border rounded p-2" rows={2} />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Kode Pos</label>
                <input name="kode_pos" value={formData.kode_pos} onChange={handleChange} className="w-full border rounded p-2" />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Kota / Kabupaten</label>
                <select name="kota" value={formData.kota} onChange={handleChange} className="w-full border rounded p-2">
                  <option value="">Pilih Kota/Kabupaten</option>
                  <option value="Kota Tangerang">Kota Tangerang</option>
                  <option value="Kota Tangerang Selatan">Kota Tangerang Selatan</option>
                  <option value="Kabupaten Tangerang">Kabupaten Tangerang</option>
                  <option value="Kabupaten Serang">Kabupaten Serang</option>
                  <option value="Kota Serang">Kota Serang</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Nomor Telepon</label>
                <input name="no_hp" value={formData.no_hp} onChange={handleChange} className="w-full border rounded p-2" />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border rounded p-2" required />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">Foto Identitas (gambar)</label>
                <input type="file" name="foto_identitas" accept="image/*" onChange={handleChange} className="w-full" />
                {formData.foto_identitas && <img alt="preview" src={URL.createObjectURL(formData.foto_identitas)} className="w-32 h-32 object-cover rounded mt-2 border" />}
              </div>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Data Pelaku Usaha</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Nama Pemilik</label>
                <input name="namaPemilik" value={formData.namaPemilik} onChange={handleChange} className="w-full border rounded p-2" required />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Nama Perusahaan</label>
                <input name="namaUsaha" value={formData.namaUsaha} onChange={handleChange} className="w-full border rounded p-2" required />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">Alamat Perusahaan</label>
                <input name="alamatUsaha" value={formData.alamatUsaha} onChange={handleChange} className="w-full border rounded p-2" required />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Kode Pos</label>
                <input name="kodeposUsaha" value={formData.kodeposUsaha} onChange={handleChange} className="w-full border rounded p-2" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Kota</label>
                <select name="kotaUsaha" value={formData.kotaUsaha} onChange={handleChange} className="w-full border rounded p-2">
                  <option value="">Pilih Kota/Kabupaten</option>
                  <option value="Kota Tangerang">Kota Tangerang</option>
                  <option value="Kabupaten Serang">Kabupaten Serang</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Telepon Usaha</label>
                <input name="teleponUsaha" value={formData.teleponUsaha} onChange={handleChange} className="w-full border rounded p-2" />
              </div>
            </div>
          </div>
        )}

        {/* Step 4 - Tentang Pengaduan */}
        {/* Step 4: Tentang Pengaduan */}
        {step === 4 && (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold">Tentang Pengaduan</h2>

            {/* Jenis Pengaduan */}
            <div>
            <label className="block text-sm text-gray-600 mb-1">Jenis Pengaduan</label>
            <select
                name="jenis_pengaduan"
                value={formData.jenis_pengaduan}
                onChange={handleChange}
                className="w-full border rounded p-2"
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

            {/* Waktu & Lokasi */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <label className="block text-sm text-gray-600 mb-1">Tanggal Kejadian</label>
                <input
                type="date"
                name="tanggal_kejadian"
                value={formData.tanggal_kejadian}
                onChange={handleChange}
                className="w-full border rounded p-2"
                />
            </div>
            <div>
                <label className="block text-sm text-gray-600 mb-1">Waktu Kejadian</label>
                <input
                type="time"
                name="waktu_kejadian"
                value={formData.waktu_kejadian}
                onChange={handleChange}
                className="w-full border rounded p-2"
                />
            </div>
            <div>
                <label className="block text-sm text-gray-600 mb-1">Tempat Kejadian</label>
                <input
                name="lokasi_kejadian"
                value={formData.lokasi_kejadian}
                onChange={handleChange}
                className="w-full border rounded p-2"
                />
            </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* 🧾 Bentuk & Keterangan Kerugian */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bentuk Kerugian
              </label>
              <select
                name="bentuk_kerugian"
                value={formData.bentuk_kerugian}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Pilih Bentuk Kerugian</option>
                <option value="fisik">Fisik</option>
                <option value="material">Material</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Keterangan Kerugian
              </label>
              <textarea
                name="keterangan_kerugian"
                value={formData.keterangan_kerugian || ""}
                onChange={handleChange}
                placeholder="Jelaskan detail kerugian yang dialami"
                rows="3"
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* 📄 Bukti Pembelian */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bukti Pembelian
              </label>
              <select
                name="bukti_pembelian"
                value={formData.bukti_pembelian}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Pilih Bukti Pembelian</option>
                <option value="bon pembelian">Bon Pembelian</option>
                <option value="kwitansi">Kwitansi</option>
                <option value="faktur">Faktur</option>
                <option value="tanda terima">Tanda Terima</option>
                <option value="lain-lain">Lain-lain</option>
              </select>
            </div>

            {/* 👥 Bukti Saksi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bukti Saksi
              </label>
              <select
                name="bukti_saksi"
                value={formData.bukti_saksi}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Pilih Bukti Saksi</option>
                <option value="ada">Ada</option>
                <option value="tidak ada">Tidak Ada</option>
              </select>

              {formData.bukti_saksi === "ada" && (
                <input
                  type="text"
                  name="hubungan_saksi"
                  value={formData.hubungan_saksi}
                  onChange={handleChange}
                  placeholder="Hubungan dengan Saksi"
                  className="w-full border rounded-lg p-2 mt-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              )}
            </div>

            {/* 📦 Barang Bukti */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Barang Bukti
              </label>
              <select
                name="barang_bukti"
                value={formData.barang_bukti}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Pilih Barang Bukti</option>
                <option value="ada">Ada</option>
                <option value="tidak ada">Tidak Ada</option>
              </select>
            </div>

            {/* 🖼️ Upload Foto Bukti */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Foto Bukti (Opsional)
              </label>
              <input
                type="file"
                name="foto_bukti"
                onChange={handleChange}
                accept="image/*"
                className="w-full border rounded-lg p-2 file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

            

            {/* Lampiran Bukti */}
            {/* <div className="space-y-3">
            <label className="block text-sm text-gray-600 mb-1 w-full">Lampiran Bukti</label>
            {formData.lampiran.map((item, idx) => (
                <div
                key={idx}
                className="flex flex-col md:flex-row md:items-center gap-3 bg-gray-50 p-3 rounded border"
                >
                <select
                    value={item.jenis || ""}
                    onChange={(e) => handleLampiranJenisChange(e, idx)}
                    className="border p-2 rounded w-full md:w-48"
                >
                    <option value="">Pilih Jenis Bukti</option>
                    <option value="bukti pembelian">Bukti Pembelian</option>
                    <option value="barang bukti">Barang Bukti</option>
                    <option value="bukti saksi">Bukti Saksi</option>
                </select>

                <input
                    type="text"
                    placeholder="Label bukti (opsional)"
                    value={item.label || ""}
                    onChange={(e) => handleLampiranLabelChange(e, idx)}
                    className="border p-2 rounded w-full md:w-48"
                />

                <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => handleLampiranFileChange(e, idx)}
                    className="flex-1"
                />

                <div className="text-sm text-gray-600 truncate w-36">
                    {item.file ? item.file.name : "Belum ada file"}
                </div>

                {idx > 0 && (
                    <button
                    type="button"
                    onClick={() => handleRemoveLampiran(idx)}
                    className="text-red-600 hover:underline"
                    >
                    Hapus
                    </button>
                )}
                </div>
            ))}

            <button
                type="button"
                onClick={handleAddLampiran}
                className="mt-2 px-3 py-2 border rounded text-blue-600 hover:bg-blue-50"
            >
                + Tambah Bukti
            </button>
            </div> */}
        </div>
        )}



        {/* Step 5 */}
        {step === 5 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Kronologis & Tuntutan</h2>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Kronologis</label>
              <textarea name="kronologis" value={formData.kronologis} onChange={handleChange} className="w-full border rounded p-2" rows={5} />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Jenis Tuntutan</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="flex items-center gap-2"><input type="checkbox" name="gantiBarang" checked={formData.gantiBarang} onChange={handleChange} className="w-5 h-5 accent-blue-600" /> Penggantian barang/jasa</label>
                <label className="flex items-center gap-2"><input type="checkbox" name="gantiUang" checked={formData.gantiUang} onChange={handleChange} className="w-5 h-5 accent-blue-600" /> Pengembalian uang</label>
                <label className="flex items-center gap-2"><input type="checkbox" name="gantiRawat" checked={formData.gantiRawat} onChange={handleChange} className="w-5 h-5 accent-blue-600" /> Perawatan kesehatan</label>
                <label className="flex items-center gap-2"><input type="checkbox" name="gantiSantunan" checked={formData.gantiSantunan} onChange={handleChange} className="w-5 h-5 accent-blue-600" /> Santunan</label>
                <label className="flex items-center gap-2"><input type="checkbox" name="gantiTeguran" checked={formData.gantiTeguran} onChange={handleChange} className="w-5 h-5 accent-blue-600" /> Teguran</label>

                <div className="flex items-center gap-2">
                  <input type="checkbox" name="gantiMoril" checked={formData.gantiMoril} onChange={handleChange} className="w-5 h-5 accent-blue-600" />
                  <input name="deskripsiMoril" value={formData.deskripsiMoril} onChange={handleChange} placeholder="Deskripsi tuntutan moril (opsional)" className="flex-1 border rounded p-2" />
                </div>

                <div className="flex items-center gap-2">
                  <input type="checkbox" name="gantiLain" checked={formData.gantiLain} onChange={handleChange} className="w-5 h-5 accent-blue-600" />
                  <input name="deskripsiLain" value={formData.deskripsiLain} onChange={handleChange} placeholder="Lain-lain (opsional)" className="flex-1 border rounded p-2" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 6 */}
        {step === 6 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Konfirmasi</h2>
            <div className="bg-gray-50 p-4 rounded border">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-gray-500">No Registrasi</div>
                  <div className="font-medium">{formData.nomorRegistrasi}</div>
                </div>
                <div>
                  <div className="text-gray-500">Nama</div>
                  <div className="font-medium">{formData.nama_lengkap}</div>
                </div>
                <div>
                  <div className="text-gray-500">Email</div>
                  <div className="font-medium">{formData.email}</div>
                </div>
                <div>
                  <div className="text-gray-500">Pelaku Usaha</div>
                  <div className="font-medium">{formData.namaUsaha}</div>
                </div>
                <div className="sm:col-span-2">
                  <div className="text-gray-500">Alamat Usaha</div>
                  <div className="font-medium">{formData.alamatUsaha}</div>
                </div>
                <div className="sm:col-span-2">
                  <div className="text-gray-500">Kronologis</div>
                  <div className="whitespace-pre-line">{formData.kronologis}</div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="inline-flex items-center cursor-pointer">
                <input type="checkbox" name="persetujuan" checked={formData.persetujuan} onChange={handleChange} className="sr-only peer" required />
                <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-600 transition relative">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition" />
                </div>
              </label>
              <div className="text-sm text-gray-700">Saya menyatakan data yang saya isi adalah benar dan dapat dipertanggungjawabkan.</div>
            </div>
          </div>
        )}

        {/* navigation */}
        <div className="mt-6 flex items-center justify-between">
          <div>
            {step > 1 && <button type="button" onClick={handlePrev} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Kembali</button>}
          </div>

          <div className="flex items-center gap-3">
            <button type="button" onClick={handleSaveDraft} disabled={loading} className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50">
              {loading ? "Menyimpan..." : "Simpan Draft"}
            </button>

            {step < 6 && (
              <button type="button" onClick={handleNext} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                {loading ? "Memproses..." : "Lanjut"}
              </button>
            )}
            {step === 6 && (
              <button type="submit" disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                {loading ? "Mengirim..." : "Kirim Pengaduan"}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
