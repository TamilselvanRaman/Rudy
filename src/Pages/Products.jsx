import React, { useEffect, useState } from "react";
import { ref, get, child } from "firebase/database";
import { database } from "../firebaseConfig";
import FilterPanelContainer from "../Components/FilterPanelContainer";
import { Eye, Heart, ShoppingCart, Expand } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filters, setFilters] = useState({
    brand: [],
    flavour: [],
    weight: [],
  });
  const [ratings, setRatings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dbRef = ref(database);
        const snapshot = await get(child(dbRef, "products"));
        if (snapshot.exists()) {
          const rawData = Object.values(snapshot.val());

          const allProducts = rawData.flatMap((category) => {
            const categoryName = category.id;
            return Object.entries(category)
              .filter(([key]) => key !== "id")
              .map(([key, product]) => ({
                ...product,
                id: key,
                category: categoryName,
              }));
          });

          setProducts(allProducts);
          setFilteredProducts(allProducts);

          // Generate random ratings
          const randomRatings = allProducts.map(() => ({
            rating: Math.floor(Math.random() * 4) + 2,
            reviews: Math.floor(Math.random() * 20) + 1,
          }));

          setRatings(randomRatings);
        } else {
          console.log("No data found");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchData();
  }, []);

  const applyFilters = () => {
    let filtered = [...products];

    if (filters.brand.length > 0) {
      filtered = filtered.filter((p) => filters.brand.includes(p.vendor));
    }

    if (filters.flavour.length > 0) {
      filtered = filtered.filter(
        (p) =>
          Array.isArray(p.flavour) &&
          p.flavour.some((f) => filters.flavour.includes(f))
      );
    }

    if (filters.weight.length > 0) {
      filtered = filtered.filter(
        (p) =>
          Array.isArray(p.weight) &&
          p.weight.some((w) => filters.weight.includes(w))
      );
    }

    setFilteredProducts(filtered);
  };

  return (

    <div>
      {/* Banner */}
      <div
        className="bg-cover bg-center h-64 flex flex-col justify-center items-center text-black"
        style={{
          backgroundImage: `url('/banner-image.jpg')`,
          backgroundColor: "rgba(255,255,255,0.4)",
          backgroundBlendMode: "lighten",
        }}
      >
        <h1 className="text-3xl font-bold">ACCOUNT</h1>
        <p className="text-sm mt-2">Home / Account</p>
      </div>
   


    <div className="flex flex-col md:flex-row gap-4 w-full">
      <FilterPanelContainer
        filters={filters}
        setFilters={setFilters}
        applyFilters={applyFilters}
      />

      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Products</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <div key={index} className="group w-full max-w-sm mx-auto">
              <div
                onClick={() => navigate(`/product/${product.id}`)}
                className="relative overflow-hidden rounded-xl"
              >
                <img
                  src={product.images?.[0]}
                  alt={product.name}
                  className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-150"
                />

                <div className="absolute top-4 right-4 flex flex-col gap-2 transform translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                  <button className="bg-white p-2 rounded shadow hover:bg-gray-100">
                    <Expand className="w-4 h-4" />
                  </button>
                  <button className="bg-white p-2 rounded shadow hover:bg-gray-100">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="bg-white p-2 rounded shadow hover:bg-gray-100">
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                  <button className="bg-white p-2 rounded shadow hover:bg-gray-100">
                    <Heart className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mt-3 text-center">
                <h3 className="text-sm font-medium text-gray-700 group-hover:text-pink-600 transition">
                  {product.name || "Unnamed Product"}
                </h3>

                <div className="flex justify-center items-center text-xs text-gray-500 mt-1">
                  <div className="text-pink-400 text-sm flex">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <span
                          key={i}
                          className={
                            i < ratings[index]?.rating
                              ? "text-pink-500"
                              : "text-gray-300"
                          }
                        >
                          ★
                        </span>
                      ))}
                  </div>
                  <span className="ml-2">
                    {ratings[index]?.reviews} reviews
                  </span>
                </div>

                <div className="mt-1 text-black font-semibold">
                  ${product.price || "0.00"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
     </div>
  );
}

export default Products;
