import React, { useState } from "react";
import { db } from "../../auth/Firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const AddMemberModal = ({ setIsOpenModalAdd, getProduk }) => {
  const [idMember, setIdMember] = useState("");
  const [namaMember, setNamaMember] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTambahMember = async (e) => {
    e.preventDefault();

    if (!idMember.trim() || !namaMember.trim()) {
      toast.warning("ID Member dan Nama Member tidak boleh kosong!");
      return;
    }

    setLoading(true);

    try {
      // 🔹 Cek apakah ID sudah terdaftar
      const q = query(collection(db, "member"), where("id", "==", idMember));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        toast.error("ID Member sudah terdaftar!");
        setLoading(false);
        return;
      }

      // 🔹 Tambahkan member baru (tanpa UID)
      await addDoc(collection(db, "member"), {
        id: idMember,
        nama: namaMember,
        createdAt: new Date(),
      });

      getProduk();
      toast.success("Member berhasil ditambahkan!");
      setIdMember("");
      setNamaMember("");
      setIsOpenModalAdd(false);
    } catch (error) {
      console.error("Error menambahkan member:", error);
      toast.error("Gagal menambahkan member.");
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 px-2 flex items-center sm:items-start sm:pt-3 justify-center bg-black z-40 bg-opacity-60">
      <form onSubmit={handleTambahMember}>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-lg bg-white rounded-lg shadow-lg"
        >
          <div className="flex items-start justify-between p-4 border-b border-gray-200 rounded-t">
            <h3 className="text-xl font-semibold text-gray-700">
              Tambah Member
            </h3>
            <button
              onClick={() => setIsOpenModalAdd(false)}
              type="button"
              className="inline-flex items-center justify-center w-8 h-8 text-sm text-gray-700 bg-transparent rounded-lg hover:bg-red-500 hover:text-white transition duration-300"
            >
              ✕
            </button>
          </div>

          <div className="p-4 space-y-4 text-gray-700">
            <div className="grid gap-4">
              <div className="grid grid-cols-2 items-center gap-4">
                <label className="text-sm font-medium">ID Member</label>
                <input
                  type="number"
                  value={idMember}
                  onChange={(e) => setIdMember(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="ID Member"
                />
              </div>

              <div className="grid grid-cols-2 items-center gap-4">
                <label className="text-sm font-medium">Nama Member</label>
                <input
                  type="text"
                  value={namaMember}
                  onChange={(e) => setNamaMember(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Nama Member"
                />
              </div>
            </div>
          </div>

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

export default AddMemberModal;
