import { templateWKP1 } from "./templates/templateWKP1";
import { templateWKP2 } from "./templates/templateWKP2";

export const downloadPengaduanPDF = (kasus) => {
  if (!kasus?.wilayah) {
    alert("Wilayah kerja tidak diketahui");
    return;
  }

  switch (kasus.wilayah) {
    case "WKP1":
    case "Wilayah Kerja I":
      return templateWKP1(kasus);

    case "WKP2":
    case "Wilayah Kerja II":
      return templateWKP2(kasus);

    default:
      alert(`Template PDF untuk ${kasus.wilayah} belum tersedia`);
  }
};
