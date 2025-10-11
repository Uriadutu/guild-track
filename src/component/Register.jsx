import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../auth/Firebase";
import Logo from "../img/sp.png";

const Register = () => {
  const navigate = useNavigate();
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!nama || !email || !password || !confirmPassword) {
      setError("Semua field wajib diisi.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(userCredential.user, { displayName: nama });
      navigate("/masuk");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("Email sudah digunakan.");
      } else if (err.code === "auth/invalid-email") {
        setError("Email tidak valid.");
      } else if (err.code === "auth/weak-password") {
        setError("Kata sandi terlalu lemah (minimal 6 karakter).");
      } else {
        setError("Gagal mendaftar. Silakan coba lagi.");
      }
    }
  };

  return (
    <div className="py-3 ">
        <div className="absolute w-[300px] h-[200px] bg-green-300 opacity-30 blur-3xl rounded-full top-5 left-5 md:w-[400px] md:h-[250px] md:left-32"></div>
        <div className="absolute w-[350px] h-[220px] bg-purple-300 opacity-30 blur-3xl rounded-full bottom-5 right-5 md:w-[500px] md:h-[300px] md:right-32"></div>
      <div className="relative w-full h-screen flex items-center justify-center p-4 py-20">

        <div className="w-full max-w-md relative z-10">
          <div className="bg-white p-4 shadow-md rounded-[2px]">
            <form
              className="px-1 sm:px-6 pt-6 pb-6 w-full mx-auto"
              onSubmit={handleRegister}
            >
              <div className="flex flex-col w-full items-center">
                <img src={Logo} alt="Logo" className="w-24 sm:w-28 mb-2" />
                <div className="relative w-full z-10 mb-3">
                  <div className="text-gray-800 text-center z-10 absolute flex w-full justify-center font-semibold text-2xl">
                    <p className="bg-white px-3 sm:text-2xl text-lg">Daftar</p>
                  </div>
                  <div className="absolute top-4 sm:top-5 z-0 w-full">
                    <div className="border-b border-gray-400 w-full"></div>
                  </div>
                </div>
              </div>

              {error && (
                <p className="text-red-600 border mt-10 border-red-400 bg-red-100 rounded-[2px] text-sm p-2 my-2 text-center">
                  {error}
                </p>
              )}

              <div className="mt-6">
                <input
                  type="text"
                  className="w-full p-3 rounded-[2px] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700 mt-1"
                  placeholder="Nama Lengkap"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                />
              </div>

              <div className="mt-3">
                <input
                  type="email"
                  className="w-full p-3 rounded-[2px] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700 mt-1"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="mt-3">
                <input
                  type="password"
                  className="w-full p-3 rounded-[2px] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700 mt-1"
                  placeholder="Kata Sandi"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="mt-3">
                <input
                  type="password"
                  className="w-full p-3 rounded-[2px] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700 mt-1"
                  placeholder="Konfirmasi Kata Sandi"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <div className="mt-6 flex flex-col space-y-3">
                <button
                  type="submit"
                  className="w-full p-3 bg-green-500 text-white rounded-[2px] hover:bg-green-600 transition"
                >
                  Daftar
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white p-4 mt-3 shadow-md w-full max-w-2xl rounded-[2px] text-center">
            <p className="text-center text-sm text-gray-700">
              Sudah punya akun?{" "}
              <Link
                to="/masuk"
                className="text-green-500 hover:underline font-medium"
              >
                Masuk
              </Link>
            </p>
          </div>

          {/* Tombol Kembali ke Halaman Utama */}
          <div className="bg-white p-4 mt-3 shadow-md w-full max-w-2xl rounded-[2px] text-center">
            <Link
              to="/"
              className="text-sm text-blue-500 hover:underline font-medium"
            >
              Kembali ke Halaman Utama
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
