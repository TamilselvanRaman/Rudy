import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp,Minus, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "How will my order be delivered to me?",
    answer:
      "Your order will be delivered via our trusted logistics partners directly to your address with timely updates.",
  },
  {
    question: "What do I need to know?",
    answer:
      "Ensure your shipping address and contact details are correct while placing the order.",
  },
  {
    question: "How do I check the status of my order?",
    answer:
      "Login to your account and visit the 'My Orders' section to track your order status in real-time.",
  },
  {
    question: "What are the shipping charges?",
    answer:
      "Shipping charges depend on the order value and location. Orders above ₹999 enjoy free delivery.",
  },
  {
    question: "Can I cancel my order?",
    answer:
      "Yes, orders can be cancelled before dispatch. Once shipped, cancellation is not allowed.",
  },
];

// Animation variants
const answerVariants = {
  hidden: { opacity: 0, scaleY: 0 },
  visible: { opacity: 1, scaleY: 1 },
  exit: { opacity: 0, scaleY: 0 },
};

const FaqPage = () => {
  const [openIndexes, setOpenIndexes] = useState([]);
  const itemRefs = useRef([]);

  const toggleFAQ = (index) => {
    if (openIndexes.includes(index)) {
      setOpenIndexes(openIndexes.filter((i) => i !== index));
    } else {
      setOpenIndexes([...openIndexes, index]);
    }
  };

  useEffect(() => {
    if (openIndexes.length > 0) {
      const latestIndex = openIndexes[openIndexes.length - 1];
      const element = itemRefs.current[latestIndex];
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [openIndexes]);

  return (
    <div className="w-full">
      {/* Banner Section */}
      <div
        className="bg-cover bg-center h-64 flex flex-col justify-center items-center text-black"
        style={{
          backgroundImage: `url('/banner-image.jpg')`,
          backgroundColor: "rgba(255,255,255,0.4)",
          backgroundBlendMode: "lighten",
        }}
      >
        <h1 className="text-3xl font-bold">FAQ</h1>
        <p className="text-sm mt-2">Home / Faq</p>
      </div>

      <div className="text-center px-4 mt-10">
        <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-black mb-2">
          Frequently Asked
        </h2>
        <p className="text-gray-500 text-md">
          General queries for your Basic knowledge
        </p>
      </div>

      {/* FAQ Content */}
      <section className="max-w-5xl mx-auto px-4 md:px-8 py-10">
        <div className="space-y-4">
          {faqs.map((item, index) => {
            const isOpen = openIndexes.includes(index);

            return (
              <div
                key={index}
                ref={(el) => (itemRefs.current[index] = el)}
                className="border group border-gray-200 rounded-xl shadow-sm overflow-hidden transition-colors duration-300"
              >
                {/* Question Header */}
                <button
                  onClick={() => toggleFAQ(index)}
                  className={`w-full flex items-center justify-between px-6 py-4 text-left transition duration-300 ${
                    isOpen ? "bg-[#f5dfd2]" : "bg-[#bed6e0] hover:bg-[#f5dfd2]"
                  }`}
                >
                  <span className="flex items-center font-semibold text-black text-base group">
                    <span className="mr-2 mt-0.5 text-gray-700">
                      {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                    </span>
                    <span className="group-hover:underline transition duration-150">
                      {item.question}
                    </span>
                  </span>

                  {/* Animated Chevron */}
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {isOpen ? (
                      <ChevronUp size={18} className="text-gray-700" />
                    ) : (
                      <ChevronDown size={18} className="text-gray-700" />
                    )}
                  </motion.div>
                </button>

                {/* Smooth Animated Answer */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      variants={answerVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="origin-top bg-white px-6 pt-2 pb-5 text-sm text-gray-800"
                    >
                      {item.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default FaqPage;
