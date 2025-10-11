import React from "react";
import NavbarUser from "../component/user/NavbarUser";
import Footer from "../component/Footer";

const LayoutUser = ({ children }) => {
  return (
    <div className="relative">
      <NavbarUser />
      <main className="pt-2 mx-auto">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default LayoutUser;
