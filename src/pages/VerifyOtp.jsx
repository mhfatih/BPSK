import { useState } from "react";
import { useLocation } from "react-router-dom";
import { apiClient } from "../api/apiClient";
import logo from "../assets/LogoBanten.png";

const VerifyOtp = () => {
    const { state } = useLocation();
    const email = state?.email;

    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [resendSuccess, setResendSuccess] = useState("");

    const handleVerify = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await apiClient("/verify-otp", {
                method: "POST",
                body: { otp },
            });

            alert("OTP berhasil diverifikasi!");
            window.location.href = "/login";

        } catch (err) {
            setError(err.message || "OTP salah atau kadaluarsa");
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setError("");
        setResendSuccess("");
        setResendLoading(true);

        try {
            await apiClient("/resend-otp", {
                method: "POST",
                body: { email },
            });

            setResendSuccess("OTP baru telah dikirim ke email Anda.");

        } catch (err) {
            setError(err.message || "Gagal mengirim ulang OTP");
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">

                <div className="flex flex-col items-center mb-6">
                    <img src={logo} alt="Logo" className="w-16 h-16 mb-2" />
                    <h2 className="text-xl font-bold text-blue-900">Verifikasi OTP</h2>
                    <p className="text-gray-600 text-sm text-center">
                        Kami telah mengirim kode OTP ke email Anda.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-100 text-red-600 p-2 rounded mb-3 text-sm">
                        {error}
                    </div>
                )}

                {resendSuccess && (
                    <div className="bg-green-100 text-green-700 p-2 rounded mb-3 text-sm">
                        {resendSuccess}
                    </div>
                )}

                <form onSubmit={handleVerify}>
                    <label className="block text-gray-700 text-sm mb-1">Masukkan Kode OTP</label>

                    <input
                        type="text"
                        maxLength="6"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                        className="w-full border rounded-lg p-3 text-center text-xl tracking-widest font-mono focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="------"
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-4 bg-blue-700 hover:bg-blue-800 text-white py-2 rounded-lg transition font-medium"
                    >
                        {loading ? "Memverifikasi..." : "Verifikasi OTP"}
                    </button>
                </form>

                <div className="text-center mt-4">
                    <button
                        onClick={handleResend}
                        disabled={resendLoading}
                        className="text-blue-700 hover:underline text-sm"
                    >
                        {resendLoading ? "Mengirim ulang..." : "Kirim ulang OTP"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VerifyOtp;
