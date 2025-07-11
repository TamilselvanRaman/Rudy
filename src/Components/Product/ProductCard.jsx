import React, { useEffect, useState } from "react";
import { Eye, Heart, ShoppingCart, Layers, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/slices/cartSlice";
import { ref, set } from "firebase/database";
import { database } from "../../firebase/firebaseConfig";

const iconContainerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const iconItemVariants = {
  hidden: { opacity: 0, x: 20 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      type: "tween",
      ease: "easeInOut",
      duration: 0.3,
    },
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: {
      type: "tween",
      ease: "easeInOut",
      duration: 0.3,
    },
  },
};

const ProductCard = ({ product, onAddToCart, viewMode }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredIconIndex, setHoveredIconIndex] = useState(null);
  const [randomStars, setRandomStars] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  const currentUser = useSelector((state) => state.auth.currentUser);

  useEffect(() => {
    setRandomStars(Math.floor(Math.random() * 3) + 3);
    setReviewCount(Math.floor(Math.random() * 5) + 1);
  }, []);

  const handleNavigate = () => {
    navigate(`/products/${product.id}`);
  };

  const iconButtons = [
    {
      label: "Compare",
      icon: <Layers size={16} />,
      onClick: async () => {
        try {
          await set(ref(database, `compare/${product.id}`), {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images?.[0] || "/placeholder.jpg",
          });
          navigate("/compare");
        } catch (error) {
          console.error("Error adding to compare:", error);
        }
      },
    },
    {
      label: "View",
      icon: <Eye size={16} />,
      onClick: () => navigate(`/products/${product.id}`),
    },
    {
      label: "Add to Cart",
      icon: <ShoppingCart size={16} />,
      onClick: (e) => {
        e.stopPropagation();
        if (onAddToCart) onAddToCart(product);
        dispatch(
          addToCart({
            id: product.id,
            name: product.name,
            price: parseFloat(product.price),
            quantity: 1,
            weight: product.defaultWeight || "100g",
            flavour: product.defaultFlavour || "Original",
            image: product.images?.[0] || "",
          })
        );
      },
    },
    {
      label: "Wishlist",
      icon: <Heart size={16} />,
      onClick: async (e) => {
        e.stopPropagation();
        if (!currentUser) {
          alert("Login required to add to wishlist.");
          return;
        }

        try {
          await set(ref(database, `wishlist/${currentUser.uid}/${product.id}`), {
            name: product.name,
            price: product.price,
            image: product.images?.[0] || "",
          });
        } catch (err) {
          console.error("Error adding to wishlist:", err);
        }
      },
    },
  ];

  // ✅ LIST VIEW
  if (viewMode === "list") {
    return (
      <motion.div
        className="w-full flex gap-6 items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setHoveredIconIndex(null);
        }}
        onClick={handleNavigate}
      >
        <div className="relative overflow-hidden rounded-lg w-48 h-48 min-w-[10rem]">
          <motion.img
            src={product.images?.[0]}
            alt={product.name}
            className="w-full h-full object-cover"
            animate={{ scale: isHovered ? 1.7 : 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
          <AnimatePresence>
            {isHovered && (
              <motion.div
                className="absolute top-7 right-3 flex flex-col gap-2"
                variants={iconContainerVariants}
                initial="hidden"
                animate="show"
                exit="hidden"
              >
                {iconButtons.map((btn, index) => (
                  <motion.div
                    key={index}
                    className="relative flex items-center"
                    onMouseEnter={() => setHoveredIconIndex(index)}
                    onMouseLeave={() => setHoveredIconIndex(null)}
                  >
                    <motion.button
                      className="bg-[#FAEFE4] p-1 rounded shadow text-xs w-7 h-7 flex items-center justify-center"
                      variants={iconItemVariants}
                      whileHover={{ scale: 1.1 }}
                      onClick={(e) => btn.onClick(e)}
                    >
                      {btn.icon}
                    </motion.button>
                    <AnimatePresence>
                      {hoveredIconIndex === index && (
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="absolute right-full mr-3 flex items-center"
                        >
                          <div className="relative bg-[#FAEFE4] text-xs text-gray-800 px-3 py-1 rounded shadow whitespace-nowrap">
                            {btn.label}
                            <div className="absolute right-0 top-1/2 transform translate-x-full -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-4 border-t-transparent border-b-transparent border-l-[#FAEFE4]" />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex-1">
          <h3 className="text-base font-semibold text-gray-800">
            {product.name}
          </h3>
          <div className="flex items-center mt-1 gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={18}
                className={
                  i < randomStars ? "text-[#e4d8cf] fill-[#e4d8cf]" : "text-gray-300"
                }
                strokeWidth={1}
              />
            ))}
            <span className="text-sm text-gray-500 ml-2">
              {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
            </span>
          </div>
          <div className="text-lg font-semibold text-gray-700 mt-1">
            ${!isNaN(product.price) ? Number(product.price).toFixed(2) : "0.00"}
          </div>
        </div>
      </motion.div>
    );
  }

  // ✅ GRID VIEW
  return (
    <motion.div
      className="relative group cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setHoveredIconIndex(null);
      }}
    >
      <div className="overflow-hidden rounded-lg" onClick={handleNavigate}>
        <motion.img
          src={product.images?.[0]}
          alt={product.name}
          className="w-full h-72 object-cover"
          animate={{ scale: isHovered ? 1.7 : 1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute right-5 top-18 flex flex-col gap-2"
            variants={iconContainerVariants}
            initial="hidden"
            animate="show"
            exit="hidden"
          >
            {iconButtons.map((btn, index) => (
              <motion.div
                key={index}
                className="relative flex items-center"
                onMouseEnter={() => setHoveredIconIndex(index)}
                onMouseLeave={() => setHoveredIconIndex(null)}
              >
                <motion.button
                  className="bg-[#FAEFE4] p-2 rounded shadow flex items-center justify-center"
                  variants={iconItemVariants}
                  whileHover={{ scale: 1.1 }}
                  onClick={(e) => btn.onClick(e)}
                >
                  {btn.icon}
                </motion.button>
                <AnimatePresence>
                  {hoveredIconIndex === index && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="absolute right-full mr-3 flex items-center"
                    >
                      <div className="relative bg-[#FAEFE4] text-xs text-gray-800 px-3 py-1 rounded shadow whitespace-nowrap">
                        {btn.label}
                        <div className="absolute right-0 top-1/2 transform translate-x-full -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-4 border-t-transparent border-b-transparent border-l-[#FAEFE4]" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-center mt-4 px-2" onClick={handleNavigate}>
        <h3 className="text-base font-semibold text-gray-800">{product.name}</h3>
        <div className="flex justify-center items-center mt-1 gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={18}
              className={
                i < randomStars ? "text-[#e4d8cf] fill-[#e4d8cf]" : "text-gray-300"
              }
              strokeWidth={1}
            />
          ))}
          <span className="text-sm text-gray-500 ml-2">
            {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
          </span>
        </div>
        <div className="font-semibold text-lg text-gray-700 mt-1">
          ${!isNaN(product.price) ? Number(product.price).toFixed(2) : "0.00"}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
