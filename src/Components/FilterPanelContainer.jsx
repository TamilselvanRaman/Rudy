// ================= FilterPanelContainer.jsx =================
import React, { useState } from 'react';
import FilterSidebar from './FilterSidebar';
import MobileFilterDrawer from './MobileFilterDrawer';

const FilterPanelContainer = ({ filters, setFilters, applyFilters }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  return (
    <>
      <div className="hidden md:block w-84 p-4 bg-white shadow rounded-xl">
        <FilterSidebar filters={filters} setFilters={setFilters} />
        <button
          className="mt-4 w-full px-4 py-2 bg-[#EED7CD] text-[#2C1C14] rounded"
          onClick={applyFilters}
        >
          Apply Filters
        </button>
      </div>

      <div className="md:hidden fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="bg-[#EED7CD] text-[#2C1C14] px-4 py-2 rounded shadow-lg"
        >
          Filter
        </button>
      </div>

      <MobileFilterDrawer
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
        filters={filters}
        setFilters={setFilters}
        applyFilters={applyFilters}
      />
    </>
  );
};
export default FilterPanelContainer;