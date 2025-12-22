export const headerWKP1 = (pdf, logo) => {
    const render = () => {
      const img = new Image();
      img.src = logo;
  
      pdf.addImage(img, "PNG", 12, 15, 25, 20);
      
  
      pdf.setFont("times", "bold");
      pdf.setFontSize(14);
      pdf.text("BADAN PENYELESAIAN SENGKETA KONSUMEN (BPSK)", 105, 20, { align: "center" });
      pdf.text("PROVINSI BANTEN WILAYAH KERJA I", 105, 27, { align: "center" });
    
      pdf.setFont("times", "italic");
      pdf.setFontSize(10);
      pdf.text(
        "Ruko Permata Cisadane, Jl. Teuku Umar, Karawaci, Kota Tangerang – Banten 15115",
        105,
        33,
        { align: "center" }
      );
  
      pdf.setLineWidth(0.6);
      pdf.line(15, 37, 195, 37);
    };
  
    render();
    return render; // ⬅️ penting
  };
  