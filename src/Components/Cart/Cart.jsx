import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Trash2, Minus, Plus, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  toggleCartOpen,
} from "../../redux/slices/cartSlice";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showInstructions, setShowInstructions] = useState(false);

  const cartItems = useSelector((state) => state.cart.cartItems);
  const isOpen = useSelector((state) => state.cart.isOpen);
  const currentUser = useSelector((state) => state.auth.currentUser);
  const uid = currentUser?.uid;
  const groupId = currentUser?.uid;

  const subtotal = cartItems
    .reduce((sum, item) => sum + item.price * item.quantity, 0)
    .toFixed(2);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(toggleCartOpen(false))}
          />

          {/* Sidebar */}
          <motion.div
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 shadow-xl p-6 overflow-y-auto"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.4 }}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#C48D69]">Your cart</h2>
              <button
                onClick={() => dispatch(toggleCartOpen(false))}
                className="text-gray-500 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Cart Content */}
            {cartItems.length === 0 ? (
              <div className="text-center mt-20 space-y-4">
                <p className="text-lg font-medium">Your cart is empty</p>
                <button
                  onClick={() => {
                    dispatch(toggleCartOpen(false));
                    navigate("/products");
                  }}
                  className="bg-[#C48D69] hover:bg-[#a56d4e] text-white font-semibold px-6 py-2 rounded"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                {cartItems.map((item) => (
                  <motion.div
                    key={item.firebaseId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                    className="border-b border-gray-200 pb-6 mb-6"
                  >
                    <div className="flex gap-4 items-start">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded shadow"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{item.name}</h3>
                        <p className="text-sm text-gray-600 mt-1 leading-5">
                          <strong>Weight:</strong> {item.weight} g<br />
                          <strong>Flavour:</strong> {item.flavour}
                        </p>
                        <p className="font-bold text-[#C48D69] mt-2">
                          ${item.price.toFixed(2)}
                        </p>

                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() =>
                              dispatch(
                                decreaseQuantity({
                                  uid,
                                  groupId,
                                  firebaseId: item.firebaseId,
                                })
                              )
                            }
                            disabled={item.quantity <= 1}
                            className={`w-8 h-8 border rounded flex items-center justify-center ${
                              item.quantity <= 1
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:bg-[#f1e5df]"
                            }`}
                          >
                            <Minus size={16} />
                          </button>
                          <span className="text-base font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              dispatch(
                                increaseQuantity({
                                  uid,
                                  groupId,
                                  firebaseId: item.firebaseId,
                                })
                              )
                            }
                            className="w-8 h-8 border rounded flex items-center justify-center hover:bg-[#f1e5df]"
                          >
                            <Plus size={16} />
                          </button>
                          <button
                            onClick={() =>
                              dispatch(
                                removeFromCart({
                                  uid,
                                  groupId,
                                  firebaseId: item.firebaseId,
                                })
                              )
                            }
                            className="ml-2 p-2 bg-[#C48D69] hover:bg-[#a56d4e] text-white rounded"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Special Instructions */}
                <div className="mt-6 pt-4 border-t border-gray-300">
                  <button
                    onClick={() => setShowInstructions(!showInstructions)}
                    className="w-full flex items-center justify-between font-medium text-[#111] text-base mb-2"
                  >
                    Order special instructions
                    <ChevronDown
                      size={18}
                      className={`transition-transform duration-300 ${
                        showInstructions ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {showInstructions && (
                      <motion.div
                        key="textarea"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <hr className="border-gray-300 mb-3" />
                        <textarea
                          rows="4"
                          placeholder="Order special instructions"
                          className="w-full border border-gray-300 rounded p-2 text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#C48D69] resize-y"
                        />
                        <hr className="border-gray-300 mt-4" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex justify-between mt-6 text-lg font-semibold">
                  <span>Subtotal</span>
                  <span>${subtotal} USD</span>
                </div>
                <p className="text-sm text-gray-500 mt-1 mb-4">
                  Taxes and shipping calculated at checkout
                </p>

                <div className="flex gap-4 mt-4">
                  <button
                    onClick={() => {
                      dispatch(toggleCartOpen(false));
                      navigate("/cartpage");
                    }}
                    className="w-1/2 bg-[#f1e5df] hover:bg-[#e2cfc2] text-black py-2 rounded font-medium"
                  >
                    View Cart
                  </button>
                  <button
                    onClick={() => {
                      dispatch(toggleCartOpen(false));
                      navigate("/checkout");
                    }}
                    className="w-1/2 bg-[#C48D69] hover:bg-[#a56d4e] text-white py-2 rounded font-medium"
                  >
                    Check Out
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Cart;
