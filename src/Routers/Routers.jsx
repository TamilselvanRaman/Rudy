import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Context Providers
import { CartProvider } from "../context/CartContext";
import { ProductsProvider } from "../context/ProductsContext";

// Pages
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Products from "../Pages/Products";
import ProductDetail from "../components/Product/ProductDetail";
import CartPage from "../Pages/User/CartPage";
import Checkout from "../pages/User/checkOut";
import ContactPage from "../pages/ContactPage";
import NewsPage from "../pages/NewsPage";
import AdminPanel from "../pages/Admin/AdminPanel";
import Wishlist from "../Pages/User/Wishlist";

// Components
import Cart from "../components/Cart/Cart"; // You may change to index.js if combining CartSummary

// Routes
import ProtectedAdminRoute from "./ProtectedAdminRoute";

// Shared
import NotFound from "../components/Shared/NotFound";

function Routers() {
  return (
    <ProductsProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/home" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/cartpage" element={<CartPage />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/wishlist" element={<Wishlist />} />

            {/* Protected Admin Route */}
            <Route
              path="/adminpanel"
              element={
                <ProtectedAdminRoute>
                  <AdminPanel />
                </ProtectedAdminRoute>
              }
            />

            {/* Catch-all 404 Page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </CartProvider>
    </ProductsProvider>
  );
}

export default Routers;
