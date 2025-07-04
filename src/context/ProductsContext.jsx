import React, { createContext, useState, useEffect } from "react";
import { ref, get, child } from "firebase/database";
import { database } from "../firebase/firebaseConfig";

export const ProductsContext = createContext();

export const getProducts = async () => {
  const dbRef = ref(database);
  const snapshot = await get(child(dbRef, "products"));
  if (snapshot.exists()) {
    const rawData = Object.values(snapshot.val());

    const allProducts = rawData.flatMap((category) => {
      const categoryName = category.id;
      return Object.entries(category)
        .filter(([key]) => key !== "id")
        .map(([key, product]) => ({
          ...product,
          id: key,
          category: categoryName,
        }));
    });

    console.log(allProducts);
    return allProducts;
  }
  return [];
};

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      const allProducts = await getProducts();
      setProducts(allProducts);
      setFilteredProducts(allProducts);

      // Dummy ratings example
      const randomRatings = allProducts.map(() => ({
        rating: Math.floor(Math.random() * 4) + 2,
        reviews: Math.floor(Math.random() * 20) + 1,
      }));
      setRatings(randomRatings);
    };

    fetchInitialData();
  }, []);

  return (
    <ProductsContext.Provider
      value={{ products, ratings, filteredProducts, setFilteredProducts }}
    >
      {children}
    </ProductsContext.Provider>
  );
};
