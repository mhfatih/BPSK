import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./component/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import DashboardPage from "./pages/DashboardPage";
import KasusPage from "./pages/KasusPage";
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


function App() {
  return (
    <Routes>
  {/* Halaman publik */}
  <Route path="/" element={<Navigate to="/login" />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />

  {/* Proteksi untuk semua user login */}
  <Route
    path="/dashboard"
    element={
      <ProtectedRoute allowedRoles={["user", "admin", "superadmin"]}>
        <Dashboard />
      </ProtectedRoute>
    }
  >
    <Route index element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
    <Route path="profile" element={<ProtectedRoute> <ProfilePage /> </ProtectedRoute>} />    
    <Route path="kasus" element={<ProtectedRoute> <KasusPage /> </ProtectedRoute>} />
    {/* <Route path="/pengaduan/tambah" element={<TambahPengaduan />} />     */}
    <Route path="kasus/:id" element={<ProtectedRoute><KasusDetail /> </ProtectedRoute> } />
    <Route path="pengaduan/:id/view" element={<ViewPengaduan />} />    
    <Route path="pengaduan" element={<TambahPengaduan />} />
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
