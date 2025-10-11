import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { db } from "../auth/Firebase";
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { IoSearch } from "react-icons/io5";
import { useParams } from "react-router-dom";
import { parseAndFormatDateString } from "../utils/helper";
import { useReactToPrint } from "react-to-print";

const ScoreMember = () => {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [editedScores, setEditedScores] = useState({});
  const [loading, setLoading] = useState(false);
  const [scoresMap, setScoresMap] = useState({});
  const [fetching, setFetching] = useState(true);
  const [totalScore, setTotalScore] = useState(0);

  const { tanggal } = useParams();
  const selectedDate = tanggal || new Date().toISOString().split("T")[0];

  // Ref untuk print PDF
  const printRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Score_${selectedDate}`,
  });

  // Fetch member + score
  const getMembersWithScores = useCallback(async () => {
    setFetching(true);
    try {
      const [memberSnapshot, scoreSnapshot] = await Promise.all([
        getDocs(collection(db, "member")),
        getDocs(query(collection(db, "score"), where("tanggal", "==", selectedDate))),
      ]);

      const memberData = memberSnapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      const scoreMap = {};
      scoreSnapshot.docs.forEach((docSnap) => {
        const data = docSnap.data();
        scoreMap[data.idMember] = { id: docSnap.id, score: data.score };
      });

      setMembers(memberData);
      setScoresMap(scoreMap);

      const total = Object.values(scoreMap).reduce(
        (sum, item) => sum + Number(item.score || 0),
        0
      );
      setTotalScore(total);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Gagal mengambil data member.");
    } finally {
      setFetching(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    getMembersWithScores();
  }, [getMembersWithScores]);

  const filteredMembers = useMemo(() => {
    const lowerSearch = search.toLowerCase();
    return members.filter(
      (m) =>
        m.nama?.toLowerCase().includes(lowerSearch) ||
        m.id?.toString().toLowerCase().includes(lowerSearch)
    );
  }, [members, search]);

  const handleScoreChange = useCallback((id, value) => {
    setEditedScores((prev) => ({ ...prev, [id]: value }));
  }, []);

  const handleSaveScore = useCallback(
    async (idMember) => {
      const score = Number(editedScores[idMember] || 0);
      const tanggal = selectedDate;
      setLoading(true);

      try {
        if (!scoresMap[idMember]) {
          const newDoc = await addDoc(collection(db, "score"), {
            idMember,
            tanggal,
            score,
            createdAt: new Date(),
          });
          setScoresMap((prev) => ({
            ...prev,
            [idMember]: { id: newDoc.id, score },
          }));
        } else {
          const docRef = doc(db, "score", scoresMap[idMember].id);
          await updateDoc(docRef, { score });
          setScoresMap((prev) => ({
            ...prev,
            [idMember]: { ...prev[idMember], score },
          }));
        }

        toast.success("Score berhasil disimpan!");
        setEditedScores((prev) => ({
          ...prev,
          [idMember]: undefined,
        }));

        setTotalScore((prev) => {
          const oldScore = scoresMap[idMember]?.score ?? 0;
          const diff = score - oldScore;
          return prev + diff;
        });
      } catch (error) {
        console.error("Error saving score:", error);
        toast.error("Gagal menyimpan score.");
      } finally {
        setLoading(false);
      }
    },
    [scoresMap, editedScores, selectedDate]
  );

  if (fetching) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center text-gray-600 z-50">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-gray-400 mb-3"></div>
        <p className="text-sm font-semibold tracking-wide">
          Memuat data, harap tunggu sebentar...
        </p>
      </div>
    );
  }

  // Hitung Top 4 Score
  const top4 = members
    .map((m) => ({ ...m, score: scoresMap[m.id]?.score ?? 0 }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  return (
    <div className="p-2">
      {/* ===================== HALAMAN WEB ===================== */}
      <div className="bg-white rounded shadow-lg w-full overflow-hidden">
        <header className="border-b px-6 py-5 bg-gray-50 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Score {parseAndFormatDateString(selectedDate)}
          </h1>
        </header>

        <div className="px-3 py-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
             
              <button
                onClick={handlePrint}
                className="btn-add"
              >
                Export PDF
              </button>
            </div>
            <div className="flex p-2 border rounded border-gray-200 items-center">
              <input
                type="text"
                placeholder="Cari Nama atau ID..."
                className="text-sm outline-0 w-32 sm:w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <IoSearch color="silver" />
            </div>
          </div>

          <div className="mt-4 text-left font-semibold text-gray-700 bg-gray-100 rounded-t inline-block p-2">
            Total Score: <span className="text-red-600">{totalScore}</span>
          </div>

          {filteredMembers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-500">
              <p className="text-lg font-medium">Data Tidak Ada</p>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <div className="sm:w-auto w-10">
                <table className="min-w-full text-sm text-gray-700">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-4 py-2">No</th>
                      <th className="border px-4 py-2">ID</th>
                      <th className="border px-4 py-2">Nickname</th>
                      <th className="border px-4 py-2">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMembers.map((member, index) => {
                      const currentScore = editedScores[member.id] ?? scoresMap[member.id]?.score ?? 0;
                      return (
                        <tr key={member.id} className="hover:bg-gray-50">
                          <td className="border px-4 py-2 text-center">{index + 1}</td>
                          <td className="border px-4 py-2 whitespace-nowrap">{member.id}</td>
                          <td className="border px-4 py-2 whitespace-nowrap">{member.nama}</td>
                          <td className="border px-4 py-2 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={currentScore}
                                onFocus={(e) => { if(e.target.value === "0") e.target.value = ""; }}
                                onChange={(e) => handleScoreChange(member.id, e.target.value)}
                                onBlur={(e) => {
                                  if (e.target.value === "") {
                                    const oldScore = scoresMap[member.id]?.score ?? 0;
                                    e.target.value = oldScore;
                                    handleScoreChange(member.id, oldScore);
                                  }
                                }}
                                className="w-24 px-2 py-1 border border-gray-300 rounded text-right"
                              />
                              {editedScores[member.id] !== undefined &&
                                Number(editedScores[member.id]) !== Number(scoresMap[member.id]?.score ?? 0) && (
                                  <button
                                    onClick={() => handleSaveScore(member.id)}
                                    disabled={loading}
                                    className="btn-add"
                                  >
                                    {loading ? "Menyimpan..." : "Simpan"}
                                  </button>
                                )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ===================== HALAMAN PDF ===================== */}
      <div className="hidden pdf-container" ref={printRef}>
        <div className="p-6 font-sans">
          <h1 className="text-3xl font-bold text-center mb-1">Nama Guild MWL</h1>
          <p className="text-center text-gray-700 mb-4">
            Scoreboard tanggal {parseAndFormatDateString(selectedDate)}
          </p>

          

          <table className="min-w-full border-collapse border border-gray-400">
            <thead>
              <tr className="bg-red-200">
                <th className="border px-4 py-2">No</th>
                <th className="border px-4 py-2">ID</th>
                <th className="border px-4 py-2">Nickname</th>
                <th className="border px-4 py-2">Score</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member, index) => {
                const score = scoresMap[member.id]?.score ?? 0;
                return (
                  <tr key={member.id}>
                    <td className="border px-4 py-2 text-center">{index + 1}</td>
                    <td className="border px-4 py-2">{member.id}</td>
                    <td className="border px-4 py-2">{member.nama}</td>
                    <td className="border px-4 py-2 text-center font-bold">{score}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ScoreMember;
