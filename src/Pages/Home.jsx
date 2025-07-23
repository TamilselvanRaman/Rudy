import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import WaveButton from "../Components/Shared/WaveButton";
import { FaCheckCircle, FaPaperPlane } from "react-icons/fa";
import ProductCard from "../Components/Product/ProductCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/slices/productsSlice";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ArrowLeft, ArrowRight } from "lucide-react";

const features = [
  {
    title: "Chemical-Free",
    desc: "No parabens, sulfates, or toxins",
    icon: "/Home/icon-1.avif",
  },
  {
    title: "Clean Ingredients",
    desc: "Plant-based oils & nourishing herbs",
    icon: "/Home/icon-3.avif",
  },
  {
    title: "Eco-Friendly",
    desc: "Biodegradable, plastic-free packaging",
    icon: "/Home/icon-5.webp",
  },
  {
    title: "Quality Assured",
    desc: "Small batches, lab-tested for safety",
    icon: "/Home/icon-7.avif",
  },
  {
    title: "Paraben-Free",
    desc: "Safe for all skin types and ages",
    icon: "/Home/icon-1.avif",
  },
  {
    title: "Dermatologist Approved",
    desc: "Trusted by skincare professionals",
    icon: "/Home/icon-3.avif",
  },
  {
    title: "Cruelty-Free",
    desc: "Absolutely never tested on animals",
    icon: "/Home/icon-5.webp",
  },
  {
    title: "Handcrafted",
    desc: "Made with care by skilled artisans",
    icon: "/Home/icon-7.avif",
  },
  {
    title: "Cold-Pressed Oils",
    desc: "Retains nutrients for skin nourishment",
    icon: "/Home/icon-1.avif",
  },
  {
    title: "pH Balanced",
    desc: "Respects skin's natural barrier",
    icon: "/Home/icon-3.avif",
  },
  {
    title: "Vegan Formula",
    desc: "100% plant-based ingredients",
    icon: "/Home/icon-5.webp",
  },
  {
    title: "Recyclable Packaging",
    desc: "Earth-friendly materials used",
    icon: "/Home/icon-7.avif",
  },
];

const Homeproducts = [
  {
    name: "Golden Glow",
    img: "/Home/Soap_02.webp",
    desc: "Brightens and nourishes skin naturally with golden turmeric.",
  },
  {
    name: "Skin Paradise",
    img: "/Home/Soap_10.webp",
    desc: "A soothing blend of lavender and aloe for everyday glow.",
  },
  {
    name: "Green Touch",
    img: "/Home/Soap_03.webp",
    desc: "Detox with neem and tea tree — nature’s deep cleanser.",
  },
];

const brands = [
  { id: 1, src: "/Home/brand-logo1.webp", alt: "Brand 1" },
  { id: 2, src: "/Home/brand-logo2.webp", alt: "Brand 2" },
  { id: 3, src: "/Home/brand-logo3.webp", alt: "Brand 3" },
];

const images = [
  { src: "/Home/brand-icon1.png", alt: "Brand 1" },
  { src: "/Home/brand-icon2.png", alt: "Brand 2" },
  { src: "/Home/brand-icon3.png", alt: "Brand 3" },
  { src: "/Home/brand-icon4.png", alt: "Brand 4" },
];

const BrandLogo = ({ src, alt }) => {
  const blackControls = useAnimation(); // controls for black image
  const colorControls = useAnimation(); // controls for colored image

  // Slide in the black image on component mount
  useEffect(() => {
    blackControls.start({ y: 0 });
  }, [blackControls]);

  return (
    <motion.div
      className="relative w-28 md:w-36 h-12 md:h-16 overflow-hidden"
      onHoverStart={() => {
        colorControls.start({ y: 0 });
        blackControls.start({ y: "-100%" });
      }}
      onHoverEnd={() => {
        colorControls.start({ y: "100%" });
        blackControls.start({ y: 0 });
      }}
    >
      {/* Black image (initial slide in from bottom) */}
      <motion.img
        src={src}
        alt={alt}
        initial={{ y: "100%" }}
        animate={blackControls}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="absolute top-0 left-0 w-full h-full object-contain filter brightness-500 invert pointer-events-none"
      />

      {/* Colored image (slide in on hover) */}
      <motion.img
        src={src}
        alt={alt}
        initial={{ y: "100%" }}
        animate={colorControls}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none"
      />
    </motion.div>
  );
};

const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.2,
    },
  },
};
const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
};

const getRandomItems = (arr, count) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const slides = [
  {
    id: 1,
    img: "/Home/slider1.webp",
    heading: ["Protects Sensitive Skin", "From Dryness"],
    sublinks: ["SHOP ALL", "VIEW MORE"],
    position: "center",
  },
  {
    id: 2,
    img: "/Home/slider2.webp",
    heading: ["Be clean. Be aromatic.", "Be desirable."],
    sublinks: ["SHOP ALL", "VIEW MORE"],
    position: "left",
  },
  {
    id: 3,
    img: "/Home/slider3.webp",
    heading: ["Natural Antioxidant", "Enriched Soap"],
    sublinks: ["SHOP ALL", "VIEW MORE"],
    position: "right",
  },
];

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.products);
  const [randomProducts, setRandomProducts] = useState([]);
  const [currentFeatureSlide, setCurrentFeatureSlide] = useState(0);
  const [currentProduct, setCurrentProduct] = useState(0);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (products.length > 0) {
      const selected = getRandomItems(products, 3);
      setRandomProducts(selected);
    }
  }, [products]);

  const isMobile = window.innerWidth < 640;
  const itemsPerSlide = isMobile ? 1 : 4;
  const totalFeatureSlides = Math.ceil(features.length / itemsPerSlide);

  const visibleFeatures = features.slice(
    currentFeatureSlide * itemsPerSlide,
    currentFeatureSlide * itemsPerSlide + itemsPerSlide
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setEmail("");
      }, 3000);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentFeatureSlide((prev) => (prev + 1) % totalFeatureSlides);
    }, 4000);
    return () => clearInterval(timer);
  }, [totalFeatureSlides]);

  const [current, setCurrent] = useState(0);
  const slideLength = slides.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === slideLength - 1 ? 0 : prev + 1));
    }, 20000);

    return () => clearInterval(interval);
  }, [slideLength]);

  const nextSlide = () => {
    setCurrent((prev) => (prev === slideLength - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slideLength - 1 : prev - 1));
  };

  return (
    <div className="font-sans">
      <div className="relative w-full h-screen overflow-hidden font-sans group">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === current ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <img
              src={slide.img}
              alt="slide"
              className="w-full h-full object-cover"
            />

            <AnimatePresence mode="wait">
              {index === current && (
                <motion.div
                  key={slide.id}
                  initial={{
                    opacity: 0,
                    x:
                      slide.position === "right"
                        ? 100
                        : slide.position === "left"
                        ? -100
                        : 0,
                  }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{
                    opacity: 0,
                    x:
                      slide.position === "right"
                        ? 100
                        : slide.position === "left"
                        ? -100
                        : 0,
                  }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={`absolute inset-0 z-10 flex items-center justify-center md:justify-${slide.position} px-4`}
                >
                  <div className="max-w-xl w-full text-center md:text-center bg-white/60 md:bg-transparent p-6 md:p-8 rounded-md">
                    {slide.heading.map((line, i) => (
                      <motion.h2
                        key={i}
                        initial={{
                          opacity: 0,
                          x:
                            slide.position === "right"
                              ? 100
                              : slide.position === "left"
                              ? -100
                              : 0,
                        }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{
                          opacity: 0,
                          x:
                            slide.position === "right"
                              ? 100
                              : slide.position === "left"
                              ? -100
                              : 0,
                        }}
                        transition={{
                          duration: 0.8,
                          delay: i * 0.2,
                          ease: "easeOut",
                        }}
                        className="text-lg sm:text-2xl md:text-4xl font-semibold leading-tight text-black mb-2"
                      >
                        {line}
                      </motion.h2>
                    ))}

                    <div className="flex justify-center gap-4 mt-4">
                      {slide.sublinks.map((link, i) => (
                        <WaveButton key={i} label={link} />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}

        {/* Arrows shown only on hover */}
        <button
          className="absolute left-2 sm:left-4 md:left-6 top-1/2 transform -translate-y-1/2 p-4 bg-blue-100 hover:bg-[#e9cdbb] z-20 hidden group-hover:block"
          onClick={prevSlide}
        >
          <ArrowLeft />
        </button>
        <button
          className="absolute p-4 right-2 sm:right-4 md:right-6 top-1/2 transform -translate-y-1/2  bg-blue-100 hover:bg-[#e9cdbb] z-20 hidden group-hover:block"
          onClick={nextSlide}
        >
          <ArrowRight />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
          {slides.map((_, i) => (
            <span
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full cursor-pointer transition-all duration-300 ${
                i === current ? "bg-gray-800" : "bg-gray-400"
              }`}
            ></span>
          ))}
        </div>
      </div>

      {/*  Feature Section  */}
      <section className="bg-orange-50 py-16 px-4 text-center flex flex-col justify-center">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 tracking-wide"
        >
          Natural skincare your skin will thank you for.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-sm md:text-base max-w-2xl mx-auto mb-12 text-gray-600 leading-relaxed tracking-wide"
        >
          Discover our handcrafted soaps made from pure, organic ingredients.
          Each bar is free from harmful chemicals and designed to gently
          nourish, hydrate, and protect your skin - just the way nature
          intended.
        </motion.p>

        {/* Feature Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentFeatureSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className={`${
              visibleFeatures.length < 6
                ? "flex flex-wrap justify-center gap-8"
                : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8"
            } w-full max-w-[1200px] mx-auto items-center`}
          >
            {visibleFeatures.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center px-4"
              >
                <img
                  src={item.icon}
                  alt={item.title}
                  className="w-14 h-14 mb-4 object-contain"
                />
                <h3 className="text-sm md:text-base font-semibold mb-1 text-gray-800 hover:text-[#c29574] transition-colors tracking-wide">
                  {item.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-600 max-w-[160px] leading-snug tracking-tight">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Feature Navigation Dots */}
        <div className="mt-10 flex justify-center gap-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentFeatureSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentFeatureSlide === index
                  ? "bg-gray-800 scale-110"
                  : "bg-gray-400"
              }`}
            ></button>
          ))}
        </div>
      </section>

      {/*  Product Section  */}
      <motion.section
        className="py-14 px-4 md:px-10 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <motion.div
          variants={containerVariants}
          className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6 items-start"
        >
          {/* Text Block */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col justify-center md:items-start text-center md:text-left space-y-6"
          >
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 leading-snug">
              Discover Natural <br className="hidden md:block" /> Skincare
              Goodness.
            </h2>
            <p className="text-sm md:text-base text-gray-700 tracking-wide leading-relaxed">
              Elevate your daily skincare ritual with our handcrafted,
              eco-friendly soaps. Designed to cleanse, nourish, and bring out
              your natural glow—gently.
            </p>
            <div className="w-fit mx-auto md:mx-0">
              <WaveButton label="SHOP ALL" />
            </div>
          </motion.div>

          {/* Product Cards */}
          {Homeproducts.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className={`flex flex-col items-center text-center space-y-3 ${
                index === currentProduct ? "block" : "hidden"
              } md:block transition-all duration-500`}
            >
              <motion.img
                src={item.img}
                alt={item.name}
                whileHover={{ scale: 1.3 }}
                transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                className="h-64 w-90 object-contain mx-auto"
              />
              <h4 className="font-semibold text-md text-gray-800 mt-9">
                {item.name}
              </h4>
              <p className="text-sm text-gray-600 px-4">{item.desc}</p>
              <WaveButton label="SHOP NOW" />
            </motion.div>
          ))}
        </motion.div>

        {/* Product Dots (Mobile Only) */}
        <div className="mt-8 flex justify-center gap-2 md:hidden">
          {Homeproducts.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentProduct(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentProduct === index
                  ? "bg-gray-800 scale-110"
                  : "bg-gray-400"
              }`}
            ></button>
          ))}
        </div>
      </motion.section>

      {/* Natural Touch Section */}
      <section className="flex flex-col md:flex-row w-full">
        {/* Left Image */}
        <div className="w-full md:w-1/2">
          <img
            src="/Home/cont-section-image1.webp"
            alt="Natural Soap"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Content */}
        <div className="w-full md:w-1/2 bg-[#85acba]/60 px-6 py-10 md:px-12 flex flex-col justify-center text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight leading-snug">
            The Natural Touch
          </h2>

          <h4 className="text-sm font-semibold uppercase tracking-widest text-gray-700 mb-5">
            Cleanliness and Purity Together
          </h4>

          <p className="text-sm md:text-base text-gray-700/90 font-normal leading-relaxed tracking-wide md:tracking-normal md:leading-7 text-justify md:text-left">
            Experience the gentle embrace of nature with every wash. Our
            handcrafted soaps are made with pure botanical ingredients that
            nourish, cleanse, and restore your skin’s natural balance - without
            any harsh chemicals or additives. Whether you're starting your
            skincare journey or elevating your daily ritual, our soaps provide a
            luxurious lather and calming aroma that soothe the senses. Embrace
            the natural touch your skin deserves — clean, conscious, and crafted
            with care.
          </p>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="bg-orange-50 text-center py-12 px-6">
        <h4 className="uppercase font-semibold text-sm text-gray-900 mb-4">
          Rudy. In The Press
        </h4>

        <blockquote className="text-lg md:text-xl font-semibold max-w-3xl mx-auto mb-10 text-gray-700 leading-relaxed">
          “Perfect soap with nice fragrance. And it contains natural fruit acids
          that help smooth rough, dry skin and retain moisture.”
        </blockquote>

        <div className="flex flex-wrap justify-center items-center gap-10">
          {brands.map((logo, index) => (
            <BrandLogo key={index} src={logo.src} alt={logo.alt} />
          ))}
        </div>
      </section>

      {/* Dermatologist Product Section */}
      <motion.section
        className="relative bg-blue-100 section-fixed-bg overflow-hidden py-16 px-4 md:px-12"
        style={{ backgroundImage: "url('/About/overlay.webp')" }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        {/* Overlay (optional) */}
        <div className="absolute inset-0 bg-white/30 z-0"></div>

        {/* Foreground Content */}
        <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Left Column */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800">
              The natural dermatologist your skin needs.
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              Aenean in sapien eu nisi porta ullamcorper a nec quam.
              Pellentesque enim dolor, varius vitae tincidunt, a mattis eu
              neque. Curabitur at justo sed massa bibendum accumsan.
            </p>

            <WaveButton label="KNOW MORE" />

            <div className="flex flex-wrap gap-4 mt-6 justify-start">
              {images.map((i) => (
                <motion.img
                  key={i.src}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                  src={i.src}
                  alt={i.alt}
                  className="h-12 w-12 md:h-16 md:w-16 object-contain"
                />
              ))}
            </div>
          </motion.div>

          {/* Right Column */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center md:justify-end"
          >
            <motion.img
              src="/Home/cont-section-image2c.webp"
              alt="Dermatologist Product"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.2 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="w-56 md:w-80 object-contain"
            />
          </motion.div>
        </div>
      </motion.section>

      {/* Newsletter Section */}
      <motion.section
        className="bg-orange-50 py-16 px-4 text-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-2xl mx-auto space-y-4">
          <h4 className="text-3xl font-bold text-gray-800">
            Sign Up To Our Newsletter
          </h4>
          <p className="text-md text-gray-600">
            Get notification on latest updates and offers
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6"
          >
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full sm:w-80 px-5 py-3 rounded border border-[#f8bb92] shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 transition"
            />
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-[#f8bb92] hover:bg-blue-100 text-sm font-semibold rounded transition-colors duration-300"
            >
              Subscribe <FaPaperPlane />
            </button>
          </form>

          {submitted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-green-700 font-medium flex items-center justify-center gap-2"
            >
              <FaCheckCircle className="text-green-600" />
              <span>Thanks for subscribing</span>
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Popular Products Section */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h2 className="text-center text-2xl md:text-3xl font-bold mb-10">
          Popular Products
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {randomProducts.map((product, index) => (
            <motion.div
              key={product.id}
              className="relative"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              variants={cardVariants}
            >
              {/* Label Badge */}
              {index === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="absolute top-2 left-2 bg-white text-black text-xs font-semibold px-2 py-1 rounded shadow z-10"
                >
                  Sold out
                </motion.div>
              )}
              {index === randomProducts.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="absolute top-2 right-2 bg-orange-600 text-white text-xs font-semibold px-2 py-1 rounded shadow z-10"
                >
                  New
                </motion.div>
              )}

              {/* Product Card */}
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
