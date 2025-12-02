import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../src/components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import EditProfilePage from "./pages/EditProfilePage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyOtp from "./pages/VerifyOtp";
import DashboardLayout from "./components/DashboardLayout";
// import DashboardPage from "./pages/PageDashboard";
import DashboardModern from "./pages/DashboardPage";
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
import Verifikasi from "./pages/PengaduanProses";


function App() {
  return (
    <Routes>
      {/* Halaman publik */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* Layout wrapper untuk semua halaman login */}
      <Route element={<ProtectedRoute allowedRoles={["user", "admin", "superadmin"]}><Navbar /></ProtectedRoute>}>
        {/* Halaman default setelah login */}
        <Route path="dashboard" element={<DashboardModern />} />

        {/* Halaman user */}
        <Route path="profile" element={<ProfilePage />} />
        <Route path="/profile/edit" element={<EditProfilePage />} />
        <Route path="profile/change-password" element={<ChangePasswordPage />} />
        
        <Route path="kasus" element={<KasusList />} />
        <Route path="kasus/:id" element={<KasusDetail />} />
        <Route path="pengaduan" element={<TambahPengaduan />} />
        
        <Route path="kasus/sidang/:id" element={<JadwalSidang />} />
        <Route path="kasus/:id/data-diri" element={<PengaduanDataDiri />} />
        <Route path="kasus/:id/pelaku-usaha" element={<PelakuUsaha />} />
        <Route path="kasus/:id/tentang-pengaduan" element={<TentangPengaduan />} />
        <Route path="kasus/:id/kronologis-pengaduan" element={<KronologisPengaduan />} />
        <Route path="kasus/:id/view" element={<ViewPengaduan />} />
        <Route path="kasus/:id/proses" element={<Verifikasi />} />

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
