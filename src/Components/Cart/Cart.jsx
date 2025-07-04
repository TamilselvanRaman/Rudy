import React, { useContext, useEffect } from "react";
import { CartContext } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";

const Cart = ({ onClose }) => {
  const {
    cartItems,
    onIncrease,
    onDecrease,
    removeFromCart, // renamed properly
  } = useContext(CartContext);

  const navigate = useNavigate();

  const subtotal = cartItems
    .reduce((sum, item) => sum + item.price * item.quantity, 0)
    .toFixed(2);

  useEffect(() => {
    console.log("Cart Items:", cartItems);
  }, [cartItems]);

  return (
    <div className="relative w-full max-w-md h-screen overflow-y-auto bg-white shadow-xl p-6">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 left-4 text-gray-500 hover:text-black text-xl"
      >
        &times;
      </button>

      <h2 className="text-2xl font-semibold text-center mt-2 mb-6">
        Your cart
      </h2>

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[calc(100%-100px)] text-center space-y-6">
          <p className="text-2xl font-medium text-black">Your cart is empty</p>
          <button
            onClick={() => {
              navigate("/");
              onClose();
            }}
            className="bg-rose-300 hover:bg-rose-400 text-black font-semibold px-6 py-2 rounded"
          >
            Continue Shopping
          </button>
          <div>
            <p className="text-lg font-semibold">Have an account?</p>
            <p className="text-gray-700 text-sm">
              <a href="/login" className="underline font-medium">
                Log in
              </a>{" "}
              to check out faster.
            </p>
          </div>
        </div>
      ) : (
        <>
          {cartItems.map((item, index) => (
            <div
              key={`${item.firebaseId}-${index}`}
              className="border-b pb-4 mb-4"
            >
              <div className="flex gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-sm text-gray-600">
                    <strong>Weight:</strong> {item.weight}g<br />
                    <strong>Flavour:</strong> {item.flavour}
                  </p>
                  <p className="text-lg font-bold mt-1">
                    ${item.price.toFixed(2)}
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => onDecrease(item.firebaseId)}
                      disabled={item.quantity <= 1}
                      className={`px-2 py-1 border rounded ${
                        item.quantity <= 1
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      –
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => onIncrease(item.firebaseId)}
                      className="px-2 py-1 border rounded hover:bg-gray-100"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeFromCart(item.firebaseId)}
                      className="ml-4 p-2 text-white bg-rose-300 hover:bg-rose-400 rounded"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Special Instructions */}
          <div className="mt-6">
            <label className="block font-medium mb-2">
              Order special instructions
            </label>
            <textarea
              rows="3"
              className="w-full border rounded p-2"
              placeholder="Enter any special notes..."
            />
          </div>

          {/* Subtotal */}
          <div className="mt-6 flex justify-between items-center text-lg font-semibold">
            <span>Subtotal</span>
            <span>${subtotal} USD</span>
          </div>

          <p className="text-sm text-gray-500 mt-1 mb-4">
            Taxes and shipping calculated at checkout
          </p>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => {
                navigate("/cartpage");
                onClose();
              }}
              className="flex-1 bg-rose-300 hover:bg-rose-400 text-black py-2 rounded font-medium"
            >
              View Cart
            </button>
            <button
              onClick={() => {
                navigate("/checkout");
                onClose();
              }}
              className="flex-1 bg-rose-300 hover:bg-rose-400 text-black py-2 rounded font-medium"
            >
              Check Out
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
