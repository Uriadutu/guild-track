// Tidak ada perubahan import
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { db } from "../../auth/Firebase";
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  Timestamp,
} from "firebase/firestore";

import { toast } from "react-toastify"; // atau 'react-toastify'

const AddTransaksiModal = ({ setIsOpenModalAdd, getData, user }) => {
  const [produkList, setProdukList] = useState([]);
  const [transaksiItems, setTransaksiItems] = useState([
    { produkId: "", harga: 0, jumlah: 1 },
  ]);

  const handleRemoveItem = (index) => {
    const updatedItems = transaksiItems.filter((_, i) => i !== index);
    setTransaksiItems(updatedItems);
  };

  useEffect(() => {
    const fetchProduk = async () => {
      if (!user?.uid) return; // Jaga-jaga kalau user belum tersedia

      const q = query(collection(db, "produk"), where("uid", "==", user.uid));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProdukList(data);
    };

    fetchProduk();
  }, []);

  const handleChangeProduk = (index, idProduk) => {
    const produk = produkList.find((p) => p.id === idProduk);
    const updatedItems = [...transaksiItems];
    updatedItems[index].produkId = idProduk;
    updatedItems[index].harga = produk ? produk.harga : 0;
    setTransaksiItems(updatedItems);
  };

  const handleChangeJumlah = (index, jumlah) => {
    const updatedItems = [...transaksiItems];
    updatedItems[index].jumlah = parseInt(jumlah);
    setTransaksiItems(updatedItems);
  };

  const handleAddItem = () => {
    setTransaksiItems([
      ...transaksiItems,
      { produkId: "", harga: 0, jumlah: 1 },
    ]);
  };

  const handleSubmit = async () => {
    const isInvalid = transaksiItems.some(
      (item) => item.produkId === "" || item.jumlah < 1
    );

    if (isInvalid) {
      toast.error("Pastikan semua data telah diisi.");
      return;
    }

    try {
      // Tambahkan namaProduk ke setiap item
      const itemsWithNama = transaksiItems.map((item) => {
        const produk = produkList.find((p) => p.id === item.produkId);
        return {
          ...item,
          namaProduk: produk ? produk.nama : "Tidak diketahui",
        };
      });

      const transaksiBaru = {
        items: itemsWithNama,
        createdAt: Timestamp.now(),
        user: user.uid,
      };

      await addDoc(collection(db, "transaksi"), transaksiBaru);
      toast.success("Transaksi berhasil ditambahkan!");

      try {
        setIsOpenModalAdd(false);
        getData(); // Pastikan getData tidak error
      } catch (error) {
        console.error("Gagal setelah addDoc:", error);
        toast.error(
          "Data ditambahkan tapi terjadi kesalahan saat memperbarui UI."
        );
      }
    } catch (error) {
      console.error("Gagal menambah transaksi:", error);
      toast.error("Gagal menambah transaksi.");
    }
  };

  const getAvailableProduk = (currentIndex) => {
    const selectedIds = transaksiItems
      .filter((_, i) => i !== currentIndex)
      .map((item) => item.produkId);

    return produkList.filter((produk) => !selectedIds.includes(produk.id));
  };

  return (
    <motion.div
      className="fixed top-0 left-0 w-full h-full bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
      >
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Tambah Transaksi
        </h2>

        {transaksiItems.map((item, index) => (
          <div
            key={index}
            className="mb-4 border border-gray-200 rounded-lg p-4 relative shadow-sm bg-gray-50"
          >
            <button
              onClick={() => handleRemoveItem(index)}
              className="absolute top-2 right-2 text-red-500 hover:bg-red-100 p-1 rounded-full transition"
              title="Hapus Baris"
            >
              ✕
            </button>

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Produk
            </label>
            <select
              value={item.produkId}
              onChange={(e) => handleChangeProduk(index, e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white mb-3"
            >
              <option value="">-- Pilih Produk --</option>
              {getAvailableProduk(index).map((produk) => (
                <option key={produk.id} value={produk.id}>
                  {produk.nama}
                </option>
              ))}
            </select>

            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Harga
                </label>
                <input
                  type="number"
                  value={item.harga}
                  disabled
                  className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 text-sm"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jumlah
                </label>
                <input
                  type="number"
                  min="1"
                  value={item.jumlah}
                  onChange={(e) => handleChangeJumlah(index, e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={handleAddItem}
          className="text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-2 rounded-md transition mb-6"
        >
          + Tambah Produk
        </button>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => setIsOpenModalAdd(false)}
            className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Simpan
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AddTransaksiModal;
