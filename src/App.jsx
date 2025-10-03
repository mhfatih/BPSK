import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import DashboardPage from "./pages/DashboardPage";
import KasusPage from "./pages/KasusPage";
import KasusDetail from "./pages/KasusDetail";
import PengaduanPage from "./pages/PengaduanPage";
import ManajemenPage from "./pages/ManajemenPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route path="/dashboard" element={<Dashboard />}>
        <Route index element={<DashboardPage />} />
        <Route path="kasus" element={<KasusPage />} />
        <Route path="kasus/:id" element={<KasusDetail />} />
        <Route path="pengaduan" element={<PengaduanPage />} />
        <Route path="manajemen" element={<ManajemenPage />} />
        <Route path="profile" element={<ProfilePage />} />
        {/* <Route path="laporan" element={<LaporanPage />} />  */}
      </Route>
      
    </Routes>
  );
}

export default App;
