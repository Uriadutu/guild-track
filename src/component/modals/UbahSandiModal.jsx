import React, { useState } from "react";
import { updatePassword } from "firebase/auth";
import { auth } from "../../auth/Firebase";
import { AnimatePresence, motion } from "framer-motion";

const UbahSandiModal = ({ onClose }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleUpdatePassword = async () => {
    setMessage("");
    setError("");

    if (!newPassword || !confirmPassword) {
      setError("Masukkan kata sandi baru dan konfirmasi kata sandi.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Kata sandi tidak cocok.");
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        setError("Pengguna tidak ditemukan.");
        return;
      }

      await updatePassword(user, newPassword);
      setMessage("Kata sandi berhasil diperbarui.");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      if (err.code === "auth/requires-recent-login") {
        setError("Sesi login kedaluwarsa. Silakan login ulang.");
      } else {
        setError("Gagal memperbarui kata sandi.");
      }
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 px-2 flex items-center justify-center sm:items-start sm:pt-3 bg-black bg-opacity-60 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm relative"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-start justify-between p-4 border-b border-gray-200 rounded-t">
            <h3 className="text-lg font-semibold text-gray-700">Ubah Kata Sandi</h3>
            <button
              onClick={() => onClose(false)}
              type="button"
              className="inline-flex items-center justify-center w-8 h-8 text-sm text-gray-700 bg-transparent rounded-lg hover:bg-red-500 hover:text-gray-100 ms-auto transition duration-300"
            >
              ✕
            </button>
          </div>
          
          {error && <p className="text-sm text-red-500 mb-2">{error}</p>}
          {message && <p className="text-sm text-green-600 mb-2">{message}</p>}

          <input
            type="password"
            placeholder="Kata sandi baru"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 mb-3 focus:outline-none focus:ring focus:ring-green-300"
          />

          <input
            type="password"
            placeholder="Konfirmasi kata sandi"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring focus:ring-green-300"
          />

          <div className="flex justify-end space-x-2 py-4 border-t border-gray-200 rounded-b">
            <button
              onClick={() => onClose(false)}
              type="button"
              className="px-4 py-2 bg-gray-200 border border-gray-400 text-gray-700 text-sm rounded hover:bg-gray-100 transition duration-300"
            >
              Batal
            </button>
            <button
              onClick={handleUpdatePassword}
              className="bg-[#00D020] px-3 py-2 text-white font-semibold text-sm rounded hover:bg-[#3bdf54] transition duration-300"
            >
              Simpan
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UbahSandiModal;
