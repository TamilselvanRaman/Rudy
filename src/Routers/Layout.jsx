import React from "react";
import Navbar from "../Components/Shared/Navbar";
import Footer from "../Components/Shared/Footer";
import Cart from "../components/Cart/Cart";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <Navbar />
      <Cart />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;
