import React from "react";
import { Eye, Heart, ShoppingCart, Expand } from "lucide-react";

const ProductCard = ({ product, onClick }) => {
  const randomStars = Math.floor(Math.random() * 3) + 3;
  const reviewCount = Math.floor(Math.random() * 5) + 1;

  return (
    <div className="relative group cursor-pointer">
      <div className="overflow-hidden rounded-lg">
        <img
          src={product.images?.[0]}
          alt={product.name}
          className="w-full h-52 object-cover transform group-hover:scale-110 transition duration-300"
        />
        {/* Overlay Icons */}
        <div className="absolute right-2 top-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition">
          <button className="bg-white p-1 rounded shadow">
            <Expand size={16} />
          </button>
          <button className="bg-white p-1 rounded shadow">
            <Eye size={16} />
          </button>
          <button className="bg-white p-1 rounded shadow">
            <ShoppingCart size={16} />
          </button>
          <button className="bg-white p-1 rounded shadow">
            <Heart size={16} />
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="text-center mt-2" onClick={onClick}>
        <h3 className="text-sm text-gray-800">{product.name}</h3>
        <div className="text-pink-400 text-xs mt-1">
          {"★".repeat(randomStars).padEnd(5, "☆")}
          <span className="text-gray-500 ml-1">{reviewCount} reviews</span>
        </div>
        <div className="font-semibold text-gray-700 mt-1">${product.price}</div>
      </div>
    </div>
  );
};

export default ProductCard;
