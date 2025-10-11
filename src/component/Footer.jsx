import React from "react";
const Footer = () => {
  return (
    <footer
      id="footer"
      className="bg-white border-t border-gray-100 text-white py-3"
    >
      <div className="container w-full mx-auto px-6 flex flex-col items-center text-center">
        {/* Copyright */}
        <p className="text-gray-400" translate="no">
          © {new Date().getFullYear()} GuildTrack. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
