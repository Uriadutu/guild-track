import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// Firebase config (gantilah dengan konfigurasi proyek Firebase Anda)
const firebaseConfig = {
  apiKey: "AIzaSyDXtcBmtsNmtBqumdHaRw7EXD3sWkKOMCU",
  authDomain: "lalu-lintas-839d4.firebaseapp.com",
  databaseURL:
    "https://lalu-lintas-839d4-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "lalu-lintas-839d4",
  storageBucket: "lalu-lintas-839d4.firebasestorage.app",
  messagingSenderId: "355043870842",
  appId: "1:355043870842:web:87be981dd7a5d3aca253c3",
  measurementId: "G-FBSY6YJRV9",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const db = getFirestore(app);
const storage = getStorage(app);

export { auth, storage };
