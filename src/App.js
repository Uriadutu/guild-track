import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./component/Login";
import SplashPage from "./pages/SplashPage";
import Register from "./component/Register";
import ProtectedRoute from "./ProtectedRoute";
import DashboardPage from "./pages/DashboardPage";
import TransaksiPage from "./pages/TransaksiPage";
import { ToastContainer } from "react-toastify"; // ✅ Tambahkan ini
import "react-toastify/dist/ReactToastify.css"; // ✅ Tambahkan ini juga
import Footer from "./component/Footer";
import TanggalPage from "./pages/TanggalPage";
import ScoreMemberPage from "./pages/ScoreMemberPage";
import ScoreUserPage from "./pages/ScoreUserPage";

function App() {
  return (
    <BrowserRouter>
      <>
        <Routes>
          <Route path="/" element={<SplashPage />} />
          <Route path="/score" element={<ScoreUserPage />} />
          <Route
            path="/masuk"
            element={
              <div>
                <Login />
                <Footer />
              </div>
            }
          />
          <Route
            path="/daftar"
            element={
              <div>
                <Register />
                <Footer />
              </div>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
         
          <Route
            path="/transaksi"
            element={
              <ProtectedRoute>
                <TransaksiPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tanggal"
            element={
              <ProtectedRoute>
                <TanggalPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tanggal/:tanggal/score"
            element={
              <ProtectedRoute>
                <ScoreMemberPage />
              </ProtectedRoute>
            }
          />
        </Routes>

        {/* ✅ Toast Container di luar <Routes> */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </>
    </BrowserRouter>
  );
}

export default App;
