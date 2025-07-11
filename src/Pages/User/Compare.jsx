import React, { useEffect, useState } from "react";
import { ref, get, remove } from "firebase/database";
import { database } from "../../firebase/firebaseConfig";
import { FaTrash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Compare = () => {
  const [compareItems, setCompareItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompareItems = async () => {
      try {
        const snapshot = await get(ref(database, "compare"));
        const data = snapshot.val();
        if (data) {
          const itemsArray = Object.entries(data).map(([id, item]) => ({
            id,
            ...item,
          }));
          setCompareItems(itemsArray);
        } else {
          setCompareItems([]);
        }
      } catch (error) {
        console.error("Failed to fetch compare items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompareItems();
  }, []);

  const handleRemove = async (id) => {
    try {
      await remove(ref(database, `compare/${id}`));
      setCompareItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  return (
    <div className="bg-white">
      {/* Banner */}
      <div
        className="bg-cover bg-center h-64 flex flex-col justify-center items-center text-black"
        style={{
          backgroundImage: `url('/banner-image.jpg')`,
          backgroundColor: "rgba(255,255,255,0.4)",
          backgroundBlendMode: "lighten",
        }}
      >
        <h1 className="text-3xl font-bold uppercase">COMPARE</h1>
        <p className="text-sm mt-2">Home / Compare</p>
      </div>

      {/* Compare Items */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {loading ? (
          <p className="text-center text-lg">Loading...</p>
        ) : compareItems.length === 0 ? (
          <p className="text-center text-gray-500">No items in comparison.</p>
        ) : (
          <div className="flex flex-wrap justify-start gap-x-3 gap-y-6">
            <AnimatePresence>
              {compareItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="w-[260px] border border-gray-300 p-4 text-center shadow-sm hover:shadow-md transition bg-white rounded-lg"
                >
                  <div className="mb-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-52 object-contain mx-auto"
                    />
                  </div>
                  <h3
                    onClick={() => item.id && navigate(`/products/${item.id}`)}
                    className="text-lg mb-2 font-semibold tracking-wide text-gray-800 cursor-pointer hover:text-[#ffd7bc] transition"
                  >
                    {item.name}
                  </h3>
                  <p className="text-md text-gray-700 mb-3">$ {item.price}</p>
                  <p
                    onClick={() => item.id && navigate(`/products/${item.id}`)}
                    className="text-sm font-semibold tracking-wide mb-3 text-gray-800 cursor-pointer hover:scale-110 hover:text-[#ffd7bc] transition"
                  >
                    SELECT OPTIONS
                  </p>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-gray-500 hover:text-[#ffd7bc] transition transform hover:scale-110 cursor-pointer"
                    title="Remove item"
                  >
                    <FaTrash size={18} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default Compare;
