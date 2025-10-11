import React, { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { GrScorecard } from "react-icons/gr";
import { IoIosClose } from "react-icons/io";
import {
  FiLogOut,
  FiShoppingCart,
  FiUser,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../auth/Firebase";

const Navbar = () => {
  const [openSidebar, setOpenSideBar] = useState(false);
  const navigate = useNavigate();
  const user = auth.currentUser;

  const logout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error.message);
    }
  };

  return (
    <div>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300 ${
          openSidebar ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpenSideBar(false)}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-50 bg-white w-64 h-screen text-gray-800 shadow-lg transform transition-transform duration-300 ${
          openSidebar ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-[#be1414] text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                <FiUser />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#be1414]">
                  {user.displayName}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
            <button onClick={() => setOpenSideBar(false)}>
              <IoIosClose size={28} />
            </button>
          </div>

          {/* Menu */}
          <nav className="flex flex-col gap-3 mt-4">
            <SidebarItem
              to="/dashboard"
              icon={<FiUser />}
              label="Data Member"
              onClick={() => setOpenSideBar(false)}
            />
            <SidebarItem
              to="/tanggal"
              icon={<GrScorecard />}
              label="Kelola Score"
              onClick={() => setOpenSideBar(false)}
            />
            
            {/* <SidebarItem to="/laporan" icon={<FiBarChart2 />} label="Laporan" onClick={() => setOpenSideBar(false)} /> */}
            {/* <SidebarButton onClick={() => { onUbahSandi(); setOpenSideBar(false); }} icon={<FiKey />} label="Ubah Kata Sandi" /> */}
            <SidebarButton
              onClick={() => {
                logout();
                setOpenSideBar(false);
              }}
              icon={<FiLogOut />}
              label="Keluar"
            />
          </nav>
        </div>
      </div>

      {/* Top Navbar (Mobile Only) */}
      <div className="sm:hidden fixed top-0 left-0 w-full z-30 bg-white border-b border-gray-200 py-5 px-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => setOpenSideBar(true)}>
            <GiHamburgerMenu color="#333" size={22} />
          </button>
          <p className="text-[#be1414] text-sm font-medium" translate="no">
            GuildTrack
          </p>
        </div>
      </div>
    </div>
  );
};

const SidebarItem = ({ to, icon, label, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center gap-3 text-sm px-3 py-2 rounded-md hover:bg-gray-100 transition"
  >
    {icon}
    {label}
  </Link>
);

const SidebarButton = ({ onClick, icon, label }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-3 text-sm px-3 py-2 rounded-md hover:bg-gray-100 transition text-left w-full"
  >
    {icon}
    {label}
  </button>
);

export default Navbar;
