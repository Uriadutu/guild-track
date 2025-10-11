import React, { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  where,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db, auth } from "../auth/Firebase";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { AnimatePresence } from "framer-motion";
import AddTransaksiModal from "./modals/AddTransaksiModal";
import { toast } from "react-toastify";

const capitalizeWords = (str) => str?.replace(/\b\w/g, (c) => c.toUpperCase());

const Transaksi = () => {
  const [dataTransaksi, setDataTransaksi] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filter, setFilter] = useState("today");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [openAddModal, setOpenAddModal] = useState(false);
  const [totalProduk, setTotalProduk] = useState(0);
  const [totalPendapatan, setTotalPendapatan] = useState(0);

  const user = auth.currentUser;
  let globalIndex = 0;

  console.log(dataTransaksi);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "transaksi"),
      where("user", "==", user.uid),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const transaksiList = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
        };
      });
      setDataTransaksi(transaksiList);
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    const now = new Date();
    let result = [...dataTransaksi];

    if (filter === "today") {
      result = result.filter(
        (item) => item.createdAt.toDateString() === now.toDateString()
      );
    } else if (filter === "7days") {
      const last7 = new Date();
      last7.setDate(now.getDate() - 7);
      result = result.filter((item) => item.createdAt >= last7);
    } else if (filter === "1month") {
      const last30 = new Date();
      last30.setDate(now.getDate() - 30);
      result = result.filter((item) => item.createdAt >= last30);
    }

    if (selectedDate) {
      const selDate = new Date(selectedDate);
      result = result.filter(
        (item) => item.createdAt.toDateString() === selDate.toDateString()
      );
    }

    if (selectedMonth) {
      const [year, month] = selectedMonth.split("-").map(Number);
      result = result.filter(
        (item) =>
          item.createdAt.getMonth() + 1 === month &&
          item.createdAt.getFullYear() === year
      );
    }

    setFilteredData(result);

    let totalProdukTemp = 0;
    let totalPendapatanTemp = 0;

    result.forEach((trx) => {
      trx.items.forEach((item) => {
        totalProdukTemp += item.jumlah;
        totalPendapatanTemp += item.harga * item.jumlah;
      });
    });

    setTotalProduk(totalProdukTemp);
    setTotalPendapatan(totalPendapatanTemp);
  }, [filter, dataTransaksi, selectedDate, selectedMonth]);

  const handleDelete = async (id) => {
    try {
      if (window.confirm("Apakah Anda yakin ingin menghapus transaksi ini?")) {
        await deleteDoc(doc(db, "transaksi", id));
        toast.success("Transaksi berhasil dihapus!");
      }
    } catch (error) {
      toast.error("Gagal Menghapus Transaksi!");
    }
  };

  return (
    <div className="p-2">
      {/* Modal Tambah Transaksi */}
      <AnimatePresence>
        {openAddModal && (
          <AddTransaksiModal
            setIsOpenModalAdd={setOpenAddModal}
            getData={() => {}}
            user={user}
          />
        )}
      </AnimatePresence>

      <div className="bg-white w-full rounded shadow-lg">
        <header className="border-b px-6 py-5 bg-gray-50">
          <h1 className="text-2xl font-bold text-gray-800">Data Transaksi</h1>
        </header>
        <div className="px-3 py-4">
          <button className="btn-add" onClick={() => setOpenAddModal(true)}>
            + Tambah Transaksi
          </button>

          {/* Filter */}
          <div className="grid grid-cols-1 mt-2 sm:grid-cols-2 md:grid-cols-4 gap-4 pb-4">
            {/* Filter */}
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1 text-gray-700">
                Rentang Waktu
              </label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 p-2 w-full rounded-lg bg-white text-sm"
              >
                <option value="all">Semua</option>
                <option value="today">Hari Ini</option>
                <option value="7days">7 Hari Terakhir</option>
                <option value="1month">1 Bulan Terakhir</option>
              </select>
            </div>

            {/* Wrapper untuk Tanggal & Bulan */}
            <div className="flex gap-4 w-full">
              {/* Pilih Tanggal */}
              <div className="flex flex-col w-full">
                <label className="text-sm font-medium mb-1 text-gray-700">
                  Pilih Tanggal
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setFilter("all");
                  }}
                  className="border border-gray-300 p-2 rounded-lg bg-white text-sm"
                />
              </div>

              {/* Pilih Bulan */}
              <div className="flex flex-col w-full">
                <label className="text-sm font-medium mb-1 text-gray-700">
                  Pilih Bulan
                </label>
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => {
                    setSelectedMonth(e.target.value);
                    setFilter("all");
                  }}
                  className="border border-gray-300 p-2 rounded-lg bg-white text-sm"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4 px-2">
            <div className="text-sm sm:text-base font-semibold text-gray-700">
              Total Produk Terjual:{" "}
              <span className="text-blue-600" translate="no">{totalProduk}</span>
            </div>
            <div className="text-sm sm:text-base font-semibold text-gray-700">
              Total Pendapatan:{" "}
              <span className="text-green-600" translate="no">
                Rp {totalPendapatan.toLocaleString("id-ID")}
              </span>
            </div>
          </div>

          <div className="w-full max-w-full overflow-x-auto">
            <div className="sm:w-auto w-3">
              <table className="min-w-full text-sm text-gray-700">
                <thead className="bg-gray-100">
                  <tr>
                    <th
                      className="text-left px-6 py-3 border-b whitespace-nowrap break-words"
                      translate="no"
                    >
                      No
                    </th>
                    <th className="text-left px-6 py-3 border-b whitespace-nowrap break-words">
                      Tanggal - Jam
                    </th>
                    <th className="text-left px-6 py-3 border-b whitespace-nowrap break-words">
                      Nama Produk
                    </th>
                    <th className="text-left px-6 py-3 border-b whitespace-nowrap break-words">
                      Harga Produk
                    </th>
                    <th className="text-left px-6 py-3 border-b whitespace-nowrap break-words">
                      Jumlah
                    </th>
                    <th className="text-left px-6 py-3 border-b whitespace-nowrap break-words">
                      Total
                    </th>
                    <th className="text-left px-6 py-3 border-b whitespace-nowrap break-words">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length > 0 ? (
                    filteredData.flatMap((trx) =>
                      trx.items.map((item, itemIndex) => {
                        globalIndex++;
                        return (
                          <tr
                            key={`${trx.id}-${itemIndex}`}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-3 border-b whitespace-nowrap break-words">
                              {globalIndex}
                            </td>
                            <td className="px-6 py-3 border-b whitespace-nowrap break-words">
                              {trx.createdAt
                                ? format(
                                    trx.createdAt,
                                    "dd MMMM yyyy - HH:mm",
                                    {
                                      locale: id,
                                    }
                                  )
                                : "-"}
                            </td>
                            <td className="px-6 py-3 border-b whitespace-nowrap break-words">
                              {capitalizeWords(item.namaProduk)}
                            </td>
                            <td className="px-6 py-3 border-b text-green-600 font-medium whitespace-nowrap break-words">
                              Rp {Number(item.harga).toLocaleString("id-ID")}
                            </td>
                            <td className="px-6 py-3 border-b whitespace-nowrap break-words">
                              {item.jumlah}
                            </td>
                            <td className="px-6 py-3 border-b text-green-700 font-semibold whitespace-nowrap break-words">
                              Rp{" "}
                              {(item.harga * item.jumlah).toLocaleString(
                                "id-ID"
                              )}
                            </td>
                            <td className="px-6 py-3 border-b whitespace-nowrap break-words">
                              <button
                                className="text-red-500 hover:underline"
                                onClick={() => handleDelete(trx.id)}
                              >
                                Hapus
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        className="text-center text-gray-500 px-6 py-6 whitespace-nowrap break-words"
                      >
                        Tidak ada data transaksi
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Tabel Data */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transaksi;
