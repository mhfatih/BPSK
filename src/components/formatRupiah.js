export const formatRupiah = (value) => {
    if (value == null || isNaN(value)) return "Rp0";

    const num = Number(value);

    // 🟦 Jika >= 1 Triliun
    if (num >= 1_000_000_000_000) {
        return `Rp ${(num / 1_000_000_000_000).toFixed(1)} T`;
    }

    // 🟩 Jika >= 1 Milyar
    if (num >= 1_000_000_000) {
        return `Rp ${(num / 1_000_000_000).toFixed(1)} M`;
    }

    // 🟨 Selain itu → pakai format Rupiah biasa
    return `Rp ${num.toLocaleString("id-ID")}`;
  };
  