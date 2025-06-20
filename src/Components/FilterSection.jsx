import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FilterSection = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center bg-[#FAEFE4] border-l-4 border-[#EED7CD] text-[#2C1C14] font-semibold px-5 py-3"
      >
        {title}
        {open ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>
      {open && <div className="px-5 py-3 space-y-2 text-sm text-gray-800">{children}</div>}
    </div>
  );
};
export default FilterSection;