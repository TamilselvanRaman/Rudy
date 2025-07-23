import React, { useState } from "react";
import { X, Send, Twitter, Facebook, Instagram, Share2 } from "lucide-react";

const SubscribePopup = () => {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="relative w-full max-w-2xl bg-white shadow-xl rounded-md overflow-hidden">
        {/* Background Image Section */}
        <div
          className="relative h-80 bg-cover bg-center"
          style={{ backgroundImage: `url('/bannerImage.jpg')` }}
        >
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 bg-pink-200 hover:bg-pink-300 text-black rounded p-1"
            onClick={() => setIsOpen(false)}
          >
            <X size={18} />
          </button>

          {/* Overlay content */}
          <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-center items-center text-white px-6 text-center">
            <h2 className="text-2xl font-semibold mb-2">
              Subscribe To Our Emails
            </h2>
            <p className="text-sm mb-4">
              Be the first to know about new collections and exclusive offers.
            </p>

            {/* Email Form */}
            <form className="flex w-full max-w-md bg-white rounded overflow-hidden">
              <input
                type="email"
                placeholder="Email Address"
                className="flex-1 px-4 py-2 text-black outline-none"
              />
              <button
                type="submit"
                className="bg-pink-300 hover:bg-pink-400 text-black px-4 flex items-center gap-1"
              >
                Subscribe <Send size={16} />
              </button>
            </form>

            {/* Social Icons */}
            <div className="flex justify-center gap-4 mt-5 text-white">
              <a href="#" className="hover:text-pink-300">
                <Twitter size={20} />
              </a>
              <a href="#" className="hover:text-pink-300">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-pink-300">
                <Share2 size={20} />
              </a>
              <a href="#" className="hover:text-pink-300">
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscribePopup;
