export const downloadProtectedFile = async (url, filename) => {
    const token = localStorage.getItem("token");
  
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
  
    if (!res.ok) {
      console.error("Download error:", res.status, await res.text());
      return alert("Gagal download file.");
    }
  
    const blob = await res.blob();
  
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = filename || "download";
    link.click();
    window.URL.revokeObjectURL(link.href);
  };
  