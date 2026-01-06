import jsPDF from "jspdf";
import logo from "../../assets/LogoBanten.png";
import { headerWKP2 } from "../headers/headerWKP2";
import { checkPageBreak } from "../helpers";
import {
  drawSectionTitle,
  drawRow,
  drawLongField,
  drawCheckboxList,
} from "../helpers";

export const templateWKP2 = (kasus) => {
  const pdf = new jsPDF("p", "mm", "a4");

  const renderHeader = headerWKP2(pdf, logo);
  let y = 50;

  pdf.setFont("times", "bold");
  pdf.setFontSize(14);
  pdf.text("FORMULIR PENGADUAN KONSUMEN", 105, y, { align: "center" });
  y += 5;
  pdf.setFontSize(12);
  pdf.text(`Nomor : ${kasus.no_registrasi || ""}`, 105, y, { align: "center" });

  y += 10;

  // ========== I. PENGADU / KONSUMEN / KUASA ==========
  y = checkPageBreak(pdf, y, renderHeader);
  drawSectionTitle(pdf, 20, y, "I. PENGADU / KONSUMEN / KUASA");
  y += 8;

  drawRow(pdf, 20, y, "Nama", kasus.pengadu_nama); y += 8;
  drawRow(pdf, 20, y, "Umur", String(kasus.pengadu_umur || "-")); y += 8;
  drawRow(pdf, 20, y, "Jenis Kelamin", kasus.pengadu_jenis_kelamin); y += 8;
  drawRow(pdf, 20, y, "Alamat", kasus.pengadu_alamat); y += 8;
  drawRow(pdf, 20, y, "Kode Pos", kasus.pengadu_kode_pos); y += 8;
  drawRow(pdf, 20, y, "Telepon/HP", kasus.pengadu_no_hp); y += 8;
  drawRow(pdf, 20, y, "No. Identitas (KTP)", kasus.pengadu_identitas); y += 10;

  // ========== II. YANG DIADUKAN: PELAKU USAHA ==========
  y = checkPageBreak(pdf, y, renderHeader);
  drawSectionTitle(pdf, 20, y, "II. YANG DIADUKAN: PELAKU USAHA");
  y += 8;

  const pelaku = kasus?.pelaku_usaha?.[0];
  drawRow(pdf, 20, y, "Nama Pemilik", pelaku?.pemilik); y += 8;
  drawRow(pdf, 20, y, "Perusahaan", pelaku?.perusahaan); y += 8;
  drawRow(pdf, 20, y, "Alamat", pelaku?.alamat); y += 8;
  drawRow(pdf, 20, y, "Kode Pos", pelaku?.kode_pos); y += 8;
  drawRow(pdf, 20, y, "Telepon/HP", pelaku?.no_hp); y += 8;
  drawRow(pdf, 20, y, "Email", pelaku?.email); y += 10;

  // ========== III. TENTANG PENGADUAN ==========
  y = checkPageBreak(pdf, y, renderHeader);
  drawSectionTitle(pdf, 20, y, "III. TENTANG PENGADUAN");
  y += 8;

  drawRow(pdf, 20, y, "Jenis Pengaduan", kasus.jenis_pengaduan); y += 8;
  drawRow(pdf, 20, y, "Tanggal Kejadian", kasus.tanggal_kejadian); y += 8;
  drawRow(pdf, 20, y, "Jam/Waktu", kasus.waktu_kejadian); y += 8;
  drawRow(pdf, 20, y, "Lokasi/Tempat", kasus.lokasi_kejadian); y += 8;



  drawRow(pdf, 20, y, "Jenis Kerugian", kasus.jenis_kerugian); y += 8;  
  drawRow(pdf, 20, y, "Keterangan Kerugian", kasus.keterangan_kerugian); y += 8;
    
  drawRow(pdf, 20, y, "Bukti Pembelian", kasus.bukti_pembelian);
  y += 8;
  drawRow(pdf, 20, y, "Bukti Saksi", kasus.bukti_saksi ? "ada" : "tidak Ada");
  y += 8;
  if (kasus.bukti_saksi = "ada") {
    drawRow(pdf, 20, y, "Hubungan dengan Saksi", kasus.hubungan_saksi); y += 8;
  }  
  drawRow(pdf, 20, y, "Barang Bukti", kasus.barang_bukti ? "ada" : "tidak Ada");
  y += 10;  
  
  
    // ========== IV. MASALAH YANG DIADUKAN / DILAPORKAN ==========
    y = checkPageBreak(pdf, y, renderHeader, 40);
    drawSectionTitle(pdf, 20, y, "IV. MASALAH YANG DIADUKAN / DILAPORKAN (KRONOLOGIS)");
    y += 8;
  
    drawLongField(pdf, 20, y, "Kronologis", kasus.kronologis);
    y += 32;

    
      // ========== V. JENIS TUNTUTAN GANTI RUGI YANG DIINGINKAN ==========
  y = checkPageBreak(pdf, y, renderHeader);
  drawSectionTitle(pdf, 20, y, "V. JENIS TUNTUTAN GANTI RUGI YANG DIINGINKAN");
  y += 8;
  
  drawLongField(pdf, 20, y, "Jenis Tuntutan", kasus.jenis_tuntutan); y += 10;  

  pdf.save(`Pengaduan_WKP2_${kasus.no_registrasi}.pdf`);
};
