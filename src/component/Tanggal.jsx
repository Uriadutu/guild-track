import React, { useEffect, useState } from "react";
import { db } from "../auth/Firebase";
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  query,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { AnimatePresence } from "framer-motion";
import { IoSearch } from "react-icons/io5";
import { toast } from "react-toastify";
import AddTanggalModal from "./modals/AddTanggalModal";
import { parseAndFormatDateString } from "../utils/helper";
import { useNavigate } from "react-router-dom";

const Tanggal = () => {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [dataTanggal, setDataTanggal] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [scoreTotals, setScoreTotals] = useState({}); // 🔹 total score per tanggal
  const [fetching, setFetching] = useState(true);

  const navigate = useNavigate();

  // 🔹 Ambil data tanggal (real-time)
  const getTanggal = () => {
    setFetching(true);
    try {
      const q = query(collection(db, "tanggal"), orderBy("createdAt", "desc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const tanggalList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDataTanggal(tanggalList);
      });

      return unsubscribe;
    } catch (error) {
      console.error("Gagal mengambil data tanggal:", error);
      toast.error("Gagal mengambil data tanggal.");
    } finally {
      setFetching(false);
    }
  };

  

  // 🔹 Ambil semua total score dari koleksi "score"
  const getScoreTotals = async () => {
    setFetching(true)
    try {
      const scoreSnapshot = await getDocs(collection(db, "score"));
      const totals = {};

      scoreSnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (!totals[data.tanggal]) totals[data.tanggal] = 0;
        totals[data.tanggal] += Number(data.score) || 0;
      });

      setScoreTotals(totals);
    } catch (error) {
      console.error("Gagal mengambil total score:", error);
    } finally {
      setFetching(false)
    }
  };

  useEffect(() => {
    const unsubscribe = getTanggal();
    getScoreTotals(); // 🔹 panggil sekali saat load

    return () => unsubscribe && unsubscribe();
  }, []);

  // 🔹 Hapus tanggal
  const handleDelete = async (id) => {
    if (!id) {
      toast.error("ID tanggal tidak ditemukan.");
      return;
    }

    const konfirmasi = window.confirm(
      "Apakah Anda yakin ingin menghapus tanggal ini?"
    );
    if (!konfirmasi) return;

    try {
      await deleteDoc(doc(db, "tanggal", id));
      toast.success("Tanggal berhasil dihapus!");
      getScoreTotals(); // refresh total score
    } catch (error) {
      toast.error("Gagal menghapus tanggal.");
    }
  };

  // 🔹 Filter pencarian
  const filteredData = dataTanggal.filter((t) =>
    t.tanggal.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (fetching) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center  text-gray-600 z-50">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-gray-400 mb-3"></div>
        <p className="text-sm font-semibold tracking-wide">
          Memuat data, harap tunggu sebentar...
        </p>
      </div>
    );
  }
  return (
    <div className="p-2">
      <AnimatePresence>
        {openAddModal && (
          <AddTanggalModal
            setIsOpenModalAdd={setOpenAddModal}
            getTanggal={getTanggal}
          />
        )}
      </AnimatePresence>

      <div className="bg-white rounded shadow-lg w-full overflow-hidden">
        <header className="border-b px-6 py-5 bg-gray-50">
          <h1 className="text-2xl font-bold text-gray-800">Data Tanggal</h1>
        </header>

        <div className="px-3 py-4">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => setOpenAddModal(true)}
              className="btn-add"
              translate="no"
            >
              Tambah Tanggal
            </button>

            <div className="flex p-2 border rounded border-gray-200 items-center">
              <input
                type="text"
                placeholder="Cari Tanggal..."
                className="text-sm outline-0 w-32 sm:w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <IoSearch color="silver" />
            </div>
          </div>

          {/* 🔹 Scrollable table wrapper */}
          <div className="w-full overflow-x-auto">
            <div className="sm:w-auto w-10">
              <table className="min-w-full text-sm text-gray-700">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-4 py-2 text-left whitespace-nowrap">
                      No
                    </th>
                    <th className="border px-4 py-2 text-left whitespace-nowrap">
                      Tanggal
                    </th>
                    <th className="border px-4 py-2 text-left whitespace-nowrap">
                      Total Score
                    </th>
                    <th className="border px-4 py-2 text-left whitespace-nowrap w-[150px]">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length > 0 ? (
                    filteredData.map((t, index) => (
                      <tr key={t.id} className="hover:bg-gray-50">
                        <td className="border px-4 py-2">{index + 1}</td>
                        <td
                          className="border px-4 py-2 text-blue-600 underline cursor-pointer font-medium whitespace-nowrap"
                          onClick={() => navigate(`${t.tanggal}/score`)}
                        >
                          {parseAndFormatDateString(t.tanggal)}
                        </td>
                        <td className="border px-4 py-2">
                          {scoreTotals[t.tanggal] ?? 0}
                        </td>
                        <td className="border px-4 py-2 space-x-3 whitespace-nowrap">
                          <button
                            onClick={() => handleDelete(t.id)}
                            className="text-red-500 hover:underline"
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="border px-4 py-4 text-center text-gray-500"
                      >
                        Tidak ada data tanggal
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tanggal;
