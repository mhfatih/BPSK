export const headerWKP2 = (pdf, logo) => {
    const render = () => {
  
    const img = new Image();
    img.src = logo;
  
    pdf.addImage(img, "PNG", 12, 15, 25, 20);
    
  
    pdf.setFont("times", "bold");
    pdf.setFontSize(14);
    pdf.text("BADAN PENYELESAIAN SENGKETA KONSUMEN (BPSK)", 105, 20, { align: "center" });
    pdf.text("PROVINSI BANTEN WILAYAH KERJA II", 105, 27, { align: "center" });
  
    pdf.setFont("times", "italic");
    pdf.setFontSize(10);
    pdf.text(
      "Jl. Jaksa Agung R. Soeprapto KM 5, Karundang, Kec. Cipocok Jaya, Kota Serang – Banten 42126",
      105,
      33,
      { align: "center" }
    );
  
    pdf.setLineWidth(0.6);
    pdf.line(15, 37, 195, 37);
  };
  
  render();
  return render;
  
  };
  