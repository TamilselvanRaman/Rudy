import React, { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { database } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Collections = () => {
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snapshot = await get(ref(database, "products"));
        const data = snapshot.val();
        setProducts(data || {});
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
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
        <h1 className="text-3xl font-bold uppercase">ALL COLLECTIONS</h1>
        <p className="text-lg mt-2">Home / collections</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 bg-white">
        {loading ? (
          <p className="text-center text-lg">Loading...</p>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            {Object.entries(products).map(([category, items]) => {
              const firstItem = Object.values(items)[0];
              const imageUrl = firstItem?.images?.[0] || "/placeholder.jpg";

              return (
                <motion.div
                  key={category}
                  className="group p-6 text-center"
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.img
                    src={imageUrl}
                    alt={category}
                    className="w-full h-56 object-contain mx-auto mb-6 rounded group-hover:scale-105 transition duration-300"
                    whileHover={{ scale: 1.05 }}
                  />
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-[#ef7f7f] transition">
                    {category}
                  </h3>
                  <p className="text-sm text-gray-600 mb-5">
                    {Object.keys(items).length} Items
                  </p>
                  <button
                    onClick={() => navigate("/products")}
                    className="bg-[#fcdada] hover:bg-[#d9ecf7] hover:text-white text-black px-5 py-2.5 font-semibold transition"
                  >
                    Shop Now
                  </button>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Collections;
