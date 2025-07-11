import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaLeaf,
  FaTint,
  FaHeart,
  FaUser,
  FaStar,
  FaMagic,
  FaTwitter,
  FaFacebookF,
  FaPinterestP,
  FaInstagram,
} from "react-icons/fa";

const testimonials = [
  {
    quote: "This soap is amazing! My skin feels fresh and healthy.",
    image: "/About/aboUser-8.webp",
    name: "Samantha Grey",
    title: "Skin Care Enthusiast",
    rating: 5,
  },
  {
    quote: "The natural ingredients are a blessing. Highly recommend!",
    image: "/About/aboUser-11.webp",
    name: "Soniya Gillesbe",
    title: "Therapist",
    rating: 4,
  },
  {
    quote: "The natural ingredients are a blessing. Highly recommend!",
    image: "/About/aboUser-9.webp",
    name: "Melvin Powell",
    title: "Skin care Specialist",
    rating: 3,
  },
];

const features = [
  {
    title: "Go Organic",
    desc: "Aliquam sit amet cursus mauris. Sed vitae mattis ipsum.",
    icon: <FaLeaf size={20} />,
  },
  {
    title: "Soft Skin Feel",
    desc: "Ged vestibulum nulla elementum auctor tincidunt. Aliquam sit amet",
    icon: <FaTint size={20} />,
  },
  {
    title: "Love Your Skin",
    desc: "Vestibulum enim nulla, sollicitudin ac hendrerit nec, tempor quis nisl.",
    icon: <FaHeart size={20} />,
  },
  {
    title: "PH Balanced",
    desc: "Elementum auctor tincidunt. Sed vestibulum nulla Aliquam sit amet",
    icon: <FaUser size={20} />,
  },
  {
    title: "Freshness Explored",
    desc: "Sollicitudin ac hendrerit nec, tempor quis nisl. Sed vestibulum",
    icon: <FaStar size={20} />,
  },
  {
    title: "Best Fragrance",
    desc: "Sed vestibulum nulla elementum auctor tincidunt. Aliquam sit amet",
    icon: <FaMagic size={20} />,
  },
];

const team = [
  {
    image: "/About/team-1.webp",
    name: "Alice Johnson",
    role: "Founder",
  },
  {
    image: "/About/team-2.webp",
    name: "Mark Lee",
    role: "Soap Designer",
  },
  {
    image: "/About/team-3.webp",
    name: "Sara Kim",
    role: "Packaging Lead",
  },
  {
    image: "/About/team-4.webp",
    name: "James Brown",
    role: "Marketing Head",
  },
];

const AboutPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextPair = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  useEffect(() => {
    const timer = setInterval(nextPair, 5000);
    return () => clearInterval(timer);
  }, []);

  const getDisplayedTestimonials = () => {
    const secondIndex = (currentIndex + 1) % testimonials.length;
    return [testimonials[currentIndex], testimonials[secondIndex]];
  };

  const displayed = getDisplayedTestimonials();

  return (
    <div className="font-sans text-gray-700 ">
      {/* Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="bg-cover bg-center h-[250px] md:h-[320px] lg:h-[400px] flex flex-col justify-center items-center text-black"
        style={{
          backgroundImage: `url('/banner-image.jpg')`,
          backgroundColor: "rgba(255,255,255,0.4)",
          backgroundBlendMode: "lighten",
        }}
      >
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold uppercase">
          ABOUT
        </h1>
        <p className="text-base md:text-lg mt-2">Home / About</p>
      </motion.div>

      {/* Handcrafted Soap */}
      <section className="container mx-auto px-60 py-16 grid grid-cols-1 md:grid-cols-2 gap-10 items-center ">
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            The Handcrafted Soap
          </h2>
          <p className="mb-4 text-gray-600 text-base md:text-lg">
            Quisque volutpat mattis eros. Nullam malesuada erat ut ki diaml ka
            dhuddu pochu turpis. Suspendisse urna nibh, viverra non, semper
            suscipit, posuere a, pede. Donec nec justo eget felis facilisis
            fermentum. Morbi in sem quis dui placerat ornare. Pellentesque odio
            nisi, euismod in, pharetra a, ultricies in, diam. Sed arcu. Cras
            consequate. Etiam pretium varius quam in aliquam. Curabitur
            malesuada elit sed enim placerat, vitae interdum erat cursus. Morbi
            laoreet sapien id scelerisque dapibus. Aliquam erat volutpat. Nunc
            pulvinar tempus dui in tristique. Aliquam sem fringilla ut morbi
            tincidunt. Risus nec feugiat in fermentum posuere urna nec
            tincidunt. Urna et pharetra pharetra massa massa ultricies mi quis.
            Sapien pellentesque habitant morbi tristique senectus. Nam aliquam
            sem et tortor consequat.
          </p>
          <blockquote className="border-l-4 text-base md:text-lg border-orange-400 pl-4 italic text-gray-500">
            Nullam malesuada erat ut ki diaml ka dhuddu pochu turpis.
            Suspendisse urna nibh, viverra non, semper suscipit, posuere a,
            pede. Donec nec justo eget felis facilisis fermentum. Morbi in sem
            quis dui placerat ornare. Tortor dignissim convallis aenean et
            tortor. Ac tincidunt vitae semper quis lectus nulla at volutpat
            diam.
          </blockquote>
        </motion.div>
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <img
            src="/About/aboMain-10.webp"
            alt="Handcrafted Soap"
            className="rounded-lg shadow-lg w-full object-cover"
          />
        </motion.div>
      </section>

      {/* Feel the Difference */}
      <section
        className="relative bg-cover bg-center bg-fixed py-20 text-white"
        style={{
          backgroundImage: "url('/About/aboBG-image.png')",
          backgroundColor: "rgb(0,0,0,0.4)",
          backgroundBlendMode: "overlay",
        }}
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-12">
            Feel The Difference..
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto gap-10">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                className="group flex items-start gap-4 p-5 rounded text-left"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="bg-blue-300/60 group-hover:bg-[#f8dfcf]/90 text-black p-4 flex items-center justify-center">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-bold text-lg md:text-xl group-hover:text-[#f8dfcf]">
                    {feature.title}
                  </h3>
                  <p className="text-sm md:text-base">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Natural Soap */}
      <section className="container mx-auto px-60  py-20 space-y-24 ">
        {/* Section 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Image with background shape */}
          <div className="relative group w-fit">
            {/* Blue background box */}
            <div className="absolute -top-7 -left-7 w-full h-full z-0  bg-blue-700/50"></div>

            {/* Overlay image on hover */}
            <div
              className="absolute -top-7 -left-7 w-full h-full z-10  opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                backgroundImage: "url('/About/overlay.webp')",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
              }}
            ></div>

            {/* Foreground Image */}
            <img
              src="/About/abo-2.webp"
              alt="Pouring soap"
              className="relative z-20  shadow-lg"
            />
          </div>

          {/* Text */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              A natural soap for your natural beauty
            </h2>
            <p className="text-gray-600">
              Sed vestibulum nulla elementum auctor tincidunt. Aliquam sit amet
              cursus mauris. Sed vitae mattis ipsum. Vestibulum enim nulla,
              sollicitudin ac hendrerit nec, tempor quis nisl
            </p>
          </div>
        </div>

        {/* Section 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Text */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              A legacy of cleanliness and hygiene
            </h2>
            <p className="text-gray-600">
              Aliquam sit amet cursus mauris. Sed vitae mattis ipsum. Vestibulum
              enim nulla, sollicitudin ac hendrerit nec, tempor quis nisl. Sed
              vestibulum nulla elementum auctor tincidunt.
            </p>
          </div>

          {/* Image with background shape */}
          <div className="relative group w-fit">
            {/* Blue background box */}
            <div className="absolute -top-7 -right-7 w-full h-full z-0 bg-blue-700/50"></div>

            {/* Overlay image on hover */}
            <div
              className="absolute -top-7 -right-7 w-full h-full z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                backgroundImage: "url('/About/overlay.webp')",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
              }}
            ></div>

            {/* Foreground Image */}
            <img
              src="/About/abo-3.webp"
              alt="Cutting handmade soap"
              className="relative z-20 shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-blue-50 py-20 overflow-hidden">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <h2 className="text-3xl font-bold mb-2">Testimonials</h2>
          <p className="text-sm text-gray-500 mb-10">
            Thus Spoke Our Customers
          </p>

          <div className="relative h-[300px] md:h-[260px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ x: "30%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "-30%", opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 absolute w-full"
              >
                {displayed.map((t, idx) => (
                  <div
                    key={t.name + idx}
                    className="bg-white p-8 rounded-xl shadow-lg text-left transition-all duration-500 group hover:shadow-2xl"
                  >
                    <p className="mb-6 text-gray-700 text-lg italic">
                      "{t.quote}"
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16 group">
                        <div className="absolute -top-1 -left-1 w-full h-full rounded-full bg-blue-200 z-0"></div>
                        <div
                          className="absolute -top-1 -left-1 w-full h-full rounded-full z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{
                            backgroundImage: "url('/About/overlay.webp')",
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            backgroundSize: "cover",
                          }}
                        ></div>
                        <img
                          src={t.image}
                          alt={t.name}
                          className="relative z-20 w-16 h-16 rounded-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-lg">{t.name}</p>
                        <p className="text-sm text-gray-500">{t.title}</p>
                        <div className="text-yellow-400">
                          {"★".repeat(t.rating)}
                          {"☆".repeat(5 - t.rating)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Pagination Dots */}
          <div className="mt-6 flex justify-center gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full ${
                  index === currentIndex ? "bg-[#C48D69]/70" : "bg-gray-400"
                } transition-all duration-300`}
              ></button>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="container mx-auto px-60  py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Our Team</h2>
        <p className="text-sm text-gray-500 mb-10">
          The People Worked Hard Through
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {team.map((member, i) => (
            <div key={i} className="flex flex-col items-center group">
              {/* Image box */}
              <div className="relative w-full aspect-[4/5] overflow-hidden rounded-xl shadow-lg">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:opacity-70 transition-all duration-300"
                />

                {/* Icons wrapper: positioned bottom, animated up */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="flex space-x-3">
                    <a
                      href="#"
                      className="bg-[#BCD8E6] p-3 rounded shadow hover:bg-[#F7CFC3] transition"
                    >
                      <FaTwitter className="text-black text-md font-bold" />
                    </a>
                    <a
                      href="#"
                      className="bg-[#BCD8E6] p-3 rounded shadow hover:bg-[#F7CFC3] transition"
                    >
                      <FaFacebookF className="text-black text-md font-bold" />
                    </a>
                    <a
                      href="#"
                      className="bg-[#BCD8E6] p-3 rounded shadow hover:bg-[#F7CFC3] transition"
                    >
                      <FaPinterestP className="text-black text-md font-bold" />
                    </a>
                    <a
                      href="#"
                      className="bg-[#BCD8E6] p-3 rounded shadow hover:bg-[#F7CFC3] transition"
                    >
                      <FaInstagram className="text-black text-md font-bold" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Name & role */}
              <h3 className="font-semibold mt-4 text-lg">{member.name}</h3>
              <p className="text-sm text-gray-500">{member.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
