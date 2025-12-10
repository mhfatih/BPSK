export const viewPdf = async (fileUrl) => {
  try {
    const response = await fetch(fileUrl);

    if (!response.ok) {
      throw new Error("Gagal mengambil file PDF");
    }

    const blob = await response.blob();
    const pdfURL = URL.createObjectURL(blob);

    // Buka PDF di tab baru
    window.open(pdfURL, "_blank");
    
  } catch (err) {
    console.error("Error membuka PDF:", err);
  }
};
