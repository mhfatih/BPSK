import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiClient } from "../api/apiClient";

const KasusDetail = () => {
  const { id } = useParams();
  const [kasus, setKasus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchKasus = async () => {
      try {
        setLoading(true);
        const data = await apiClient(`/kasus/${id}`);
        setKasus(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchKasus();
  }, [id]);

  if (loading) return <p>Memuat detail kasus...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (!kasus) return <p>Kasus tidak ditemukan</p>;

  return (
    <div className="kasus-detail">
      <h1>Detail Kasus #{kasus.id}</h1>

      <h2>Informasi Kasus</h2>
      <div>
        {Object.keys(kasus).map((key) => {
          if (key === "pelaku_usaha") return null;
          return (
            <p key={key}>
              <strong>{key.replace(/_/g, " ")}:</strong> {kasus[key] || "-"}
            </p>
          );
        })}
      </div>

      <h2>Pelaku Usaha</h2>
      {kasus.pelaku_usaha.length === 0 ? (
        <p>Tidak ada pelaku usaha terkait.</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Perusahaan</th>
              <th>Pemilik</th>
              <th>Kota</th>
              <th>Alamat</th>
              <th>Kode Pos</th>
              <th>No HP</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {kasus.pelaku_usaha.map((p) => (
              <tr key={p.id}>
                <td>{p.perusahaan}</td>
                <td>{p.pemilik}</td>
                <td>{p.kota}</td>
                <td>{p.alamat}</td>
                <td>{p.kode_pos}</td>
                <td>{p.no_hp}</td>
                <td>{p.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default KasusDetail;
