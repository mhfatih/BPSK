// export const checkPageBreak = (pdf, y, headerFn) => {
//     const pageHeight = pdf.internal.pageSize.getHeight();
//     const bottomMargin = 20;
  
//     if (y >= pageHeight - bottomMargin) {
//       pdf.addPage();
  
//       // render header lagi di halaman baru
//       if (headerFn) {
//         headerFn();
//       }
  
//       return 50; // posisi Y setelah header
//     }
  
//     return y;
// };
  
export const checkPageBreak = (pdf, y, renderHeader, startY = 65) => {
    if (y > 270) {
      pdf.addPage();
      renderHeader();      // render header halaman baru
      return startY;       // reset posisi Y
    }
    return y;
  };



  export const drawSectionTitle = (pdf, x, y, title) => {
    const width = 170;
    const height = 8;
  
    pdf.setFont("times", "bold");
    pdf.setFontSize(11);
  
    pdf.rect(x, y, width, height);
    pdf.text(title, x + 2, y + 5.5);
  };
  
  
  export const drawRow = (
    pdf,
    x,
    y,
    label,
    value,
    labelWidth = 45,
    rowHeight = 8
  ) => {
    const totalWidth = 170;
    const valueWidth = totalWidth - labelWidth;
  
    pdf.setFont("times", "normal");
    pdf.setFontSize(10);
  
    // kotak label
    pdf.rect(x, y, labelWidth, rowHeight);
    pdf.text(label, x + 2, y + 5.5);
  
    // kotak value
    pdf.rect(x + labelWidth, y, valueWidth, rowHeight);
    pdf.text(value || "-", x + labelWidth + 2, y + 5.5);
  };
  
  
  export const drawLongField = (
    pdf,
    x,
    y,
    label,
    value,
    height = 30
  ) => {
    const labelWidth = 45;
    const totalWidth = 170;
    const valueWidth = totalWidth - labelWidth;
  
    pdf.setFont("times", "normal");
    pdf.setFontSize(10);
  
    // label
    pdf.rect(x, y, labelWidth, height);
    pdf.text(label, x + 2, y + 6);
  
    // value box
    pdf.rect(x + labelWidth, y, valueWidth, height);
  
    const text = pdf.splitTextToSize(value || "-", valueWidth - 4);
    pdf.text(text, x + labelWidth + 2, y + 6);
  };

  export const drawCheckboxRow = (
    pdf,
    x,
    y,
    label,
    options = [],
    checkedValue
  ) => {
    const labelWidth = 45;
    const totalWidth = 170;
    const valueX = x + labelWidth;
  
    // label box
    pdf.rect(x, y, labelWidth, 8);
    pdf.text(label, x + 2, y + 5.5);
  
    // value box
    pdf.rect(valueX, y, totalWidth - labelWidth, 8);
  
    let cx = valueX + 3;
  
    options.forEach((opt) => {
      pdf.rect(cx, y + 2, 4, 4); // kotak checkbox
  
      if (opt === checkedValue) {
        pdf.text("✓", cx + 0.8, y + 5.5);
      }
  
      pdf.text(opt, cx + 6, y + 5.5);
      cx += pdf.getTextWidth(opt) + 18;
    });
  };
  
  export const sectionTitle = (pdf, text, x, y) => {
    pdf.setFont("times", "bold");
    pdf.text(text, x, y);
    pdf.setFont("times", "normal");
  };
  
  export const keyValueLine = (
    pdf,
    label,
    value,
    x,
    y,
    options = {}
  ) => {
    const colonX = options.colonX || x + 40; // posisi ":" sejajar
    const valueX = colonX + 4;               // teks value mulai
  
    const text = value || "-";
    const maxWidth = options.maxWidth || 195 - valueX;
  
    // label
    pdf.text(label, x, y);
  
    // titik dua
    pdf.text(":", colonX, y);
  
    // value (wrap otomatis)
    const lines = pdf.splitTextToSize(text, maxWidth);
    pdf.text(lines, valueX, y);
  
    // return tinggi baris (biar fleksibel)
    return lines.length * 6;
  };
  
  