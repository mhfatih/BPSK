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
    <Route index element={<DashboardPage />} />
    <Route path="kasus" element={<KasusPage />} />
    <Route path="kasus/:id" element={<KasusDetail />} />
    <Route path="pengaduan" element={<MultiStepPengaduan />} />
    <Route path="profile" element={<ProfilePage />} />

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
