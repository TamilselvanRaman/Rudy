import React, { useState, useEffect } from "react";
import FilterSidebar from "../components/Filter/FilterSidebar";
import ProductCard from "../Components/Product/ProductCard";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, List } from "lucide-react";
import { FiFilter } from "react-icons/fi";
import MobileFilterDrawer from "../Components/Filter/MobileFilterDrawer";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/slices/productsSlice";
import {
  selectAllProducts,
  selectProductLoading,
} from "../redux/slices/productsSlice";
import BannerComponent from "../Components/Shared/BannerComponent";

const Products = () => {
  const dispatch = useDispatch();
  const allProducts = useSelector(selectAllProducts);
  const loading = useSelector(selectProductLoading);
  const status = loading ? "loading" : "succeeded";

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [sortOption, setSortOption] = useState("featured");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    availability: [],
    price: { min: "", max: "" },
    vendor: [],
    flavour: [],
    weight: [],
    productType: [],
    moreFilters: [],
  });

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (status !== "succeeded") return;

    let filtered = [...allProducts];
    const minPrice = parseFloat(filters.price.min) || 0;
    const maxPrice = parseFloat(filters.price.max) || Infinity;

    filtered = filtered.filter((p) => {
      const price = Number(p.price) || 0;
      return price >= minPrice && price <= maxPrice;
    });

    if (filters.availability.length) {
      filtered = filtered.filter((p) =>
        filters.availability.includes(Number(p.quantity) > 0 ? "in" : "out")
      );
    }

    if (filters.vendor.length) {
      filtered = filtered.filter((p) =>
        filters.vendor.includes(p.vendor || "")
      );
    }

    if (filters.flavour.length) {
      filtered = filtered.filter((p) =>
        Array.isArray(p.flavour)
          ? p.flavour.some((f) => filters.flavour.includes(f))
          : filters.flavour.includes(p.flavour)
      );
    }

    if (filters.weight.length) {
      filtered = filtered.filter((p) =>
        Array.isArray(p.weight)
          ? p.weight.some((w) => filters.weight.includes(w))
          : filters.weight.includes(p.weight)
      );
    }

    if (filters.productType.length) {
      filtered = filtered.filter((p) =>
        filters.productType.includes(p.type || "")
      );
    }

    if (filters.moreFilters.length) {
      filtered = filtered.filter((p) => {
        const tags = Array.isArray(p.tags)
          ? p.tags
          : typeof p.tags === "string"
          ? p.tags.split(",").map((t) => t.trim())
          : [];
        return tags.some((tag) => filters.moreFilters.includes(tag));
      });
    }

    filtered.sort((a, b) => {
      const nameA = a.name?.toLowerCase() || "";
      const nameB = b.name?.toLowerCase() || "";

      switch (sortOption) {
        case "a-z":
          return nameA.localeCompare(nameB);
        case "z-a":
          return nameB.localeCompare(nameA);
        case "low-high":
          return (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0);
        case "high-low":
          return (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0);
        case "old-new":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "new-old":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "best-selling":
          return (b.sales || 0) - (a.sales || 0);
        case "featured":
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [filters, allProducts, sortOption, status]);

  const getCounts = () => {
    const counts = {
      availability: { in: 0, out: 0 },
      vendor: {},
      flavour: {},
      weight: {},
      productType: {},
      moreFilters: {},
    };

    allProducts.forEach((p) => {
      const quantity = Number(p.quantity) || 0;
      const availKey = quantity > 0 ? "in" : "out";
      counts.availability[availKey]++;

      if (p.vendor)
        counts.vendor[p.vendor] = (counts.vendor[p.vendor] || 0) + 1;

      const flavours = Array.isArray(p.flavour) ? p.flavour : [p.flavour];
      flavours.forEach((f) => {
        if (f) counts.flavour[f] = (counts.flavour[f] || 0) + 1;
      });

      const weights = Array.isArray(p.weight) ? p.weight : [p.weight];
      weights.forEach((w) => {
        if (w) counts.weight[w] = (counts.weight[w] || 0) + 1;
      });

      if (p.type)
        counts.productType[p.type] = (counts.productType[p.type] || 0) + 1;

      const tags = Array.isArray(p.tags)
        ? p.tags
        : typeof p.tags === "string"
        ? p.tags.split(",").map((t) => t.trim())
        : [];
      tags.forEach((tag) => {
        if (tag) counts.moreFilters[tag] = (counts.moreFilters[tag] || 0) + 1;
      });
    });

    return counts;
  };

  const maxPrice = allProducts.reduce(
    (max, p) => Math.max(max, Number(p.price) || 0),
    0
  );

  const onFilterChange = (newFilters) =>
    setFilters((prev) => ({ ...prev, ...newFilters }));

  const onPriceChange = (price) => setFilters((prev) => ({ ...prev, price }));

  return (
    <div className="flex flex-col gap-6">
      <BannerComponent title="Our Products" subtitle="Home / Products" />

      <div className="flex justify-between items-center px-4 md:hidden mt-4">
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="text-sm font-medium text-[#2C1C14] flex items-center gap-2"
        >
          <FiFilter className="w-5 h-5 mt-1 -mr-0.5  text-[#2C1C14]" />
          <span className="font-bold text-sm">Filter and Sort</span>
        </button>
        <span className="text-sm font-bold text-[#2C1C14]">
          {filteredProducts.length} Products
        </span>
      </div>

      <MobileFilterDrawer
        isOpen={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        filters={filters}
        setFilters={setFilters}
        allProducts={allProducts}
      />

      <div className="flex flex-col md:flex-row gap-6 px-4 md:px-10 pb-10 ml-0 md:ml-20 mr-0 md:mr-20 mt-10">
        <aside className="hidden md:block w-full md:w-72 md:sticky md:top-28 self-start">
          <FilterSidebar
            filters={filters}
            onFilterChange={onFilterChange}
            counts={getCounts()}
            maxPrice={maxPrice}
            onPriceChange={onPriceChange}
            products={allProducts}
          />
        </aside>

        <main className="flex-1 flex flex-col gap-4">
          <div className="hidden md:flex justify-between items-center px-4 py-3 bg-[#FAEFE4] shadow-sm mb-6">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded border transition-colors ${
                  viewMode === "grid"
                    ? "bg-white border-[#EED7CD] shadow-sm"
                    : "border-gray-300 hover:bg-white"
                }`}
              >
                <LayoutGrid className="w-5 h-5 text-[#2C1C14]" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded border transition-colors ${
                  viewMode === "list"
                    ? "bg-white border-[#EED7CD] shadow-sm"
                    : "border-gray-300 hover:bg-white"
                }`}
              >
                <List className="w-5 h-5 text-[#2C1C14]" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <label
                htmlFor="sort"
                className="text-sm font-medium text-[#2C1C14]"
              >
                Sort by:
              </label>
              <select
                id="sort"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="appearance-none border border-[#EED7CD] text-sm text-[#2C1C14] rounded-md px-3 py-1.5 bg-white focus:outline-none"
              >
                <option value="featured">Featured</option>
                <option value="best-selling">Best selling</option>
                <option value="a-z">Alphabetically, A-Z</option>
                <option value="z-a">Alphabetically, Z-A</option>
                <option value="low-high">Price, low to high</option>
                <option value="high-low">Price, high to low</option>
                <option value="old-new">Date, old to new</option>
                <option value="new-old">Date, new to old</option>
              </select>
              <span className="ml-3 font-medium">
                {filteredProducts.length} of {allProducts.length} Products
              </span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={viewMode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
                  : "grid grid-cols-1 md:grid-cols-2 gap-6"
              }
            >
              {filteredProducts.length === 0 ? (
                <p className="text-gray-500 col-span-full text-center">
                  No products found.
                </p>
              ) : (
                filteredProducts.map((p) => (
                  <ProductCard
                    key={p.id || p._id}
                    product={p}
                    viewMode={viewMode}
                  />
                ))
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default Products;
