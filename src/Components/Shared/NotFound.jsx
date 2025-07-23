import React from "react";
import Lottie from "lottie-react";
import notFoundAnimation from "../../../src/assets/404.json";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 text-center">
      {/* Lottie Animation */}
      <div className="w-full max-w-md">
        <Lottie animationData={notFoundAnimation} loop autoplay />
      </div>

      {/* Message */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mt-6">
        Oops! Page Not Found
      </h1>
      <p className="text-gray-600 mt-2 text-base md:text-lg">
        The page you’re looking for doesn’t exist or has been moved.
      </p>

      {/* Button */}
      <Link
        to="/"
        className="mt-6 inline-block text-black bg-blue-100  font-semibold px-6 py-2 rounded-full hover:bg-[#faddca] transition duration-300"
      >
        Go Back Home
      </Link>
    </div>
  );
}

export default NotFound;
