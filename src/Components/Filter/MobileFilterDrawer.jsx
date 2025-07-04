import { Dialog } from "@headlessui/react";
import { Fragment, useState } from "react";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const FILTER_CATEGORIES = [
  "Availability",
  "Price",
  "Product type",
  "More filters",
  "Brand",
  "Flavour",
  "Weight",
];

const AVAILABILITY_OPTIONS = ["In stock", "Out of stock"];
const MORE_FILTERS_OPTIONS = [
  "75 g",
  "100 g",
  "150 g",
  "200 g",
  "Aloe Vera",
  "Argan",
  "Bloom",
  "Lavendar",
  "Papaya",
  "Rose",
  "Sandal Wood",
];
const DEFAULT_PRODUCT_TYPES = [
  "Alcohol Free",
  "Animal Fat Free",
  "Gluten Free",
  "Paraben Free",
];
const DEFAULT_WEIGHTS = ["75", "100", "150", "200"];
const DEFAULT_FLAVOURS = [
  "Almond",
  "Aloe",
  "Aloe Vera",
  "Argan",
  "Cocoa Butter",
  "Cucumber",
  "Lavendar",
  "Papaya",
  "Rose",
  "Sandal Wood",
];
const DEFAULT_BRANDS = ["Bloom", "Lino"];

const OPTIONS_MAP = {
  Availability: AVAILABILITY_OPTIONS,
  "Product type": DEFAULT_PRODUCT_TYPES,
  "More filters": MORE_FILTERS_OPTIONS,
  Brand: DEFAULT_BRANDS,
  Flavour: DEFAULT_FLAVOURS,
  Weight: DEFAULT_WEIGHTS,
};

const MobileFilterDrawer = ({
  isOpen,
  onClose,
  filters,
  setFilters,
  allProducts,
}) => {
  const [activeSection, setActiveSection] = useState(null);
  const [priceRange, setPriceRange] = useState(
    filters.price || { min: "", max: "" }
  );

  const handleToggleOption = (section, option) => {
    const key = section.toLowerCase();
    setFilters((prev) => {
      const current = prev[key] || [];
      const updated = current.includes(option)
        ? current.filter((o) => o !== option)
        : [...current, option];
      return { ...prev, [key]: updated };
    });
  };

  const handleClearSection = (section) => {
    const key = section.toLowerCase();
    setFilters((prev) => ({ ...prev, [key]: [] }));
    if (section === "Price") {
      setFilters((prev) => ({ ...prev, price: { min: "", max: "" } }));
      setPriceRange({ min: "", max: "" });
    }
  };

  const handleClearAll = () => {
    setFilters({
      availability: [],
      price: { min: "", max: "" },
      vendor: [],
      flavour: [],
      weight: [],
      productType: [],
      moreFilters: [],
    });
    setPriceRange({ min: "", max: "" });
  };

  const handleApplyPrice = () => {
    setFilters((prev) => ({
      ...prev,
      price: { ...priceRange },
    }));
    setActiveSection(null);
  };

  const getFilterCount = (category) => {
    const key = category.toLowerCase();
    if (key === "price")
      return filters.price?.min || filters.price?.max ? 1 : 0;
    return filters[key]?.length || 0;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog as={Fragment} open={isOpen} onClose={onClose}>
          <div className="fixed inset-0 z-50 flex">
            {/* Overlay */}
            <motion.div
              className="w-[30%] bg-black/20"
              onClick={onClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-[70%] max-w-sm bg-white h-full p-6 overflow-y-auto shadow-xl"
            >
              {/* Header */}
              <div className="flex justify-center items-center">
                <h2 className="text-lg font-bold text-[#2C1C14]">
                  Filter & Sort
                </h2>
              </div>

              <div className="text-sm text-center mt-2 text-[#C48D69] font-medium">
                {allProducts?.length || 0} products
              </div>

              {/* Main Menu */}
              {!activeSection ? (
                <>
                  <div className="mt-6 space-y-4">
                    {FILTER_CATEGORIES.map((category) => {
                      const count = getFilterCount(category);
                      return (
                        <button
                          key={category}
                          onClick={() => setActiveSection(category)}
                          className="w-full flex justify-between items-center py-2 text-left text-sm hover:bg-[#F8F4F1] rounded px-2 transition"
                        >
                          <span>{category}</span>
                          <div className="flex items-center gap-2">
                            {count > 0 && (
                              <span className="text-xs bg-[#C48D69] text-white px-2 py-0.5 rounded-full">
                                {count}
                              </span>
                            )}
                            <FiChevronRight />
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-6 flex gap-3">
                    <button
                      onClick={handleClearAll}
                      className="w-full bg-[#EED7CD] text-[#2C1C14] py-2 rounded-lg font-semibold hover:bg-[#e4c9bb] transition"
                    >
                      Clear All
                    </button>
                    <button
                      onClick={onClose}
                      className="w-full bg-[#C48D69] text-white py-2 rounded-lg font-semibold hover:bg-[#b37758] transition"
                    >
                      Apply
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 mt-3 mb-5">
                    <button
                      onClick={() => setActiveSection(null)}
                      className="text-[#C48D69] hover:text-[#a96b4f] transition"
                    >
                      <FiChevronLeft />
                    </button>
                    <h3 className="text-sm font-semibold">{activeSection}</h3>
                  </div>

                  {activeSection === "Price" ? (
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <input
                          type="number"
                          placeholder="Min"
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                          value={priceRange.min}
                          onChange={(e) =>
                            setPriceRange((prev) => ({
                              ...prev,
                              min: e.target.value,
                            }))
                          }
                        />
                        <input
                          type="number"
                          placeholder="Max"
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                          value={priceRange.max}
                          onChange={(e) =>
                            setPriceRange((prev) => ({
                              ...prev,
                              max: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="flex gap-4 pt-4">
                        <button
                          onClick={() => handleClearSection("Price")}
                          className="w-full bg-[#EED7CD] text-[#2C1C14] py-2 rounded-lg font-semibold hover:bg-[#e4c9bb] transition"
                        >
                          Clear
                        </button>
                        <button
                          onClick={handleApplyPrice}
                          className="w-full bg-[#C48D69] text-white py-2 rounded-lg font-semibold hover:bg-[#b37758] transition"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-3">
                        {(OPTIONS_MAP[activeSection] || []).map((option) => {
                          const key = activeSection.toLowerCase();
                          const selected = filters?.[key]?.includes(option);

                          return (
                            <label
                              key={option}
                              className="flex items-center gap-3 text-sm"
                            >
                              <input
                                type="checkbox"
                                checked={selected}
                                onChange={() =>
                                  handleToggleOption(activeSection, option)
                                }
                                className="accent-[#C48D69] w-4 h-4"
                              />
                              <span className="text-[#2C1C14]">{option}</span>
                            </label>
                          );
                        })}
                      </div>
                      <div className="flex gap-4 pt-6">
                        <button
                          onClick={() => handleClearSection(activeSection)}
                          className="w-full bg-[#EED7CD] text-[#2C1C14] py-2 rounded-lg font-semibold hover:bg-[#e4c9bb] transition"
                        >
                          Clear
                        </button>
                        <button
                          onClick={() => setActiveSection(null)}
                          className="w-full bg-[#C48D69] text-white py-2 rounded-lg font-semibold hover:bg-[#b37758] transition"
                        >
                          Apply
                        </button>
                      </div>
                    </>
                  )}
                </>
              )}
            </motion.div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default MobileFilterDrawer;
