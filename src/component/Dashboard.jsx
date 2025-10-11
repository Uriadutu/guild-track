import React, { useEffect, useState } from "react";
import { db } from "../auth/Firebase";
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import AddMemberModal from "./modals/AddMemberModal";
import { AnimatePresence } from "framer-motion";
import { IoSearch } from "react-icons/io5";
import { toast } from "react-toastify";
import EditMemberModal from "./modals/EditMemberModal";

const Dashboard = () => {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [dataMember, setDataMember] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [fetching, setFetching] = useState(true);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  // 🔹 Ambil semua member (real-time)
  const getMember = () => {
    setFetching(true);
    try {
      const q = query(collection(db, "member"), orderBy("createdAt", "desc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const memberList = snapshot.docs.map((d) => ({
          docId: d.id, // ini ID dokumen Firestore
          ...d.data(), // ini data di dalam dokumen
        }));
        setDataMember(memberList);
      });

      return unsubscribe;
    } catch (error) {
      console.error("Gagal mengambil data member:", error);
      toast.error("Gagal mengambil data member.");
      setFetching(false);
    } finally {
      setFetching(false);
    }
  };

  const handleEditClick = (member) => {
    setSelectedMember(member);
    setIsOpenEdit(true);
  };

  useEffect(() => {
    const unsubscribe = getMember();
    return () => unsubscribe && unsubscribe();
  }, []);

  // 🔹 Hapus data member
  const handleDelete = async (docId) => {
    if (!docId) {
      toast.error("ID dokumen tidak ditemukan.");
      return;
    }

    const konfirmasi = window.confirm(
      "Apakah Anda yakin ingin menghapus member ini?"
    );
    if (!konfirmasi) return;

    try {
      await deleteDoc(doc(db, "member", docId));
      toast.success("Member berhasil dihapus!");
    } catch (error) {
      console.error("Gagal menghapus member:", error);
      toast.error("Terjadi kesalahan saat menghapus Member.");
    }
  };

  // 🔹 Filter pencarian (berdasarkan nama atau ID Member)
  const filteredData = dataMember.filter(
    (member) =>
      member.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // render modal

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
          <AddMemberModal
            setIsOpenModalAdd={setOpenAddModal}
            getProduk={getMember}
          />
        )}
        {isOpenEdit && (
          <EditMemberModal
            setIsOpenModalEdit={setIsOpenEdit}
            getProduk={getMember} // refresh list
            member={selectedMember}
          />
        )}
      </AnimatePresence>

      <div className="bg-white rounded shadow-lg">
        <header className="border-b px-6 py-5 bg-gray-50">
          <h1 className="text-2xl font-bold text-gray-800">Data Member</h1>
        </header>

        <div className="px-3 py-4">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => setOpenAddModal(true)}
              className="btn-add"
              translate="no"
            >
              Tambah
            </button>

            <div className="flex p-2 border rounded border-gray-200 items-center">
              <input
                type="text"
                placeholder="Cari Nama atau ID..."
                className="text-sm outline-0 w-32 sm:w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <IoSearch color="silver" />
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            <div className="w-auto">
              <table className="min-w-full text-sm text-gray-700">
                <thead className="bg-gray-100">
                  <tr className="text-left">
                    <th className="border px-4 py-2">No</th>
                    <th className="border px-4 py-2 whitespace-nowrap">ID</th>
                    <th className="border px-4 py-2 whitespace-nowrap">
                      Nickname
                    </th>
                    <th className="border px-4 py-2 whitespace-nowrap">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length > 0 ? (
                    filteredData.map((member, index) => (
                      <tr key={member.docId} className="hover:bg-gray-100">
                        <td className="border px-4 py-2">{index + 1}</td>
                        <td className="border px-4 py-2 text-blue-600 font-medium whitespace-nowrap">
                          {member.id}
                        </td>
                        <td className="border px-4 py-2">{member.nama} MWL</td>
                        <td className="border px-4 py-2 space-x-3 whitespace-nowrap">
                          <button
                            onClick={() => handleDelete(member.docId)}
                            className="text-red-500 hover:underline"
                          >
                            Hapus
                          </button>
                          <button
                            onClick={() => handleEditClick(member)}
                            className="text-red-500 hover:underline"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="border px-4 py-2 text-center text-gray-500"
                      >
                        Tidak ada data member
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

export default Dashboard;
