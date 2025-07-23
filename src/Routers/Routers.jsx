// src/Routers/Routers.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages & Components
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Products from "../Pages/Products";
import ProductDetail from "../components/Product/ProductDetail";
import CartPage from "../Pages/User/CartPage";
import Checkout from "../pages/User/checkOut";
import ContactPage from "../pages/ContactPage";
import AdminPanel from "../pages/Admin/AdminPanel";
import Wishlist from "../Pages/User/Wishlist";
import AboutPage from "../Pages/AboutPage";
import FaqPage from "../Pages/FaqPage";
import Collections from "../Pages/Collections";
import Compare from "../Pages/User/Compare";
import NotFound from "../components/Shared/NotFound";
import ProtectedAdminRoute from "./ProtectedAdminRoute";

// Layout wrapper
import Layout from "./Layout";
// import Profile from "../Pages/User/Profile";
import ProfilePage from "../Pages/User/ProfilePage";

function Routers() {
  return (
    <Router>
      <Routes>
        {/* Public routes without layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/checkout" element={<Checkout />} />

        {/* Layout route wraps common UI */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cartpage" element={<CartPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* Protected admin route */}
        <Route
          path="/adminpanel"
          element={
            <ProtectedAdminRoute>
              <AdminPanel />
            </ProtectedAdminRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default Routers;
