import React, { useEffect, useState } from "react";
import { apiClient } from "../api/apiClient";

export default function ManajemenPage() {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [form, setForm] = useState({
    nama: "",
    email: "",
    password: "",
    role: "user",
  });
  const [editUser, setEditUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [search, setSearch] = useState("");

  // Pagination state
  const [page, setPage] = useState(1);
  const limit = 10;
  const totalPages = Math.ceil((filtered?.length || 0) / limit);

  // === Ambil semua user ===
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await apiClient("/users", { method: "GET" });
        console.log("Response dari API:", res);

        // ✅ Backend kirim array langsung, bukan { users: [...] }
        const userData = Array.isArray(res) ? res : [];
        setUsers(userData);
        setFiltered(userData);
      } catch (err) {
        console.error(err);
        alert("Gagal memuat data user");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [refresh]);


  // === Pencarian ===
  useEffect(() => {
  if (!Array.isArray(users)) return;

  const filteredData = users.filter((u) =>
    (u?.email || "").toLowerCase().includes(search.toLowerCase()) ||
    (u?.nama || "").toLowerCase().includes(search.toLowerCase())
  );

  setFiltered(filteredData);
  setPage(1);
}, [search, users]);



  // === Handle form input ===
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // === Buat user baru ===
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.email || !form.nama || !form.password)
      return alert("Semua field wajib diisi!");

    try {
      setLoading(true);
      await apiClient("/users", { method: "POST", body: form });
      alert("User berhasil dibuat!");
      setForm({ email: "", nama: "", password: "", role: "user" });
      setRefresh((r) => !r);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Gagal membuat user");
    } finally {
      setLoading(false);
    }
  };

  // === Hapus user ===
  const handleDelete = async (id, role) => {
    if (role === "superadmin") return alert("Superadmin tidak bisa dihapus!");
    if (!window.confirm("Yakin ingin menghapus user ini?")) return;
    try {
      setLoading(true);
      await apiClient(`/users/${id}`, { method: "DELETE" });
      alert("User berhasil dihapus!");
      setRefresh((r) => !r);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Gagal menghapus user");
    } finally {
      setLoading(false);
    }
  };

  // === Update user ===
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Hapus password jika kosong agar tidak overwrite
      const dataToSend = { ...editUser };
      if (!dataToSend.password) delete dataToSend.password;

      await apiClient(`/users/${editUser.id}`, {
        method: "PUT",
        body: dataToSend, 
      });
      alert("User berhasil diperbarui!");
      setEditUser(null);
      setRefresh((r) => !r);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Gagal memperbarui user");
    } finally {
      setLoading(false);
    }
  };

  // === Pagination Data ===
  const paginatedUsers = (filtered || []).slice((page - 1) * limit, page * limit);


  if (loading) return <p className="text-center mt-6">Memuat data...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-center">👥 Manajemen User</h2>

      {/* === FORM TAMBAH USER === */}
      <form
        onSubmit={handleCreate}
        className="mb-8 p-6 bg-white border rounded-lg shadow-md"
      >
        <h3 className="font-semibold mb-4 text-gray-700">Tambah User Baru</h3>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="email"
            placeholder="Email"
            className="border p-2 rounded"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="nama"
            placeholder="Nama Lengkap"
            className="border p-2 rounded"
            value={form.nama}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="border p-2 rounded"
            value={form.password}
            onChange={handleChange}
            required
          />
          <select
            name="role"
            className="border p-2 rounded"
            value={form.role}
            onChange={handleChange}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="superadmin">Superadmin</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-4 bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Menyimpan..." : "Tambah User"}
        </button>
      </form>

      {/* === SEARCH BAR === */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Cari berdasarkan nama atau email..."
          className="border p-2 rounded w-1/2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="text-gray-600 text-sm">
          Total: {filtered?.length || 0} user
        </span>
      </div>

      {/* === TABEL USER === */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3 text-left">Email</th>
              <th className="border p-3 text-left">Nama Lengkap</th>
              <th className="border p-3 text-left">Role</th>
              <th className="border p-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="border p-3">{u.email}</td>
                  <td className="border p-3">{u.nama || "-"}</td>
                  <td className="border p-3 capitalize">{u.role}</td>
                  <td className="border p-3 text-center">
                    <button
                      onClick={() => setEditUser(u)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(u.id, u.role)}
                      className={`px-3 py-1 rounded ${
                        u.role === "superadmin"
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-red-600 hover:bg-red-700 text-white"
                      }`}
                      disabled={u.role === "superadmin"}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="text-center text-gray-500 py-4 italic"
                >
                  Tidak ada user ditemukan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* === PAGINATION === */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className={`px-3 py-1 rounded ${
            page === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          Prev
        </button>
        <span className="text-gray-700">
          Halaman {page} dari {totalPages || 1}
        </span>
        <button
          disabled={page === totalPages || totalPages === 0}
          onClick={() => setPage((p) => p + 1)}
          className={`px-3 py-1 rounded ${
            page === totalPages || totalPages === 0
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          Next
        </button>
      </div>

      {/* === MODAL EDIT === */}
      {editUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="font-semibold mb-3 text-gray-700">Edit User</h3>
            <form onSubmit={handleEditSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                value={editUser.email || ""}
                className="border p-2 rounded bg-gray-100 cursor-not-allowed"
                placeholder="Email"
                disabled
              />
              <input
                type="text"
                value={editUser.nama || ""}
                onChange={(e) =>
                  setEditUser({ ...editUser, nama: e.target.value })
                }
                className="border p-2 rounded"
                placeholder="Nama Lengkap"
              />
              <input
                type="password"
                value={editUser.password || ""}
                onChange={(e) =>
                  setEditUser({ ...editUser, password: e.target.value })
                }
                className="border p-2 rounded"
                placeholder="Password (biarkan kosong jika tidak diubah)"
              />
              <select
                value={editUser.role}
                onChange={(e) =>
                  setEditUser({ ...editUser, role: e.target.value })
                }
                className="border p-2 rounded"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="superadmin">Superadmin</option>
              </select>
              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setEditUser(null)}
                  className="px-4 py-1 bg-gray-400 rounded text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-1 bg-green-600 rounded text-white hover:bg-green-700"
                >
                  {loading ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
