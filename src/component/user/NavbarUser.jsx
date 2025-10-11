import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/50 backdrop-blur-lg shadow-sm z-50">
      <div className="container px-3 sm:px-6 md:px-12 lg:px-20 mx-auto flex justify-between items-center py-4">
        <h1
          className="text-2xl font-bold text-red-500 cursor-pointer"
          translate="no"
          onClick={() => navigate("/")}
        >
          GuildTrack

        </h1>

        <div className="flex items-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className=" px-6 py-3 bg-red-500  hidden md:block  rounded-full text-white font-semibold border border-gray-300 hover:bg-red-600 transition"
            onClick={() => navigate("/masuk")}
          >
            Mulai Sekarang
          </motion.button>       
        </div>
      </div>

     
    </nav>
  );
};

export default Navbar;