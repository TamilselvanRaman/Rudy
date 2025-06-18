import React from "react";
import { FaArrowUp } from "react-icons/fa6";

const Footer = () => {
  const paymentIcons = [
    { src: "/Icons/visa.png", alt: "Visa" },
    { src: "/Icons/mastercard.png", alt: "MasterCard" },
    { src: "/Icons/amex.png", alt: "Amex" },
    { src: "/Icons/paypal.png", alt: "PayPal" },
    { src: "/Icons/discover.png", alt: "Discover" },
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

  return (
    <footer className="bg-[#fdf3e7] text-black px-6 py-10 relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">
        {/* Logo & Slogan */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Savon.</h1>
          <p className="mb-2">Smell fresh and feel fresh.</p>
          <p className="text-sm">@_savonsoap</p>
        </div>

        {/* Dynamic Footer Sections */}
        {sections.map((section) => (
          <div key={section.title}>
            <h2 className="font-semibold mb-3">{section.title}</h2>
            <ul className="space-y-2 text-sm">
              {section.links.map((link) => (
                <li key={link}>
                  <a href="#" className="hover:underline">{link}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom Bar */}
      <div className="border-t mt-10 pt-4 flex flex-col md:flex-row justify-between items-center text-sm">
        <p className="text-center md:text-left">
          All Right Reserved © 2025, savon theme (password: 1)
        </p>
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          {paymentIcons.map(({ src, alt }) => (
            <img
              key={alt}
              src={src}
              alt={alt}
              className="w-8 h-auto object-contain"
            />
          ))}
        </div>
      </div>
      
    </footer>
  );
};

export default Footer;
