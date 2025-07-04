import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";


const FilterSection = ({
  title,
  children,
  defaultOpen = true,
  disableToggle = false,
}) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="overflow-hidden bg-[#FAEFE4] transition-all duration-300">
      {!disableToggle && title && (
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex justify-between items-center border-l-4 border-[#EED7CD] text-[#2C1C14] font-semibold px-5 py-3 hover:bg-[#f6e5d8] transition-colors"
        >
          <span>{title}</span>
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="w-4 h-4 text-[#2C1C14]" />
          </motion.span>
        </button>
      )}

      <AnimatePresence initial={false}>
        {(open || disableToggle) && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="bg-white px-5 py-4 space-y-2 text-sm text-gray-800">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterSection;
