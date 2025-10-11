import React from "react"; 
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

      </div>

     
    </nav>
  );
};

export default Navbar;