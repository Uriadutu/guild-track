import React from "react";
import { signOut } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../auth/Firebase";
import {
  FiLogOut,
  FiBox,
  FiHome,
  FiShoppingCart,
  FiUser,
} from "react-icons/fi";
import { GrScorecard } from "react-icons/gr";

const Sidebar = ({ onUbahSandi }) => {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error.message);
    }
  };

  const user = auth.currentUser;

  return (
    <div className="hidden sm:flex flex-col z-40 bg-white w-64 h-screen px-6 py-8 drop-shadow-md text-gray-800 border-r border-gray-200">
      {/* User Section */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-[#be1414] text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
          <FiUser size={20} />
        </div>
        <div>
          <p className="text-sm font-semibold text-[#be1414]">{user.displayName}</p>
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>
      </div>

      {/* Menu Section */}
      <nav className="flex flex-col gap-4">
        <SidebarItem to="/dashboard" icon={<FiUser />} label="Data Member" />
        <SidebarItem to="/tanggal" icon={<GrScorecard />} label="Kelola Score" />
        {/* <SidebarItem to="/produk" icon={<FiBox />} label="Produk" /> */}
        {/* <SidebarItem to="/transaksi" icon={<FiShoppingCart />} label="Transaksi" /> */}
        {/* <SidebarItem to="/laporan" icon={<FiBarChart2 />} label="Laporan" /> */}
        {/* <SidebarButton onClick={onUbahSandi} icon={<FiKey />} label="Ubah Kata Sandi" /> */}
        <SidebarButton onClick={logout} icon={<FiLogOut />} label="Keluar" />
      </nav>
    </div>
  );
};

const SidebarItem = ({ to, icon, label }) => (
  <Link
    to={to}
    className="flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-gray-100 transition-all"
  >
    {icon}
    <span>{label}</span>
  </Link>
);

const SidebarButton = ({ onClick, icon, label }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-gray-100 transition-all text-left w-full"
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default Sidebar;
