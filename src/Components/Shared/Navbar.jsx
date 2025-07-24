import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaHeart,
  FaFacebook,
  FaInstagram,
  FaUser,
  FaTwitter,
  FaPinterest,
  FaPinterestP,
  FaArrowRight,
  FaArrowLeft,
} from "react-icons/fa";
import { MdLocalMall } from "react-icons/md";
import { ChevronDown } from "lucide-react";
import { FaShoppingCart } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { setCartOpen, toggleCartOpen } from "../../redux/slices/cartSlice";
import { ref, get, child } from "firebase/database";
import { database } from "../../firebase/firebaseConfig";

const MegaMenuSection = ({ title, items }) => {
  const navigate = useNavigate();

  const handleItemClick = async (itemName) => {
    try {
      const dbRef = ref(database);
      const snapshot = await get(child(dbRef, "products"));
      if (snapshot.exists()) {
        const categories = snapshot.val();

        for (let category in categories) {
          const products = categories[category];
          for (let productId in products) {
            if (
              products[productId].name?.toLowerCase() === itemName.toLowerCase()
            ) {
              // If a match is found, navigate to the product page
              console.log(`Navigating to product: ${products[productId].name}`);
              navigate(`/products/${productId}`);
              return;
            }
          }
        }
        // alert("Product not found in database.");
        navigate("/not-found");
      } else {
        console.error("No data found.");
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  return (
    <div>
      <h4 className="font-bold mb-2">{title}</h4>
      <ul className="space-y-1 leading-6">
        {items.map((item) => (
          <li
            key={item}
            onClick={() => handleItemClick(item)}
            className="hover:text-white cursor-pointer"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

const dropdownAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: { duration: 0.25, ease: "easeInOut" },
};

const MENUS = {
  bath: {
    images: ["/Navbar/BothSoap1.avif", "/Navbar/BothSoap2.avif"],
    sections: [
      {
        title: "Fairness Soap",
        items: [
          "Aloe Vera Soap",
          "Natural Soap",
          "Shea Butter Soap",
          "Luscious Soap",
          "Scrubbing Soaps",
        ],
      },
      {
        title: "Deep Clean Soap",
        items: [
          "Argan Soap",
          "Organic Soap",
          "Soothing Soap",
          "Joyful Skin Soap",
          "The Bro Bars",
        ],
      },
      {
        title: "Skin Whiten Soap",
        items: [
          "Body Scrub Soap",
          "Papaya Soap",
          "Bright Soap",
          "Beauty Bars",
          "Thy Skin Soap",
        ],
      },
    ],
  },
  collections: {
    images: ["/Navbar/collections.avif"],
    sections: [
      {
        title: "Ayurvedic Soap",
        items: [
          "Citrus Soap",
          "Pink Clay Soap",
          "Laced Soap",
          "Caress Soaps",
          "Crystal Soap",
          "Papaya Soap",
        ],
      },
      {
        title: "Handmade Soap",
        items: [
          "Herbal Soap",
          "Rose & Lavendar Soap",
          "Artisanal Soap",
          "Essentials Soap",
          "Blow Soap",
          "Orange Soap",
        ],
      },
      {
        title: "Herbal Soap",
        items: [
          "Lavender Soap",
          "Rose Soap",
          "Skinsoft Soap",
          "Chic Soap",
          "NatureGlow Soap",
          "Neem Soap",
        ],
      },
      {
        title: "Luxury Soap",
        items: [
          "Mixed Herb Soap",
          "Sandal Wood Soap",
          "Petal Gleam Soap",
          "Striking Soap",
          "Skintect Bars",
          "Honey Soap",
        ],
      },
    ],
  },
};

const Navbar = () => {
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileSubMenu, setMobileSubMenu] = useState(null);
  const timerRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeMenu, setActiveMenu] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [menuLevel, setMenuLevel] = useState(0);

  useEffect(() => {
    if (mobileMenu) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenu]);

  const { cartItems = [] } = useSelector((state) => state.cart || {});

  const handleMouseEnter = (menu) => {
    clearTimeout(timerRef.current);
    setOpenMenu(menu);
  };
  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => setOpenMenu(null), 300);
  };

  const navLinkClass = (name) =>
    `hover:text-[#f9ddda] transition cursor-pointer ${
      location.pathname.toLowerCase().includes(name.toLowerCase())
        ? "text-[#f9ddda]"
        : "text-black"
    }`;

  const handleItemClick = async (itemName) => {
    try {
      const dbRef = ref(database);
      const snapshot = await get(child(dbRef, "products"));
      if (snapshot.exists()) {
        const categories = snapshot.val();

        for (let category in categories) {
          const products = categories[category];
          for (let productId in products) {
            if (
              products[productId].name?.toLowerCase() === itemName.toLowerCase()
            ) {
              // If a match is found, navigate to the product page
              console.log(`Navigating to product: ${products[productId].name}`);
              navigate(`/products/${productId}`);
              return;
            }
          }
        }
        // alert("Product not found in database.");
        navigate("/not-found");
      } else {
        console.error("No data found.");
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  const toggleMobileSubMenu = (menu) =>
    setMobileSubMenu(mobileSubMenu === menu ? null : menu);

  const handleClick = (path = "/") => {
    setOpenMenu(null);
    setMobileMenu(false);
    setMobileSubMenu(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate(path.toLowerCase);
  };

  return (
    <nav className="bg-white shadow-sm relative z-50">
      {/* Top nav */}
      <div className="max-w-[1200px] hidden md:hidden lg:flex mx-auto px-4  justify-between items-center h-16">
        {/* Desktop Left Menu */}
        <ul className="hidden lg:flex items-center gap-6 text-sm font-semibold">
          <li
            onClick={() => {
              handleClick();
              navigate("/");
            }}
          >
            <Link to="/">HOME</Link>
          </li>

          {/* Bath Soap */}
          <li
            className="relative group"
            onMouseEnter={() => handleMouseEnter("bath")}
            onMouseLeave={handleMouseLeave}
          >
            <button className="flex items-center gap-1">
              <span className={navLinkClass("BATH")}>BATH SOAP</span>
              <motion.span
                animate={{ rotate: openMenu === "bath" ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={12} className="mt-1 mb-1" />
              </motion.span>
            </button>
            <AnimatePresence>
              {openMenu === "bath" && (
                <motion.div
                  {...dropdownAnimation}
                  className="absolute left-8 top-full w-[85vw] max-w-[1000px] bg-[#c2d8e0] shadow-lg px-10 py-10 mt-5.5 grid grid-cols-5 gap-6 text-sm z-50 rounded"
                >
                  <div>
                    <img
                      src={MENUS.bath.images[0]}
                      className="w-full h-40 object-cover rounded shadow"
                    />
                  </div>
                  {MENUS.bath.sections.map((section, i) => (
                    <MegaMenuSection
                      key={i}
                      title={section.title}
                      items={section.items}
                    />
                  ))}
                  <div>
                    <img
                      src={MENUS.bath.images[1]}
                      className="w-full h-40 object-cover rounded shadow"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>

          {/* Collections */}
          <li
            className="relative group"
            onMouseEnter={() => handleMouseEnter("collections")}
            onMouseLeave={handleMouseLeave}
          >
            <button className="flex items-center gap-1">
              <span
                onClick={() => {
                  navigate("/collections");
                }}
              >
                COLLECTIONS
              </span>
              <motion.span
                animate={{ rotate: openMenu === "collections" ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={12} className="mt-1 mb-1" />
              </motion.span>
            </button>
            <AnimatePresence>
              {openMenu === "collections" && (
                <motion.div
                  {...dropdownAnimation}
                  className="absolute -translate-x-20 top-full w-[85vw] max-w-[1000px] bg-[#c2d8e0] shadow-lg mt-5.5 px-6 py-6 rounded grid grid-cols-5 gap-6 text-sm z-50"
                >
                  {MENUS.collections.sections.map((section, i) => (
                    <MegaMenuSection
                      key={i}
                      title={section.title}
                      items={section.items}
                    />
                  ))}
                  <div>
                    <img
                      src={MENUS.collections.images[0]}
                      className="w-full h-40 object-cover rounded shadow"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        </ul>

        {/* Logo */}

        <Link
          to="/"
          className="hidden md:hidden lg:block no-underline text-2xl font-bold"
        >
          Rudy.
        </Link>

        {/* Desktop Right */}
        <ul className="hidden lg:flex items-center gap-6 text-sm font-semibold">
          <li
            className="relative group"
            onMouseEnter={() => handleMouseEnter("pages")}
            onMouseLeave={handleMouseLeave}
          >
            <button className="flex items-center gap-1">
              <span className={navLinkClass("PAGES")}>PAGES</span>
              <motion.span
                animate={{ rotate: openMenu === "pages" ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={12} className="mt-1 mb-1" />
              </motion.span>
            </button>
            <AnimatePresence>
              {openMenu === "pages" && (
                <motion.div
                  {...dropdownAnimation}
                  className="absolute right-0 top-full mt-5.5 w-30 bg-[#c2d8e0] py-2 px-3 text-sm text-black shadow rounded z-50"
                >
                  <ul className="space-y-2">
                    <li>
                      <Link
                        to="/about"
                        onClick={() => handleClick("ABOUT")}
                        className="hover:text-white transition"
                      >
                        About
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/faq"
                        onClick={() => handleClick("FAQ")}
                        className="hover:text-white transition"
                      >
                        FAQ
                      </Link>
                    </li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </li>

          <li
            onClick={() => {
              handleClick();
              navigate("/contact");
            }}
          >
            <Link to="/contact">CONTACT</Link>
          </li>

          <li className="relative">
            <Link
              to="/profile"
              className="relative hover:text-[#ffdac1] transition"
            >
              <FaUser size={18} />
            </Link>
          </li>
          <li className="relative">
            <Link
              to="/wishlist"
              className="relative hover:text-[#ffdac1] transition"
            >
              <FaHeart size={18} />
            </Link>
          </li>

          <li className="relative mt-1">
            <button
              onClick={() => {
                dispatch(setCartOpen(true));
                console.log("Cart icon clicked");
              }}
              className="relative hover:text-[#ffdac1] transition"
            >
              <FaShoppingCart size={18} />
              <span className="absolute -top-2 left-4.5 bg-black text-white text-[9px] rounded-full px-1 min-w-[13px] text-center">
                {cartItems.length > 99 ? "99+" : cartItems.length}
              </span>
            </button>
          </li>
        </ul>
      </div>

      {/* Mobile Top Bar */}
      <div className="lg:hidden bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 h-16">
          <button onClick={() => setMobileMenu(true)}>
            <FaBars size={22} />
          </button>
          <span className="text-2xl font-bold">Rudy.</span>
          <div className="flex gap-4">
            <Link to="/wishlist">
              <FaHeart />
            </Link>
            <button>
              <FaShoppingCart
                onClick={() => {
                  dispatch(toggleCartOpen(true));
                  // console.log("Cart icon clicked");
                }}
              />
              <span className="absolute top-3 right-1 bg-black text-white text-[9px] rounded-full px-1 min-w-[13px] text-center">
                {cartItems.length > 99 ? "99+" : cartItems.length}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {mobileMenu && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-[90]"
              onClick={() => setMobileMenu(false)}
            />

            {/* Sidebar Panel */}
            <motion.section
              key="mobile-menu"
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="lg:hidden fixed top-0 left-0 w-full max-w-[320px] h-full bg-white shadow-2xl py-15 z-[100] flex flex-col overflow-hidden"
            >
              {/* Main Menu */}
              {menuLevel === 0 && (
                <div className="flex flex-col h-full">
                  <ul className="flex-1 px-6 py-4 space-y-4 text-[17px] font-semibold text-gray-800 overflow-y-auto">
                    <li>
                      <Link
                        to="/"
                        onClick={() => setMobileMenu(false)}
                        className="hover:text-primary"
                      >
                        Home
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          setActiveMenu("bath");
                          setMenuLevel(1);
                        }}
                        className="flex justify-between items-center w-full hover:text-primary"
                      >
                        Bath Soap <FaArrowRight />
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          setActiveMenu("collections");
                          setMenuLevel(1);
                        }}
                        className="flex justify-between items-center w-full hover:text-primary"
                      >
                        Collections <FaArrowRight />
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          setActiveMenu("pages");
                          setMenuLevel(1);
                        }}
                        className="flex justify-between items-center w-full hover:text-primary"
                      >
                        Pages <FaArrowRight />
                      </button>
                    </li>
                    <li>
                      <Link
                        to="/contact"
                        onClick={() => setMobileMenu(false)}
                        className="hover:text-primary"
                      >
                        Contact
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/profile"
                        onClick={() => setMobileMenu(false)}
                        className="hover:text-primary"
                      >
                        Profile
                      </Link>
                    </li>
                  </ul>

                  <div className="mt-auto p-4 border-t">
                    <button
                      onClick={() => navigate("/login")}
                      className="flex items-center gap-3 font-medium text-gray-700 hover:text-black"
                    >
                      <FaUser className="text-lg" />
                      <span className="text-base font-semibold">Log in</span>
                    </button>
                    <div className="mt-4 flex items-center gap-4 text-xl text-gray-600">
                      <FaTwitter className="hover:text-black" />
                      <FaFacebook className="hover:text-black" />
                      <FaPinterest className="hover:text-black" />
                      <FaInstagram className="hover:text-black" />
                    </div>
                  </div>
                </div>
              )}

              {/* Submenu */}
              {menuLevel === 1 && (
                <motion.div
                  key="submenu"
                  initial={{ x: "100%", opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: "100%", opacity: 0 }}
                  // transition={{ type: "spring", stiffness: 90, damping: 18 }}
                  className="absolute top-0 left-0 w-full max-w-[360px] h-full bg-white flex flex-col shadow-2xl rounded-tr-2xl rounded-br-2xl overflow-hidden mb-30"
                >
                  {/* Header */}
                  <div className="flex items-center gap-3 px-5 py-4 border-b bg-gray-100 shadow">
                    <button
                      onClick={() => setMenuLevel(0)}
                      className="text-gray-700 hover:text-primary text-xl"
                      aria-label="Back"
                    >
                      <FaArrowLeft />
                    </button>
                    <h3 className="text-lg font-bold capitalize text-gray-900">
                      {activeMenu}
                    </h3>
                  </div>

                  {/* Top Image */}
                  {MENUS[activeMenu]?.images?.[0] && (
                    <div className="px-5 pt-4">
                      <img
                        src={MENUS[activeMenu].images[0]}
                        alt="Top visual"
                        className="w-full h-32 object-cover rounded-xl shadow"
                      />
                    </div>
                  )}

                  {/* Sections */}
                  <div className="flex-1 overflow-y-auto px-6 py-5 space-y-8">
                    {MENUS[activeMenu]?.sections?.map((section, i) => (
                      <div key={i}>
                        <h4 className="text-[17px] font-semibold text-gray-800 mb-3">
                          {section.title}
                        </h4>
                        <ul className="space-y-2 text-[15px] text-gray-600">
                          {section.items.map((item) => (
                            <li
                              key={item}
                              onClick={() => handleItemClick(item)}
                              className="hover:text-primary cursor-pointer transition-colors"
                            >
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* Bottom Image */}
                  {MENUS[activeMenu]?.images?.[1] && (
                    <div className="px-5 pb-4">
                      <img
                        src={MENUS[activeMenu].images[1]}
                        alt="Bottom visual"
                        className="w-full h-32 object-cover rounded-xl shadow"
                      />
                    </div>
                  )}

                  {/* Footer */}
                  <div className="p-5 border-t mt-auto">
                    <button
                      onClick={() => navigate("/login")}
                      className="flex items-center gap-3 text-[15px] text-gray-700 hover:text-black font-medium"
                    >
                      <FaUser className="text-xl" />
                      <span className="font-semibold">Log in</span>
                    </button>
                    <div className="mt-4 flex items-center gap-5 text-2xl text-gray-600">
                      <FaTwitter className="hover:text-black transition" />
                      <FaFacebook className="hover:text-black transition" />
                      <FaPinterest className="hover:text-black transition" />
                      <FaInstagram className="hover:text-black transition" />
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.section>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
