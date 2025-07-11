import React from "react";
import { motion } from "framer-motion";

const waveVariants = {
  initial: {
    scaleY: 0,
    opacity: 0,
  },
  hover: {
    scaleY: 4,
    opacity: 1,
    transition: { duration: 0.3, ease: "easeInOut" },
  },
};

const WaveButton = ({ label, onClick , className=""}) => {
  return (
    <motion.div
      initial="initial"
      whileHover="hover"
      onClick={onClick}
      className={`relative inline-flex flex-col items-center justify-center cursor-pointer group w-fit ${className}`}
    >
      {/* Button text */}
      <span className="relative z-10 text-sm font-semibold text-black/80">
        {label}
      </span>

      {/* Static underline */}
      <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#b0c6cd] z-0" />

      {/* Animated wave underline */}
      <motion.svg
        variants={waveVariants}
        viewBox="0 0 100 10"
        preserveAspectRatio="none"
        className="absolute -bottom-1 left-0 w-[100%] h-1 z-0"
        style={{ originY: 1 }}
      >
        <path
          d="M0 5 Q 25 0, 50 5 T 100 5 V10 H0 Z"
          fill="#eeb8a7"
          filter="drop-shadow(0 2px 6px rgba(238, 184, 167, 0.5))"
        />
      </motion.svg>
    </motion.div>
  );
};

export default WaveButton;
