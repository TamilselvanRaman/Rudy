import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import {app} from "../firebaseConfig"; // make sure this is correctly set up
import Footer from "../Components/Footer";

function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const db = getDatabase(app);
    const productsRef = ref(db, "products");

    onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      const productList = [];

      if (data) {
        // Flatten categories
        Object.entries(data).forEach(([category, items]) => {
          Object.entries(items).forEach(([id, product]) => {
            productList.push({ ...product, id, category });
          });
        });
      }

      setProducts(productList);
      console.log("Products fetched:", productList);
    });
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Our Products</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-all"
          >
            {product.images && product.images.length > 0 && (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-48 object-cover rounded"
              />
            )}
            <h2 className="text-xl font-semibold mt-2">{product.name}</h2>
            <p className="text-gray-700">₹{product.price}</p>
            <p className="text-sm text-gray-500 mt-1">{product.description}</p>
            <p className="text-xs text-gray-400 mt-1">
              Category: {product.category}
            </p>
          </div>
        ))}
      </div>

      {/* <Footer /> */}
    </div>
  );
}

export default Home;
