// Splash.tsx (Versi Profesional)
import React from "react";
import foto from "../../img/logoFF.png";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

const Splash = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center px-1 py-10 relative overflow-hidden">
      {/* Blur Background */}
      <div className="absolute w-72 h-72 bg-red-300 opacity-20 blur-2xl rounded-full top-0 left-0 -z-10" />
      <div className="absolute w-72 h-72 bg-purple-300 opacity-20 blur-2xl rounded-full bottom-0 right-0 -z-10" />

      {/* Konten Utama */}
      <div className="flex flex-col md:flex-row items-center justify-center px-6 py-10 gap-8">
        {/* Gambar */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full md:w-1/2 flex justify-center"
        >
          <img
            src={foto}
            alt="Greyy
"
            className="w-[70%] max-w-xs sm:max-w-sm md:max-w-md"
          />
        </motion.div>

        {/* Teks dan Tombol */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center md:text-left md:w-1/2"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-900 leading-snug mb-4">
            Pantau Guild Point dengan {" "}
            <span className="text-red-500" translate="no">
              GuildTrack
            </span>
          </h1>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg mb-6">
            Catat hasil pertandingan Guild War dan pantau perkembangan poin
            guild Anda setiap minggu dengan mudah.
          </p>

          {/* Keunggulan */}
          <div className="flex sm:justify-start justify-center">
            <ul className="text-sm text-gray-700 space-y-2 mb-6">
              <li className="flex items-center gap-2">
                <FaCheckCircle className="text-red-500" /> Pencatatan Mudah
              </li>
              <li className="flex items-center gap-2">
                <FaCheckCircle className="text-red-500" /> Pemantauan Mudah
              </li>
              <li className="flex items-center gap-2">
                <FaCheckCircle className="text-red-500" /> Aman dan Terpercaya
              </li>
            </ul>
          </div>

          {/* Tombol */}
          <div className="flex flex-col sm:flex-row gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded text-base shadow-lg"
              onClick={() => navigate("/score")}
            >
              Lihat Score
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border border-red-700 bg-white text-red-700 px-6 py-3 rounded hover:bg-gray-100 transition"
              onClick={() => navigate("/masuk")}
            >
              Masuk
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Splash;
