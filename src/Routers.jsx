import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Dashboard from "./Components/ProductEntry";
import Login from "./Pages/Login";
import AdminPanel from "./Pages/AdminPanel";
import Products from "./Pages/Products";
import ProductDetail from "./pages/ProductDetail";

function Routers() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/adminpanel" element={<AdminPanel />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetail />} />
      </Routes>
    </Router>
  );
}

export default Routers;
