import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProductCard from "../../Components/Product/ProductCard";

import { RiDeleteBin6Line } from "react-icons/ri";
import { FiShoppingCart } from "react-icons/fi";
import { Link } from "react-router-dom";
import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  fetchCart,
} from "../../redux/slices/cartSlice";

import { motion, AnimatePresence } from "framer-motion";

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.cartItems);
  const products = useSelector((state) => state.products.products);
  const currentUser = useSelector((state) => state.auth.currentUser);
  const uid = currentUser?.uid;
  const groupId = currentUser?.uid;

  useEffect(() => {
    if (uid && groupId) {
      dispatch(fetchCart({ uid, groupId }));
    }
  }, [uid, groupId, dispatch]);

  const subtotal = cartItems
    .reduce((sum, item) => sum + Number(item.price) * item.quantity, 0)
    .toFixed(2);

  if (cartItems.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center justify-center min-h-screen bg-white px-6 py-12"
      >
        {/* <FiShoppingCart className="text-6xl text-[#d79c84] mb-6" /> */}
        <h1 className="text-3xl font-bold text-[#000000] mb-3">
          Your Cart is Empty
        </h1>
        <p className="text-gray-600 mb-6">
          Looks like you haven’t added anything yet.
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/")}
          className="px-6 py-2  bg-[#e1b8a1] hover:bg-[#99bed1] text-[#3c2f2f] font-medium shadow-md transition duration-300"
        >
          Continue Shopping
        </motion.button>

        <div className="mt-8 text-center">
          <p className="text-[#3c2f2f] font-medium">Have an account?</p>
          <p className="text-sm text-gray-600">
            <Link
              to="/login"
              className="underline text-[#3c2f2f] hover:text-[#d79c84] font-semibold transition"
            >
              Log in
            </Link>{" "}
            to access your saved cart.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen"
    >
      <div
        className="bg-cover bg-center h-64 flex flex-col justify-center items-center text-black"
        style={{
          backgroundImage: `url('/banner-image.jpg')`,
          backgroundColor: "rgba(255,255,255,0.4)",
          backgroundBlendMode: "lighten",
        }}
      >
        <h1 className="text-3xl  font-bold">Your Shopping Cart</h1>
        <p className="text-sm mt-2 font-semibold">Home / Your Shopping Cart</p>
      </div>

      <div className="px-4 sm:px-40 py-10">
        <div className="hidden sm:grid grid-cols-3 font-semibold text-[#3c2f2f] text-2xl border-b pb-3 mb-4">
          <span>Product</span>
          <span className="text-center">Quantity</span>
          <span className="text-right">Total</span>
        </div>

        <AnimatePresence>
          {cartItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left py-8 border-b"
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-center gap-5 w-full sm:w-[420px]">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-40 h-40 sm:w-48 sm:h-48 object-cover"
                />
                <div>
                  <h3 className="font-semibold text-xl sm:text-2xl text-[#000000] ">
                    {item.name}
                  </h3>
                  <p className="text-md text-gray-800 font-semibold mt-1 mb-2">
                    ${Number(item.price).toFixed(2)}
                  </p>
                  <p className="text-sm sm:text-md text-gray-900">
                    <strong>Weight:</strong> {item.weight} g<br />
                    <strong>Flavour:</strong> {item.flavour}
                  </p>
                </div>
              </div>

              <div className="flex justify-center items-center">
                <button
                  onClick={() =>
                    dispatch(
                      decreaseQuantity({ uid, firebaseId: item.firebaseId })
                    )
                  }
                  className="px-3 py-1 border border-gray-300 cursor-pointer"
                >
                  –
                </button>
                <span className="font-semibold py-1 border-t border-b border-gray-300 px-6 ">
                  {item.quantity}
                </span>
                <button
                  onClick={() =>
                    dispatch(
                      increaseQuantity({ uid, firebaseId: item.firebaseId })
                    )
                  }
                  className="px-3 py-1 border border-gray-300 cursor-pointer"
                >
                  +
                </button>
                <button
                  onClick={() =>
                    dispatch(
                      removeFromCart({ uid, firebaseId: item.firebaseId })
                    )
                  }
                  className="ml-4 p-2 bg-[#e1b8a1] hover:bg-[#a7bbbe] text-black hover:text-white transition duration-200 cursor-pointer"
                  title="Remove"
                >
                  <RiDeleteBin6Line className="w-4 h-4" />
                </button>
              </div>

              <div className="text-center sm:text-right ">
                <span className="font-semibold text-lg text-[#3c2f2f] mt-10">
                  ${(Number(item.price) * item.quantity).toFixed(2)} USD
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <div className="mt-12 grid grid-cols-1 gap-10 md:flex md:justify-center">
          <div className="md:hidden">
            <label className="block font-medium mb-2 text-[#3c2f2f]">
              Order special instructions
            </label>
            <textarea
              rows={4}
              placeholder="Order special instructions"
              className="w-full border border-gray-300 rounded-lg p-3 text-sm"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full md:max-w-lg p-6 bg-white shadow-lg space-y-4"
          >
            <div className="flex justify-between font-medium text-lg text-[#3c2f2f]">
              <span>Subtotal</span>
              <span>${subtotal} USD</span>
            </div>
            <p className="text-sm text-gray-500">
              Taxes and shipping calculated at checkout
            </p>
            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-[#e1b8a1] hover:bg-[#a7bbbe] text-black cursor-pointer hover:text-white font-semibold py-3 rounded transition mt-4"
            >
              Check Out
            </button>
          </motion.div>
        </div>

        <div className="flex items-center justify-between mt-16 mb-6">
          <h2 className="text-xl font-semibold text-[#3c2f2f]">
            Featured Collection
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...products]
            .sort(() => 0.5 - Math.random())
            .slice(0, 4)
            .map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
        </div>
      </div>
    </motion.div>
  );
};

export default CartPage;
