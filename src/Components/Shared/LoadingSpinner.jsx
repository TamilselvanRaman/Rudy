// src/Components/Shared/LoadingSpinner.jsx
import React from "react";
import Lottie from "lottie-react";
import loadingAnimation from "../../assets/loading.json";

const LoadingSpinner = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-white">
      <Lottie
        animationData={loadingAnimation}
        loop
        autoplay
        className="w-56 h-56"
      />
    </div>
  );
};

export default LoadingSpinner;
