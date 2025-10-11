import React, { useState } from "react";
import { db } from "../../auth/Firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const AddTanggalModal = ({ setIsOpenModalAdd, getTanggal }) => {
  const [loading, setLoading] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const [tanggal, setTanggal] = useState(today);

  const handleTambahTanggal = async (e) => {
    e.preventDefault();

    if (!tanggal.trim()) {
      toast.warning("Tanggal tidak boleh kosong!");
      return;
    }

    setLoading(true);

    try {
      // 🔹 Cek apakah tanggal sudah ada di Firestore
      const q = query(
        collection(db, "tanggal"),
        where("tanggal", "==", tanggal)
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        toast.error("Tanggal tersebut sudah ada!");
        setLoading(false);
        return;
      }

      // 🔹 Jika belum ada, tambahkan tanggal baru
      await addDoc(collection(db, "tanggal"), {
        tanggal,
        createdAt: new Date(),
      });

      toast.success("Tanggal berhasil ditambahkan!");
      setTanggal("");
      setIsOpenModalAdd(false);

      // Refresh data di halaman utama
      if (getTanggal) getTanggal();
    } catch (error) {
      console.error("Error menambahkan tanggal:", error);
      toast.error("Gagal menambahkan tanggal.");
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 px-2 flex items-center sm:items-start sm:pt-3 justify-center bg-black z-40 bg-opacity-60">
      <form onSubmit={handleTambahTanggal}>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-lg bg-white rounded-lg shadow-lg"
        >
          {/* Header */}
          <div className="flex items-start justify-between p-4 border-b border-gray-200 rounded-t">
            <h3 className="text-xl font-semibold text-gray-700">
              Tambah Tanggal
            </h3>
            <button
              onClick={() => setIsOpenModalAdd(false)}
              type="button"
              className="inline-flex items-center justify-center w-8 h-8 text-sm text-gray-700 bg-transparent rounded-lg hover:bg-red-500 hover:text-white transition duration-300"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-4 text-gray-700">
            <div className="grid gap-4">
              <div className="grid grid-cols-2 items-center gap-4">
                <label className="text-sm font-medium">Tanggal</label>
                <input
                  type="date"
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end p-4 space-x-3 border-t border-gray-200 rounded-b">
            <button
              type="button"
              onClick={() => setIsOpenModalAdd(false)}
              className="px-4 py-2 bg-gray-200 border border-gray-400 text-gray-500 text-sm rounded hover:bg-gray-100 transition duration-300"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#be1414] px-3 py-2 text-white font-semibold text-sm rounded hover:bg-[#e11717] transition duration-300"
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </motion.div>
      </form>
    </div>
  );
};

export default AddTanggalModal;
