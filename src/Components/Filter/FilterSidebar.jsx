import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Plus, Minus, X } from "lucide-react";
import BestSellerCarousel from "./BestSellerCarousel";
import FilterSection from "./FilterSection";
import { BiFilterAlt } from "react-icons/bi";
import { Dialog } from "@headlessui/react";

const checkboxItem = (label, checked, onChange) => (
  <label
    className="flex items-center gap-2 text-sm text-black p-1 rounded-md cursor-pointer hover:text-[#eccfb4] transition-colors"
    key={label}
  >
    <input
      type="checkbox"
      className="accent-[#C48D69] w-4 h-4"
      checked={checked}
      onChange={onChange}
    />
    {label}
  </label>
);

const FilterSidebar = ({
  filters,
  counts = {},
  onFilterChange,
  onPriceChange,
  products = [],
}) => {
  const formatLabel = (label, count) => {
    const fallbackCount =
      count ??
      counts.vendor?.[label] ??
      counts.vendor?.[label.toLowerCase()] ??
      counts.productType?.[label] ??
      counts.productType?.[label.toLowerCase()] ??
      counts.flavour?.[label] ??
      counts.flavour?.[label.toLowerCase()] ??
      counts.weight?.[label] ??
      counts.weight?.[label.toLowerCase()] ??
      counts.moreFilters?.[label] ??
      counts.moreFilters?.[label.toLowerCase()] ??
      counts.availability?.[label] ??
      counts.availability?.[label.toLowerCase()];
    return fallbackCount !== undefined ? `${label} (${fallbackCount})` : label;
  };

  const [customMenuExpanded, setCustomMenuExpanded] = useState({
    bathSoap: false,
    collections: false,
  });

  const toggleCustomMenu = (key) => {
    setCustomMenuExpanded((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const AVAILABILITY_OPTIONS = ["in", "out"];
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

  const getUniqueValues = (array, key) => {
    const map = new Map();
    array.forEach((item) => {
      const value = item[key];
      if (Array.isArray(value)) {
        value.forEach((v) => {
          const normalized = v?.toLowerCase()?.trim();
          if (normalized && !map.has(normalized)) map.set(normalized, v.trim());
        });
      } else if (value) {
        const normalized = value?.toLowerCase()?.trim();
        if (normalized && !map.has(normalized))
          map.set(normalized, value.trim());
      }
    });
    return [...map.values()];
  };

  const PRODUCT_TYPE_OPTIONS = [
    ...new Set([
      ...DEFAULT_PRODUCT_TYPES,
      ...getUniqueValues(products, "type"),
    ]),
  ];

  const WEIGHT_OPTIONS = [
    ...new Set([...DEFAULT_WEIGHTS, ...getUniqueValues(products, "weight")]),
  ];

  const FLAVOUR_OPTIONS = [
    ...new Set([...DEFAULT_FLAVOURS, ...getUniqueValues(products, "flavour")]),
  ];

  const BRAND_OPTIONS = [
    ...new Set([...DEFAULT_BRANDS, ...getUniqueValues(products, "vendor")]),
  ];

  const maxPrice = counts?.maxPrice ?? 100;

  // ✅ Fixed bestSellers - avoid mutating state
  const bestSellers = (() => {
    const bestSellerProducts = products.filter((p) =>
      p.moreFilters?.includes("best-seller")
    );
    const list = bestSellerProducts.length >= 3 ? bestSellerProducts : products;
    return [...list].sort(() => 0.5 - Math.random()).slice(0, 3);
  })();

  
  const herbalSoaps = (() => {
    const herbalProducts = products.filter((p) =>
      p.moreFilters?.includes("herbal-soap")
    );
    const list = herbalProducts.length >= 3 ? herbalProducts : products;
    return [...list].sort(() => 0.5 - Math.random()).slice(0, 3);
  })();

  const [randomStars, setRandomStars] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    setRandomStars(Math.floor(Math.random() * 3) + 3);
    setReviewCount(Math.floor(Math.random() * 5) + 1);
  }, []);
  return (
    <aside className="top-6 h-max w-full space-y-6 font-sans">
      {/* Applied Filters */}
      
      {Object.keys(filters).some(
        (key) =>
          filters[key]?.length > 0 ||
          (key === "price" && (filters.price?.min || filters.price?.max))
      ) && (
        <div className="bg-white p-4 rounded-xl border border-[#eed7cd] space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="text-[#2C1C14] font-semibold text-sm">
              Applied Filters
            </h4>
            <button
              className="text-[#C48D69] text-xs underline"
              onClick={() => {
                onFilterChange({
                  availability: [],
                  price: { min: "", max: "" },
                  productType: [],
                  vendor: [],
                  flavour: [],
                  weight: [],
                  moreFilters: [],
                });
              }}
            >
              Clear All
            </button>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-[#2C1C14]">
            {Object.entries(filters).map(([key, value]) => {
              if (key === "price") {
                const tags = [];
                if (value?.min)
                  tags.push({
                    label: `Min: $${value.min}`,
                    onRemove: () => onPriceChange({ ...value, min: "" }),
                  });
                if (value?.max)
                  tags.push({
                    label: `Max: $${value.max}`,
                    onRemove: () => onPriceChange({ ...value, max: "" }),
                  });
                return tags.map((tag, index) => (
                  <span
                    key={`${tag.label}-${index}`}
                    className="bg-[#eed7cd] px-2 py-1 rounded-full flex items-center gap-1"
                  >
                    {tag.label}
                    <button
                      className="text-[#2C1C14] font-bold"
                      onClick={tag.onRemove}
                    >
                      ×
                    </button>
                  </span>
                ));
              } else if (Array.isArray(value) && value.length > 0) {
                return value.map((val) => (
                  <span
                    key={`${key}-${val}`}
                    className="bg-[#eed7cd] px-2 py-1 rounded-full flex items-center gap-1"
                  >
                    {val}
                    <button
                      className="text-[#2C1C14] font-bold"
                      onClick={() => {
                        const newValue = value.filter((v) => v !== val);
                        onFilterChange({ ...filters, [key]: newValue });
                      }}
                    >
                      ×
                    </button>
                  </span>
                ));
              }
              return null;
            })}
          </div>
        </div>
      )}

      {/* Filter Sections */}
      <FilterSection title="Availability" defaultOpen={false}>
        {AVAILABILITY_OPTIONS.map((option) =>
          checkboxItem(
            formatLabel(
              option === "in" ? "In stock" : "Out of stock",
              counts.availability?.[option]
            ),
            filters.availability?.includes(option) || false,
            () => {
              const newAvailability = filters.availability || [];
              onFilterChange({
                ...filters,
                availability: newAvailability.includes(option)
                  ? newAvailability.filter((a) => a !== option)
                  : [...newAvailability, option],
              });
            }
          )
        )}
      </FilterSection>

      <FilterSection title="Price" defaultOpen={false}>
        <p className="text-gray-700">
          The highest price is <strong>${maxPrice.toFixed(2)}</strong>
        </p>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-gray-500">$</span>
          <input
            type="number"
            placeholder="Min"
            className="border border-gray-300 rounded-md px-3 py-1 w-24 focus:outline-none focus:ring-1 focus:ring-[#EED7CD]"
            value={filters.price?.min || ""}
            onChange={(e) =>
              onPriceChange({ ...filters.price, min: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Max"
            className="border border-gray-300 rounded-md px-3 py-1 w-24 focus:outline-none focus:ring-1 focus:ring-[#EED7CD]"
            value={filters.price?.max || ""}
            onChange={(e) =>
              onPriceChange({ ...filters.price, max: e.target.value })
            }
          />
        </div>
      </FilterSection>

      <FilterSection title="Product Type" defaultOpen={false}>
        {PRODUCT_TYPE_OPTIONS.map((type) =>
          checkboxItem(
            formatLabel(type, counts.productType?.[type]),
            filters.productType?.includes(type) || false,
            () => {
              const newTypes = filters.productType || [];
              onFilterChange({
                ...filters,
                productType: newTypes.includes(type)
                  ? newTypes.filter((t) => t !== type)
                  : [...newTypes, type],
              });
            }
          )
        )}
      </FilterSection>

      <FilterSection title="Brand" defaultOpen={false}>
        {BRAND_OPTIONS.map((brand) =>
          checkboxItem(
            formatLabel(brand, counts.vendor?.[brand]),
            filters.vendor?.includes(brand) || false,
            () => {
              const newVendors = filters.vendor || [];
              onFilterChange({
                ...filters,
                vendor: newVendors.includes(brand)
                  ? newVendors.filter((v) => v !== brand)
                  : [...newVendors, brand],
              });
            }
          )
        )}
      </FilterSection>

      <FilterSection title="Flavour" defaultOpen={false}>
        {FLAVOUR_OPTIONS.map((flavour) =>
          checkboxItem(
            formatLabel(flavour, counts.flavour?.[flavour]),
            filters.flavour?.includes(flavour) || false,
            () => {
              const newFlavours = filters.flavour || [];
              onFilterChange({
                ...filters,
                flavour: newFlavours.includes(flavour)
                  ? newFlavours.filter((f) => f !== flavour)
                  : [...newFlavours, flavour],
              });
            }
          )
        )}
      </FilterSection>

      <FilterSection title="Weight" defaultOpen={false}>
        {WEIGHT_OPTIONS.map((weight) =>
          checkboxItem(
            formatLabel(weight + " g", counts.weight?.[weight]),
            filters.weight?.includes(weight) || false,
            () => {
              const newWeights = filters.weight || [];
              onFilterChange({
                ...filters,
                weight: newWeights.includes(weight)
                  ? newWeights.filter((w) => w !== weight)
                  : [...newWeights, weight],
              });
            }
          )
        )}
      </FilterSection>

      <FilterSection title="More Filters" defaultOpen={false}>
        {MORE_FILTERS_OPTIONS.map((item) =>
          checkboxItem(
            formatLabel(item, counts.moreFilters?.[item]),
            filters.moreFilters?.includes(item) || false,
            () => {
              const newMore = filters.moreFilters || [];
              onFilterChange({
                ...filters,
                moreFilters: newMore.includes(item)
                  ? newMore.filter((m) => m !== item)
                  : [...newMore, item],
              });
            }
          )
        )}
      </FilterSection>

      {/* Custom Menu Section with Title */}
      <div>
        <div className="bg-[#FAEFE4] border-l-4 border-[#EED7CD] text-[#2C1C14] font-semibold px-5 py-3">
          Custom Menu
        </div>
        <FilterSection title="" defaultOpen={true} disableToggle={true}>
          <div className="space-y-4">
            <p className="font-medium text-[#2C1C14]">Home</p>

            <div>
              <button
                onClick={() => toggleCustomMenu("bathSoap")}
                className="flex justify-between items-center w-full font-medium text-[#2C1C14]"
              >
                <span>Bath Soap</span>
                <motion.span
                  animate={{ rotate: customMenuExpanded.bathSoap ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {customMenuExpanded.bathSoap ? (
                    <Minus className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {customMenuExpanded.bathSoap && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="ml-5 mt-2 list-disc text-black space-y-1"
                  >
                    <li>Fairness Soap</li>
                    <li>Deep Clean Soap</li>
                    <li>Skin Whiten Soap</li>
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>

            <div>
              <button
                onClick={() => toggleCustomMenu("collections")}
                className="flex justify-between items-center w-full font-medium text-[#2C1C14]"
              >
                <span>Collections</span>
                <motion.span
                  animate={{ rotate: customMenuExpanded.collections ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {customMenuExpanded.collections ? (
                    <Minus className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {customMenuExpanded.collections && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="ml-5 mt-2 list-disc text-black space-y-1"
                  >
                    <li>Ayurvedic Soap</li>
                    <li>Handmade Soap</li>
                    <li>Herbal Soap</li>
                    <li>Luxury Soap</li>
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          </div>
        </FilterSection>
      </div>

      {/* Best Seller Section with Title */}
      <div>
        <div className="bg-[#FAEFE4] border-l-4 border-[#EED7CD] text-[#2C1C14] font-semibold px-5 py-3">
          Best Seller
        </div>
        <FilterSection title="" defaultOpen={true} disableToggle={true}>
          <div className="flex justify-center items-center">
            <BestSellerCarousel bestSellers={bestSellers} />
          </div>
        </FilterSection>
      </div>

      {/* Herbal Soap Section with Title */}
      <div>
        <div className="bg-[#FAEFE4] border-l-4 border-[#EED7CD] text-[#2C1C14] font-semibold px-5 py-3">
          Herbal Soap
        </div>
        <FilterSection title="" defaultOpen={true} disableToggle={true}>
          <div className="space-y-4">
            {herbalSoaps.map((product) => (
              <a
                key={product.id}
                href={`/product/${product.id}`}
                className="flex gap-3 cursor-pointer group"
              >
                <img
                  src={product.images?.[0]}
                  alt={product.title}
                  className="w-24 h-24 object-cover rounded transition-transform duration-300 hover:scale-110"
                />
                <div className="flex-1 text-sm text-[#2C1C14]">
                  <h3 className="font-semibold mb-1 transition-colors group-hover:text-[#C48D69]">
                    {product.title}
                  </h3>
                  <div className="flex items-center gap-1 mb-1">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <svg
                        key={index}
                        className={`w-4 h-4 ${
                          index < (product.rating || randomStars)
                            ? "text-[#e4d8cf] fill-[#e4d8cf]"
                            : "text-[#e4d8cf] fill-white"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15l-5.878 3.09L5.6 12.545.721 8.41l6.41-.934L10 2l2.868 5.476 6.41.934-4.878 4.134 1.478 5.545z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 mb-1">
                    {product.reviews > 0 ? product.reviews : reviewCount}{" "}
                    {product.reviews === 1 ? "review" : "reviews"}
                  </p>
                  <p className="text-sm font-medium">${product.price}</p>
                </div>
              </a>
            ))}
          </div>
        </FilterSection>
      </div>
    </aside>
  );
};

export default FilterSidebar;
