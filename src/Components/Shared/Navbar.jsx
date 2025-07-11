import React, { useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaHeart,
  FaFacebook,
  FaInstagram,
  FaUser,
} from "react-icons/fa";
import { MdLocalMall } from "react-icons/md";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { setCartOpen, toggleCartOpen } from "../../redux/slices/cartSlice";

const MegaMenuSection = ({ title, items }) => (
  <div>
    <h4 className="font-bold mb-2">{title}</h4>
    <ul className="space-y-1 leading-6">
      {items.map((item) => (
        <li key={item} className="hover:text-[#f9ddda] cursor-pointer">
          {item}
        </li>
      ))}
    </ul>
  </div>
);

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
  const [mobileMenu, setMobileMenu] = useState(false);
  const [mobileSubMenu, setMobileSubMenu] = useState(null);
  const timerRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart?.cartItems || []);

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
      <div className="max-w-[1200px] mx-auto px-4 flex justify-between items-center h-16">
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

        <Link to="/" className="text-2xl font-bold">
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
                        className="hover:text-[#f9bdbb]"
                      >
                        About
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/faq"
                        onClick={() => handleClick("FAQ")}
                        className="hover:text-[#f9bdbb]"
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
          <li>
            <Link to="/wishlist">
              <FaHeart />
            </Link>
          </li>
          <li className="relative">
            <button
              onClick={() => {
                dispatch(setCartOpen(true));
                console.log("Cart icon clicked");
              }}
              className="relative hover:text-rose-400 transition"
            >
              <MdLocalMall size={18} />
              <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] rounded-full px-1 min-w-[16px] text-center">
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
              <MdLocalMall
                onClick={() => {
                  dispatch(toggleCartOpen(true));
                  console.log("Cart icon clicked");
                }}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.section
            key="mobile-menu"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3 }}
            className="lg:hidden fixed top-0 left-0 w-full max-w-[350px] h-full bg-white shadow-lg z-[100] flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <div className="text-xl font-bold">Rudy.</div>
              <button onClick={() => setMobileMenu(false)}>
                <FaTimes size={22} />
              </button>
            </div>

            {/* Main Menu */}
            <ul className="flex-1 p-4 space-y-2 text-base font-semibold overflow-y-auto">
              <li>
                <Link to="/" onClick={() => setMobileMenu(false)}>
                  HOME
                </Link>
              </li>

              {/* Bath Soap */}
              <li>
                <button
                  className="flex justify-between items-center w-full py-2"
                  onClick={() => toggleMobileSubMenu("bath")}
                >
                  BATH SOAP
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${
                      mobileSubMenu === "bath" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {mobileSubMenu === "bath" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="pl-4 py-2 bg-gray-50 rounded space-y-2"
                    >
                      {MENUS.bath.sections.map((section, i) => (
                        <div key={i}>
                          <h4 className="font-semibold text-sm">
                            {section.title}
                          </h4>
                          <ul className="ml-2 text-sm text-gray-700">
                            {section.items.map((item) => (
                              <li key={item} className="py-0.5">
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>

              {/* Collections */}
              <li>
                <button
                  className="flex justify-between items-center w-full py-2"
                  onClick={() => {
                    navigate("/collections");
                  }}
                >
                  COLLECTIONS
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${
                      mobileSubMenu === "collections" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="pl-4 py-2 bg-gray-50 rounded space-y-2"
                  >
                    {MENUS.collections.sections.map((section, i) => (
                      <div key={i}>
                        <h4 className="font-semibold text-sm">
                          {section.title}
                        </h4>
                        <ul className="ml-2 text-sm text-gray-700">
                          {section.items.map((item) => (
                            <li key={item} className="py-0.5">
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </li>

              {/* Pages */}
              <li>
                <button
                  className="flex justify-between items-center w-full py-2"
                  onClick={() => toggleMobileSubMenu("pages")}
                >
                  PAGES
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${
                      mobileSubMenu === "pages" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {mobileSubMenu === "pages" && (
                    <motion.ul
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="pl-4 py-2 space-y-1 bg-gray-50 rounded"
                    >
                      <li>
                        <Link to="/about" onClick={() => setMobileMenu(false)}>
                          About
                        </Link>
                      </li>
                      <li>
                        <Link to="/faq" onClick={() => setMobileMenu(false)}>
                          FAQ
                        </Link>
                      </li>
                    </motion.ul>
                  )}
                </AnimatePresence>
              </li>

              {/* Contact */}
              <li>
                <Link to="/contact" onClick={() => setMobileMenu(false)}>
                  CONTACT
                </Link>
              </li>
            </ul>

            {/* Bottom Social & Utility Links */}
            <div className="p-4 border-t flex flex-col gap-4">
              <Link
                to="/login"
                className="flex items-center gap-2 font-medium text-black hover:text-[#f9bdbb]"
              >
                <FaUser />
                <span>Log in</span>
              </Link>
              <div className="flex gap-4 text-lg">
                <Link to="/wishlist">
                  <FaHeart />
                </Link>
                <Link to="/">
                  <MdLocalMall />
                </Link>
                <a href="#">
                  <FaFacebook />
                </a>
                <a href="#">
                  <FaInstagram />
                </a>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
