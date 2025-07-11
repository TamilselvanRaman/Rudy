import React, { useState, useEffect } from "react";
import { FaArrowUp, FaPlus, FaMinus } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";

const Footer = () => {
  const paymentIcons = [
    { src: "/Footer/visa.png", alt: "Visa" },
    { src: "/Footer/mastercard.webp", alt: "MasterCard" },
    { src: "/Footer/american-express.png", alt: "Amex" },
    { src: "/Footer/paypal.png", alt: "PayPal" },
    { src: "/Footer/discover.png", alt: "Discover" },
  ];

  const sections = [
    {
      title: "About",
      links: [
        "Terms of Service",
        "Terms & Condition",
        "Terms of Delivery",
        "Delivery Information",
      ],
    },
    {
      title: "Information",
      links: ["About Us", "Contact Us", "Privacy Policy", "Shipping Details"],
    },
    {
      title: "Support",
      links: ["News", "Contact", "E-Mail Support", "Chat Support"],
    },
    {
      title: "Help",
      links: ["FAQ", "Catalog", "Search", "Wishlist"],
    },
  ];

  const linkMap = {
    "Terms of Service": "/terms",
    "Terms & Condition": "/terms-condition",
    "Terms of Delivery": "/delivery-terms",
    "Delivery Information": "/delivery-info",
    "About Us": "/about",
    "Contact Us": "/contact",
    "Privacy Policy": "/about",
    "Shipping Details": "/about",
    News: "/about",
    Contact: "/contact",
    "E-Mail Support": "/contact",
    "Chat Support": "/contact",
    FAQ: "/faq",
    Catalog: "/contact",
    Search: "/search",
    Wishlist: "/wishlist",
  };

  const [openSections, setOpenSections] = useState({});
  const [showScrollButton, setShowScrollButton] = useState(false);

  const toggleSection = (title) => {
    setOpenSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <footer className="bg-[#fdf3e7] text-black px-6 py-10 relative">
      <div className="max-w-7xl mx-auto">
        {/* Desktop View */}
        <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">
          {/* Logo & Slogan */}
          <div>
            <h1 className="text-3xl font-bold mb-2">Rudy.</h1>
            <p className="mb-2">Smell fresh and feel fresh.</p>
            <p className="text-sm">@_rudysoap</p>
          </div>

          {/* Footer Sections */}
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="font-semibold mb-3">{section.title}</h2>
              <ul className="space-y-2 text-sm">
                {section.links.map((link) => (
                  <li key={link}>
                    <a href={linkMap[link] || "#"} className="hover:underline">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-6">
          {/* Logo */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-1">Rudy.</h1>
            <p className="mb-1">Smell fresh and feel fresh.</p>
            <p className="text-sm">@_rudysoap</p>
          </div>

          {/* Collapsible Sections */}
          {sections.map((section) => (
            <div key={section.title}>
              <div
                className="flex justify-between items-center font-semibold cursor-pointer border-b pb-2"
                onClick={() => toggleSection(section.title)}
              >
                <span>{section.title}</span>
                {openSections[section.title] ? <FaMinus /> : <FaPlus />}
              </div>

              <AnimatePresence initial={false}>
                {openSections[section.title] && (
                  <motion.ul
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden mt-2 space-y-2 text-sm"
                  >
                    {section.links.map((link) => (
                      <li key={link}>
                        <a href="#" className="hover:underline">
                          {link}
                        </a>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Payment Icons */}
        <div className="mt-10 flex flex-wrap gap-3 justify-center">
          {paymentIcons.map(({ src, alt }) => (
            <img
              key={alt}
              src={src}
              alt={alt}
              className="w-8 h-auto object-contain"
            />
          ))}
        </div>

        {/* Copyright */}
        <p className="text-center mt-6 text-sm">All Rights Reserved © 2025</p>
      </div>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollButton && (
          <motion.button
            key="scroll-btn"
            onClick={scrollToTop}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 bg-[#edc5a2] text-black p-2 rounded hover:bg-[#eab38a] transition"
            aria-label="Scroll to top"
          >
            <FaArrowUp />
          </motion.button>
        )}
      </AnimatePresence>
    </footer>
  );
};

export default Footer;
