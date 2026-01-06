// components/AuthLayout.jsx
import React from "react";
import bgImage from "../assets/indagl.jpeg";
import logo from "../assets/LogoBantenNew.png";

const AuthLayout = ({ title, subtitle, children }) => {
  return (
    <div className="flex h-screen bg-gray-100">

      {/* KIRI */}
      <div
        className="hidden md:flex w-1/2 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-blue-700/40 backdrop-blur-sm"></div>

        <div className="absolute bottom-10 left-10 text-white max-w-sm">
          <h1 className="text-4xl font-bold drop-shadow-lg">
            E-BPSK Provinsi Banten
          </h1>
          <p className="text-lg opacity-90 mt-2">
            Sistem pengelolaan pengaduan konsumen modern dan terintegrasi.
          </p>
        </div>
      </div>

      {/* KANAN */}
      <div className="flex w-full md:w-1/2 items-center justify-center p-8">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-white/40">

          {/* LOGO & TITLE */}
          <div className="flex flex-col items-center mb-6">
            <img src={logo} alt="Logo" className="w-20 h-20 drop-shadow-md" />
            <h2 className="text-2xl font-bold text-blue-900 mt-3 text-center">
              {title}
            </h2>
            {subtitle && (
              <p className="text-gray-600 text-sm text-center mt-1">
                {subtitle}
              </p>
            )}
          </div>

          {children}
        </div>
      </div>

    </div>
  );
};

export default AuthLayout;
