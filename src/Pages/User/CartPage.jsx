import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProductCard from "../../Components/Product/ProductCard";
import { FiRefreshCw, FiTrash } from "react-icons/fi";
import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
} from "../../redux/slices/cartSlice";

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(0);

  const cartItems = useSelector((state) => state.cart.cartItems);
  const products = useSelector((state) => state.products.products);

  const subtotal = cartItems
    .reduce((sum, item) => sum + Number(item.price) * item.quantity, 0)
    .toFixed(2);

  if (cartItems.length === 0) {
    return (
      <div className="p-10 text-center min-h-screen">
        <h1 className="text-2xl font-semibold mb-6 text-[#3c2f2f]">
          Your Shopping Cart
        </h1>
        <p className="text-gray-500">Your cart is currently empty.</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-6 py-2 bg-[#e1b8a1] hover:bg-[#d79c84] text-white rounded font-medium transition"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold uppercase tracking-tight text-[#3c2f2f]">
            Your Shopping Cart
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Home / Your Shopping Cart
          </p>
        </div>

        {/* Table Headers */}
        <div className="grid grid-cols-3 font-semibold text-[#3c2f2f] text-lg border-b pb-3 mb-4">
          <span>Product</span>
          <span className="text-center">Quantity</span>
          <span className="text-right">Total</span>
        </div>

        {/* Cart Items */}
        {cartItems.map((item, i) => (
          <div
            key={i}
            className="grid grid-cols-3 items-center py-6 border-b gap-4"
          >
            <div className="flex gap-4 items-center">
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded border"
              />
              <div>
                <h3 className="font-bold text-[#3c2f2f]">{item.name}</h3>
                <p className="text-sm text-gray-600">
                  ${Number(item.price).toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Weight:</strong> {item.weight} g<br />
                  <strong>Flavour:</strong> {item.flavour}
                </p>
              </div>
            </div>

            <div className="flex justify-center items-center gap-3">
              <button
                onClick={() => dispatch(decreaseQuantity(item.id))}
                className="px-3 py-1 border rounded hover:bg-[#f5e7db]"
              >
                –
              </button>
              <span className="font-medium">{item.quantity}</span>
              <button
                onClick={() => dispatch(increaseQuantity(item.id))}
                className="px-3 py-1 border rounded hover:bg-[#f5e7db]"
              >
                +
              </button>
              <button
                onClick={() => dispatch(removeFromCart(item.id))}
                className="ml-2 p-2 bg-[#e1b8a1] hover:bg-[#d79c84] text-white rounded"
                title="Remove"
              >
                <FiTrash className="w-5 h-5" />
              </button>
            </div>

            <div className="text-right font-semibold text-[#3c2f2f]">
              ${(item.price * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}

        {/* Summary & Instructions */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <label className="block font-medium mb-2 text-[#3c2f2f]">
              Order special instructions
            </label>
            <textarea
              rows={4}
              placeholder="Order special instructions"
              className="w-full border border-gray-300 rounded-lg p-3 text-sm"
            />
          </div>

          <div className="border rounded-lg p-6 bg-white shadow space-y-4">
            <div className="flex justify-between font-medium text-lg text-[#3c2f2f]">
              <span>Subtotal</span>
              <span>${subtotal} USD</span>
            </div>
            <p className="text-sm text-gray-500">
              Taxes and shipping calculated at checkout
            </p>
            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-[#e1b8a1] hover:bg-[#d79c84] text-white font-semibold py-3 rounded transition mt-4"
            >
              Check Out
            </button>
          </div>
        </div>

        {/* Refresh + Featured */}
        <div className="flex items-center justify-between mt-16 mb-6">
          <h2 className="text-xl font-semibold text-[#3c2f2f]">
            Featured Collection
          </h2>
          <button
            onClick={() => setRefresh(refresh + 1)}
            className="flex items-center gap-2 px-4 py-2 bg-[#f1e2d3] hover:bg-[#e3d2c1] text-[#3c2f2f] font-medium rounded shadow-sm transition"
          >
            <FiRefreshCw className="w-5 h-5" />
            Refresh
          </button>
        </div>

        {/* Product Suggestions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...products]
            .sort(() => 0.5 - Math.random())
            .slice(0, 4)
            .map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default CartPage;
