import React from "react";

const Home = () => {
  return (
    <div className="font-sans">
      {/* Top Banner Section */}
      <section className="bg-orange-50 py-12 text-center px-4">
        <h2 className="text-xl font-semibold mb-2">
          Give your skin a healing feeling.
        </h2>
        <p className="text-sm max-w-3xl mx-auto mb-10">
          Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Ut Posuere
          Nibh Augue, Non Cursus Enim Posuere Vel. Donec Arcu Tortor,
          Consectetur Vitae Ullamcorper Sit Amet, Suscipit Eget Erat.
        </p>

        {/* Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {[
            {
              title: "Chemical Free",
              description: "Gauris varius mi diam, a malesuada risui",
              icon: "🌱",
            },
            {
              title: "Clean Ingredients",
              description: "Mauris varius mi diam, a malesuada risus",
              icon: "👐",
            },
            {
              title: "Eco-Friendly",
              description: "Tauris varius mi diam, a malesuada risum",
              icon: "🌿",
            },
            {
              title: "Quality Assured",
              description: "Caouris varius mi diam, a malesuada risur",
              icon: "✅",
            },
          ].map((item, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="text-4xl mb-2">{item.icon}</div>
              <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
              <p className="text-xs text-gray-600 text-center">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Product Section */}
      <section className="py-16 px-6 md:px-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Text Column */}
          <div>
            <h2 className="text-lg font-semibold mb-4">
              Start Your Skincare <br /> Today.
            </h2>
            <p className="text-sm text-gray-700 mb-4">
              Suspendisse Eget Risus Mollis, Molestie Lectus Vel, Pellentesque
              Nulla. Aliquamum Feugiat Lacus In Sem Fermentum Finibus. Morbi
              Tempor Ac Dui Vel Ullamcorper Accumsan Augue.
            </p>
            <button className="text-sm text-blue-600 font-medium underline">
              SHOP ALL
            </button>
          </div>

          {/* Products */}
          {[
            {
              name: "Golden Glow",
              img: "https://i.imgur.com/NhUkr7s.png",
              desc: "Integer utursus magna. Namid maximus velit vel pellente que turpis var pulvinar ligulace hendr oreet habitant tristique.",
            },
            {
              name: "Skin Paradise",
              img: "https://i.imgur.com/TvXJ5vR.png",
              desc: "Pellentesque pulvinar laoreet dolor in varius. Nam tincidunt enimlibero, eget mollis nisl ullamcorper arcuanib habitant.",
            },
            {
              name: "Green Touch",
              img: "https://i.imgur.com/9gS1jc4.png",
              desc: "Morbi vene atis nisleget iaculisfelis pretium vehicula velit nonenim. Suspen isse aliquet facilisis purus malesuada felis vitae.",
            },
          ].map((product, index) => (
            <div key={index} className="text-center">
              <img
                src={product.img}
                alt={product.name}
                className="mx-auto mb-4 rounded-md shadow-md"
              />
              <h4 className="font-semibold text-sm mb-2">{product.name}</h4>
              <p className="text-xs text-gray-600 mb-2 px-2">{product.desc}</p>
              <button className="text-sm text-blue-600 font-medium underline">
                SHOP NOW
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Natural Touch Section */}
      <section className="flex flex-col md:flex-row w-full">
        <div className="w-full md:w-1/2">
          <img
            src="https://i.imgur.com/TPqzHKZ.jpg"
            alt="Natural Soap"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-full md:w-1/2 bg-blue-100 p-10 flex flex-col justify-center text-center">
          <h2 className="text-3xl font-bold mb-2">The Natural Touch</h2>
          <h4 className="text-sm font-semibold uppercase tracking-widest mb-4">
            Cleanliness and Purity Together
          </h4>
          <p className="text-sm text-gray-700 max-w-xl mx-auto">
            Duis hendrerit accumsan quam, vitae posuere enim. Suspendisse
            malesuada efficitur ultrices. Aenean aliquam nec lorem ullamcorper
            congue. Donec sit amet risus et nunc sodales scelerisque eget ac
            risus. Nulla ac arcu sit amet sapien ultrices tempor eu sit amet
            magna. Nullam posuere, dui et tempor laoreet, neque massa volutpat
            sem, id congue tortor arcu sit amet tortor. Maecenas id mauris et
            mauris pretium sodales et vitae leo. Donec blandit felis faucibus
            tellus porta, eu gravida velit rutrum. In fermentum eu dui ac
            commodo. Donec nulla nibh, convallis ac quam et, imperdiet commodo
            augue. Donec euismod pellentesque elit, a iaculis mi vestibulum.
          </p>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="bg-orange-50 text-center py-12 px-6">
        <h4 className="uppercase font-semibold text-xs text-gray-600 mb-4">
          Savon. In The Press
        </h4>
        <blockquote className="text-lg font-medium max-w-2xl mx-auto mb-6">
          “Perfect soap with nice fragrance. And it contains natural fruit acids
          that help smooth rough, dry skin and retain moisture.”
        </blockquote>
        <div className="flex justify-center gap-10 opacity-80">
          <span className="font-signature text-xl">Smile</span>
          <span className="tracking-widest">ORGANIC</span>
          <span className="italic">The Homemade</span>
        </div>
      </section>

      {/* Dermatologist Product Section */}
      <section className="bg-blue-100 py-16 px-6 md:px-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h3 className="text-lg font-bold mb-3">
              The natural dermatologist your skin needs.
            </h3>
            <p className="text-sm text-gray-700 mb-4">
              Aenean in sapien eu nisi porta ullamcorper a nec quam.
              Pellentesque enim dolor, varius vitae tincidunt, a mattis neque.
              Curabitur et justo sed massa bibendum accumsan. Aliquam erat
              volutpat. In dolor arcu, lacinia in velit in, porttitor tincidunt
              urna. Vestibulum finibus augue risus, et scelerisque lectus varius
              ac. Aenean ullamcorper nisl ut orci vulputate, ac vestibulum.
            </p>
            <a href="#" className="text-sm text-blue-600 underline font-medium">
              KNOW MORE
            </a>
          </div>
          <div className="flex justify-center">
            <img
              src="https://i.imgur.com/FF2l4j3.png"
              alt="Dermatologist Product"
              className="w-40"
            />
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-orange-50 text-center py-12 px-4">
        <h4 className="font-semibold mb-1">Sign Up To Our Newsletter</h4>
        <p className="text-sm text-gray-600 mb-4">
          Get notification on latest update and offers
        </p>
        <form className="flex justify-center gap-2 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Email Address"
            className="px-4 py-2 border border-gray-300 rounded"
          />
          <button
            type="submit"
            className="bg-orange-300 px-4 py-2 rounded text-sm"
          >
            Subscribe
          </button>
        </form>
      </section>

      {/* Popular Products Section */}
      <section className="py-12 px-6">
        <h3 className="text-center font-semibold text-lg mb-10">
          Popular Products
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[
            {
              name: "Shea Butter Soap",
              price: "$6.31",
              reviews: "2 reviews",
              image: "https://i.imgur.com/BHZ5D5R.png",
            },
            {
              name: "Sandal Wood Soap",
              price: "$7.65",
              reviews: "2 reviews",
              image: "https://i.imgur.com/F7RlI3j.png",
              soldOut: true,
            },
            {
              name: "Rose Soap",
              price: "$9.54",
              reviews: "2 reviews",
              image: "https://i.imgur.com/IVvHqD4.png",
              isNew: true,
            },
            {
              name: "Rose & Lavendar Soap",
              price: "$7.54",
              reviews: "1 review",
              image: "https://i.imgur.com/MZmi7DL.png",
            },
          ].map((product, idx) => (
            <div key={idx} className="text-center">
              <div className="relative">
                {product.soldOut && (
                  <span className="absolute top-2 left-2 bg-white text-xs px-2 py-1 border border-gray-300">
                    Sold Out
                  </span>
                )}
                {product.isNew && (
                  <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1">
                    New
                  </span>
                )}
                <img
                  src={product.image}
                  alt={product.name}
                  className="mx-auto mb-3 rounded shadow"
                />
              </div>
              <h4 className="font-semibold text-sm mb-1">{product.name}</h4>
              <p className="text-xs text-gray-600">{product.reviews}</p>
              <p className="font-bold text-sm">{product.price}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
