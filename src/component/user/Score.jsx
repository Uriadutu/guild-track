import React, { useState, useEffect, useMemo, useCallback } from "react";
import { db } from "../../auth/Firebase";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { IoSearch } from "react-icons/io5";
import { parseAndFormatDateString } from "../../utils/helper";

const ScoreViewUser = () => {
  const [members, setMembers] = useState([]);
  const [scoresMap, setScoresMap] = useState({});
  const [tanggalList, setTanggalList] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [search, setSearch] = useState("");
  const [fetching, setFetching] = useState(true);
  const [totalScore, setTotalScore] = useState(0);

  // 🔹 Ambil semua tanggal dari database
  const getTanggalList = async () => {
    const snapshot = await getDocs(collection(db, "tanggal"));
    const data = snapshot.docs.map((d) => d.data().tanggal);
    data.sort((a, b) => new Date(b) - new Date(a));
    setTanggalList(data);
    setSelectedDate(data[0] || new Date().toISOString().split("T")[0]);
  };

  const getData = useCallback(async () => {
    if (!selectedDate) return;
    setFetching(true);
    try {
      const [memberSnapshot, scoreSnapshot] = await Promise.all([
        getDocs(collection(db, "member")),
        getDocs(
          query(collection(db, "score"), where("tanggal", "==", selectedDate))
        ),
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
      console.error("Error:", error);
    } finally {
      setFetching(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    getTanggalList();
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  const filteredMembers = useMemo(() => {
    const lower = search.toLowerCase();
    return members.filter(
      (m) =>
        m.nama?.toLowerCase().includes(lower) ||
        m.id?.toString().toLowerCase().includes(lower)
    );
  }, [members, search]);

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

  return (
    <div className="py-20 px-4 max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 transition-transform duration-300 hover:-translate-y-1">
        {/* Header */}
        <header className="px-6 py-5 bg-gradient-to-r from-red-600 to-rose-500 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
          <h1 className="text-2xl font-extrabold tracking-wide">
            SCOREBOARD{" "}
            <span className="text-yellow-200 font-semibold">
              {parseAndFormatDateString(selectedDate)}
            </span>
          </h1>
          <div>
            <select
              className="px-4 py-2 rounded-lg text-gray-800 focus:ring-2 focus:ring-red-300 outline-none shadow-sm"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            >
              {tanggalList.map((t) => (
                <option key={t} value={t}>
                  {parseAndFormatDateString(t)}
                </option>
              ))}
            </select>
          </div>
        </header>

        {/* Body */}
        <div className="px-6 py-6 bg-gray-50">
          {/* Search & Total */}
          <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
            {/* Search */}
            <div className="flex items-center p-2 border rounded-xl w-full sm:w-auto bg-white shadow-sm hover:shadow-md transition-all">
              <input
                type="text"
                placeholder="Cari Nama atau ID..."
                className="text-sm outline-none w-full px-2"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <IoSearch className="text-gray-400 text-lg" />
            </div>

            {/* Total Score */}
            <div className="text-right font-semibold text-gray-700 bg-white px-5 py-2 rounded-xl shadow-sm border border-gray-100">
              Total Score:{" "}
              <span className="text-red-600 font-bold">{totalScore || 0}</span>
            </div>
          </div>

          {/* Top 4 Ranking */}
          {/* Top 4 Ranking */}
          {filteredMembers.length > 0 && search === "" && (
            <div className="mb-3">
              <h2 className="text-md font-medium text-gray-700 mb-3">
                Top 4 Score
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 relative">
                {filteredMembers
                  .map((m) => ({
                    ...m,
                    score: scoresMap[m.id]?.score ?? 0,
                  }))
                  .sort((a, b) => b.score - a.score)
                  .slice(0, 4)
                  .map((m, i) => (
                    <div
                      key={m.id}
                      className="bg-red-50 border border-red-200 rounded-lg p-3 text-center transition-colors duration-200 hover:bg-red-100"
                    >
                      <div className="text-xs font-semibold text-red-400 mb-1 absolute">
                        #{i + 1}
                      </div>
                      <div className="text-sm font-medium text-red-800 truncate">
                        {m.nama} MWL{" "}
                        <span className="text-xs text-red-500">({m.id})</span>
                      </div>

                      <div className="mt-1 text-lg font-bold text-red-600">
                        {m.score}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Table */}
          {filteredMembers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <p className="text-lg font-medium">Tidak ada data score</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
              <table className="min-w-full text-sm text-gray-700">
                <thead className="bg-gradient-to-r from-rose-100 to-red-100 text-gray-800">
                  <tr>
                    <th className="border px-4 py-3 text-center font-semibold">
                      No
                    </th>
                    <th className="border px-4 py-3 text-center font-semibold">
                      ID
                    </th>
                    <th className="border px-4 py-3 text-left font-semibold">
                      Nickname
                    </th>
                    <th className="border px-4 py-3 text-center font-semibold">
                      Score
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((m, i) => (
                    <tr
                      key={m.id}
                      className="hover:bg-rose-50 transition-all duration-200"
                    >
                      <td className="border px-4 py-3 text-center">{i + 1}</td>
                      <td className="border px-4 py-3 text-center">{m.id}</td>
                      <td className="border px-4 py-3">{m.nama} MWL</td>
                      <td className="border px-4 py-3 text-center font-bold text-red-600">
                        {scoresMap[m.id]?.score ?? 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScoreViewUser;
