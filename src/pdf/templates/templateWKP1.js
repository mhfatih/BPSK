import jsPDF from "jspdf";
import logo from "../../assets/LogoBanten.png";
import { headerWKP1 } from "../headers/headerWKP1";
import { checkPageBreak } from "../helpers";
import {
  drawSectionTitle,
  drawRow,
  drawLongField,
} from "../helpers";

export const templateWKP1 = (kasus) => {
  const pdf = new jsPDF("p", "mm", "a4");

  // header pertama
  const renderHeader = headerWKP1(pdf, logo);

  let y = 50;

  pdf.setFont("times", "bold");
  pdf.setFontSize(13);
  pdf.text("FORMULIR PENGADUAN KONSUMEN", 105, y, { align: "center" });
    y += 5;  
  pdf.setFontSize(12);
  pdf.text("Nomor : ", 105, y, { align: "center" });  
  y += 10;

  // ================= I. DATA PELAPOR =================
  y = checkPageBreak(pdf, y, renderHeader);
  drawSectionTitle(pdf, 20, y, "I. PENGADUAN KONSUMEN / PELAPOR");
  y += 8;

  drawRow(pdf, 20, y, "Nama", kasus.pengadu_nama); y += 8;
  drawRow(pdf, 20, y, "Umur", String(kasus.pengadu_umur || "-")); y += 8;
  drawRow(pdf, 20, y, "Jenis Kelamin", kasus.pengadu_jenis_kelamin); y += 8;
  drawRow(pdf, 20, y, "Alamat", kasus.pengadu_alamat); y += 8;
  drawRow(pdf, 20, y, "Kab/Kota", kasus.pengadu_kota); y += 8;
  drawRow(pdf, 20, y, "No HP", kasus.pengadu_no_hp); y += 8;
  drawRow(pdf, 20, y, "Email", kasus.pengadu_email); y += 10;

  // ================= II. PELAKU USAHA =================
  y = checkPageBreak(pdf, y, renderHeader);
  drawSectionTitle(pdf, 20, y, "II. YANG DIADUKAN / PELAKU USAHA");
  y += 8;

  const pelaku = kasus?.pelaku_usaha?.[0];

  drawRow(pdf, 20, y, "Nama Pemilik", pelaku?.pemilik); y += 8;
  drawRow(pdf, 20, y, "Perusahaan", pelaku?.perusahaan); y += 8;
  drawRow(pdf, 20, y, "Alamat", pelaku?.alamat); y += 8;
  drawRow(pdf, 20, y, "Kab/Kota", pelaku?.kota); y += 8;
  drawRow(pdf, 20, y, "No HP", pelaku?.no_hp); y += 10;

  // ================= III. TENTANG PENGADUAN =================
  y = checkPageBreak(pdf, y, renderHeader);
  drawSectionTitle(pdf, 20, y, "III. TENTANG PENGADUAN");
  y += 8;

  drawRow(pdf, 20, y, "Jenis Pengaduan", kasus.jenis_pengaduan); y += 8;
  drawRow(pdf, 20, y, "Tanggal Kejadian", kasus.tanggal_kejadian); y += 8;
  drawRow(pdf, 20, y, "Lokasi", kasus.lokasi_kejadian); y += 8;
  drawRow(pdf, 20, y, "Jenis Kerugian", kasus.jenis_kerugian); y += 10;

  // ================= KRONOLOGIS =================
  y = checkPageBreak(pdf, y, renderHeader);
  drawLongField(pdf, 20, y, "Kronologis", kasus.kronologis);
  y += 32;

  pdf.save(`Pengaduan_WKP1_${kasus.no_registrasi}.pdf`);
};
