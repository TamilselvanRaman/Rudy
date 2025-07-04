import React, { useState } from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import ProductCard from "../Product/ProductCard";

const BestSellerCarousel = ({ bestSellers }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < bestSellers.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const currentProduct = bestSellers[currentIndex];

  return (
    <div className="mt-6 p-4 md:w-72  flex flex-col items-center space-y-4 ">
      {/* Product Card */}
      <div className="flex items-center justify-center">
        {currentProduct ? (
          <ProductCard product={currentProduct} viewMode="grid" />
        ) : (
          <p className="text-gray-500 text-center">No best seller available.</p>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4 mt-1">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`w-10 h-10 rounded bg-blue-100 flex items-center justify-center text-gray-600 text-xl shadow-sm transition hover:bg-blue-200 ${
            currentIndex === 0 ? "opacity-40 cursor-not-allowed" : ""
          }`}
        >
          <FiArrowLeft />
        </button>

        <button
          onClick={handleNext}
          disabled={currentIndex === bestSellers.length - 1}
          className={`w-10 h-10 rounded bg-blue-100 flex items-center justify-center text-gray-600 text-xl shadow-sm transition hover:bg-blue-200 ${
            currentIndex === bestSellers.length - 1
              ? "opacity-40 cursor-not-allowed"
              : ""
          }`}
        >
          <FiArrowRight />
        </button>
      </div>
    </div>
  );
};

export default BestSellerCarousel;
