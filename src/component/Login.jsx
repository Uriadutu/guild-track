import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../auth/Firebase";
import Logo from "../img/sp.png";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setResetMessage("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        setError("Pengguna tidak ditemukan.");
      } else if (err.code === "auth/wrong-password") {
        setError("Kata sandi salah.");
      } else if (err.code === "auth/invalid-email") {
        setError("Pengguna Tidak Ditemukan");
      } else {
        setError("Gagal Masuk! Periksa nama pengguna dan kata sandi Anda.");
      }
    }
  };


  return (
    <div className="relative bg-white w-full h-screen flex items-center justify-center px-4">
      <div className="absolute w-[300px] h-[200px] bg-red-300 opacity-30 blur-3xl rounded-full top-5 left-5 md:w-[400px] md:h-[250px] md:left-32"></div>
      <div className="absolute w-[350px] h-[220px] bg-purple-300 opacity-30 blur-3xl rounded-full bottom-5 right-5 md:w-[500px] md:h-[300px] md:right-32"></div>

      <div className="w-full max-w-md relative z-10 ">
        <div className="bg-white p-4 shadow-md rounded-[2px]">
          <form
            className="px-1 sm:px-6 pt-6 pb-1 w-full mx-auto"
            onSubmit={handleLogin}
          >
            {/* Logo & Judul */}
            <div className="flex flex-col w-full items-center">
              <img src={Logo} alt="Logo" className="w-24 sm:w-28 mb-2" />
              <div className="relative w-full z-10 mb-3">
                <div className="text-gray-800 text-center z-10 absolute flex w-full justify-center font-semibold text-2xl">
                  <p className="bg-white px-3 sm:text-2xl text-lg">Masuk</p>
                </div>
                <div className="absolute top-4 sm:top-5 z-0 w-full">
                  <div className="border-b border-gray-400 w-full"></div>
                </div>
              </div>
            </div>

            {/* Pesan Error & Reset */}
            <div className="mt-10">
              {error && (
                <p className="text-red-600 z-1 border border-red-400 bg-red-100 rounded-[2px] text-sm p-2 my-2 text-center">
                  {error}
                </p>
              )}
              {resetMessage && (
                <p className="text-red-600 border border-red-400 bg-red-100 rounded-[2px] text-sm p-2 my-2 text-center">
                  {resetMessage}
                </p>
              )}
            </div>

            {/* Input Email */}
            <div className="mt-10">
              <input
                type="email"
                className="w-full p-3 rounded-[2px] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-700 mt-1"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Input Password */}
            <div className="mt-3">
              <input
                type="password"
                className="w-full p-3 rounded-[2px] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-700 mt-1"
                placeholder="Kata Sandi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Tombol Aksi */}
            <div className="mt-6 flex flex-col space-y-3">
              <button
                type="submit"
                className="w-full p-3 bg-red-500 text-white rounded-[2px] hover:bg-red-600 transition"
              >
                Masuk
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white p-4 mt-3 shadow-md w-full max-w-2xl rounded-[2px] text-center">
          <p className="text-gray-700 text-sm">
            Belum Mempunyai Akun?{" "}
            <Link
              to={"/"}
              className="text-red-500 font-medium hover:underline"
            >
              Kembali
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
