import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react'; 

const FilterSection = ({ title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white transition-all duration-300">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center bg-[#FAEFE4] border-l-4 border-[#EED7CD] text-[#2C1C14] font-semibold px-5 py-3 hover:bg-[#f6e5d8] transition-colors"
      >
        {title}
        {open ? (
          <ChevronUp className="w-5 h-5 text-[#2C1C14]" />
        ) : (
          <ChevronDown className="w-5 h-5 text-[#2C1C14]" />
        )}
      </button>
      {open && (
        <div className="px-5 py-3 space-y-2 text-sm text-gray-800">{children}</div>
      )}
    </div>
  );
};

const FilterSidebar = () => {
  const checkboxItem = (label) => (
    <label className="flex items-center gap-2 text-sm text-black" key={label}>
      <input
        type="checkbox"
        className="accent-[#C48D69] w-4 h-4 rounded focus:ring-2 focus:ring-[#EED7CD]"
      />
      {label}
    </label>
  );

  return (
    <div className="w-full p-6 bg-white rounded-xl shadow-lg space-y-6 font-sans">
      <FilterSection title="Availability" defaultOpen>
        {['In stock (14)', 'Out of stock (1)'].map(checkboxItem)}
      </FilterSection>

      <FilterSection title="Price">
        <p className="text-gray-700">The highest price is <strong>$12.45</strong></p>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-gray-500">$</span>
          <input
            type="number"
            placeholder="0"
            className="border border-gray-300 rounded-md px-3 py-1 w-24 focus:outline-none focus:ring-1 focus:ring-[#EED7CD]"
          />
          <input
            type="number"
            placeholder="12.45"
            className="border border-gray-300 rounded-md px-3 py-1 w-24 focus:outline-none focus:ring-1 focus:ring-[#EED7CD]"
          />
        </div>
      </FilterSection>

      <FilterSection title="Product Type">
        {['Alcohol Free (3)', 'Animal Fat Free (4)', 'Gluten Free (3)', 'Paraben Free (5)'].map(
          checkboxItem
        )}
      </FilterSection>

      <FilterSection title="More Filters">
        {[
          '75 g (4)', '100 g (5)', '150 g (3)', '200 g (3)', '$100 - $200 (6)',
          '$200 - $300 (9)', 'Aloe Vera (2)', 'Argan (3)', 'Bloom (9)', 'Lavendar (3)', 'Lino (6)',
          'Papaya (2)', 'Rose (3)', 'Sandal Wood (2)', 'Soap (15)', 'Tag_New (1)',
        ].map(checkboxItem)}
      </FilterSection>

      <FilterSection title="Brand">
        {['Bloom (9)', 'Lino (6)'].map(checkboxItem)}
      </FilterSection>

      <FilterSection title="Flavour">
        {[
          'Almond (1)', 'Aloe (1)', 'Aloe Vera (2)', 'Argan (2)', 'Cocoa Butter (9)', 'Cucumber (3)',
          'Grey Clay (1)', 'Lavendar (6)', 'Lavender (1)', 'Lemongrass (1)', 'Neem (1)',
          'Papaya (4)', 'Patchouli (1)', 'Pink Clay (1)', 'Rose (5)', 'Sandal (2)', 'Sandal Wood (5)',
        ].map(checkboxItem)}
      </FilterSection>

      <FilterSection title="Weight">
        {['75 g (15)', '100 g (13)', '150 g (13)', '200 g (5)'].map(checkboxItem)}
      </FilterSection>

      <FilterSection title="Custom Menu">
        <div className="space-y-4">
          <p className="font-medium text-[#2C1C14]">Home</p>
          <div>
            <p className="font-medium text-[#2C1C14]">Bath Soap</p>
            <ul className="ml-5 list-disc text-black space-y-1">
              <li>Fairness Soap</li>
              <li>Deep Clean Soap</li>
              <li>Skin Whiten Soap</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-[#2C1C14]">Collections</p>
            <ul className="ml-5 list-disc text-black space-y-1">
              <li>Ayurvedic Soap</li>
              <li>Handmade Soap</li>
              <li>Herbal Soap</li>
              <li>Luxury Soap</li>
            </ul>
          </div>
        </div>
      </FilterSection>

      {/* Best Seller */}
      <div className="mt-6 border border-[#EED7CD] bg-[#FAEFE4] rounded-xl p-4 shadow">
        <h3 className="text-lg font-semibold text-[#2C1C14] mb-3 border-b border-[#EED7CD] pb-2">
          Best Seller
        </h3>
        <img
          src="/path/to/best-seller-image.jpg"
          alt="Best Seller"
          className="rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
        />
      </div>
    </div>
  );
};

export default FilterSidebar;
