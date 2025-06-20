// ================= MobileFilterDrawer.jsx =================
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import FilterSidebar from './FilterSidebar';

const MobileFilterDrawer = ({ isOpen, onClose, filters, setFilters, applyFilters }) => {
  const handleApply = () => {
    applyFilters();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-30 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed top-0 right-0 w-4/5 h-full bg-white z-50 shadow-xl overflow-y-auto"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Filter and sort</h2>
              <button onClick={onClose}>
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="p-4">
              <FilterSidebar filters={filters} setFilters={setFilters} />
            </div>

            <div className="sticky bottom-0 bg-white border-t px-4 py-3 flex justify-between items-center">
              <button
                className="px-4 py-2 bg-gray-200 rounded"
                onClick={() => setFilters({ brand: [], flavour: [], weight: [] })}
              >
                Remove All
              </button>
              <button className="px-4 py-2 bg-[#EED7CD] text-[#2C1C14] rounded" onClick={handleApply}>
                Apply
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
export default MobileFilterDrawer;