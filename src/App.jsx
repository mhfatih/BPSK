import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../src/components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar"; // layout wrapper
import DashboardPage from "./pages/DashboardPage";
import KasusPage from "./pages/KasusPage";
import KasusList from "./pages/KasusList"
import KasusDetail from "./pages/KasusDetail";
import PengaduanPage from "./pages/PengaduanPage";
import ManajemenPage from "./pages/ManajemenPage";
import ProfilePage from "./pages/ProfilePage";
import MultiStepPengaduan from "./pages/MultiStepPengaduan";
import ViewPengaduan from "./pages/PengaduanView";
import TambahPengaduan from "./pages/TambahPengaduan";
import PengaduanDataDiri from "./pages/PengaduanDataDiri";
import PelakuUsaha from "./pages/PengaduanPelakuUsaha";
import TentangPengaduan from "./pages/TentangPengaduan";
import KronologisPengaduan from "./pages/PengaduanKronologis";
import JadwalSidang from "./pages/JadwalSidang";

function App() {
  return (
    <Routes>
      {/* Halaman publik */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Layout wrapper untuk semua halaman login */}
      <Route element={<ProtectedRoute allowedRoles={["user", "admin", "superadmin"]}><Navbar /></ProtectedRoute>}>
        {/* Halaman default setelah login */}
        <Route path="dashboard" element={<DashboardPage />} />

        {/* Halaman user */}
        <Route path="profile" element={<ProfilePage />} />
        <Route path="kasus" element={<KasusList />} />
        <Route path="kasus/:id" element={<KasusDetail />} />
        <Route path="pengaduan" element={<TambahPengaduan />} />
        <Route path="pengaduan/:id/view" element={<ViewPengaduan />} />
        <Route path="kasus/jadwal/:id" element={<JadwalSidang />} />
        <Route path="pengaduan/:id/data-diri" element={<PengaduanDataDiri />} />
        <Route path="pengaduan/:id/pelaku-usaha" element={<PelakuUsaha />} />
        <Route path="pengaduan/:id/tentang-pengaduan" element={<TentangPengaduan />} />
        <Route path="pengaduan/:id/kronologis-pengaduan" element={<KronologisPengaduan />} />

        {/* Hanya superadmin */}
        <Route
          path="manajemen"
          element={
            <ProtectedRoute allowedRoles={["superadmin"]}>
              <ManajemenPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Jika akses ditolak */}
      <Route path="/unauthorized" element={<h1>Akses Ditolak 🚫</h1>} />
    </Routes>
  );
}

export default App;
