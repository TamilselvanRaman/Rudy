import React, { createContext, useState, useEffect, useContext } from "react";
import {
  ref,
  onValue,
  set,
  push,
  update,
  get,
  remove,
} from "firebase/database";
import { database } from "../firebase/firebaseConfig";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (!currentUser) return;

    const cartRef = ref(database, `cart/${currentUser.uid}`);
    const unsubscribe = onValue(cartRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const items = Object.entries(data).map(([key, value]) => ({
          ...value,
          firebaseId: key,
        }));
        setCartItems(items);
      } else {
        setCartItems([]);
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  const addToCart = async (newItem) => {
    if (!currentUser) {
      alert("Please login to add items to cart.");
      return;
    }

    const cartRef = ref(database, `cart/${currentUser.uid}`);
    const snapshot = await get(cartRef);
    const data = snapshot.val();

    let existingEntry;
    if (data) {
      existingEntry = Object.entries(data).find(([_, item]) => {
        return (
          item.id === newItem.id &&
          item.weight === newItem.weight &&
          item.flavour === newItem.flavour
        );
      });
    }

    if (existingEntry) {
      const [key, existingItem] = existingEntry;
      const updatedQuantity = existingItem.quantity + newItem.quantity;
      await update(ref(database, `cart/${currentUser.uid}/${key}`), {
        ...existingItem,
        quantity: updatedQuantity,
      });
    } else {
      await push(cartRef, newItem);
    }
  };

  const onIncrease = async (firebaseId) => {
    const item = cartItems.find((item) => item.firebaseId === firebaseId);
    if (item) {
      const updated = { ...item, quantity: item.quantity + 1 };
      await set(
        ref(database, `cart/${currentUser.uid}/${firebaseId}`),
        updated
      );
    }
  };

  const onDecrease = async (firebaseId) => {
    const item = cartItems.find((item) => item.firebaseId === firebaseId);
    if (item) {
      if (item.quantity === 1) {
        await remove(ref(database, `cart/${currentUser.uid}/${firebaseId}`));
      } else {
        const updated = { ...item, quantity: item.quantity - 1 };
        await set(
          ref(database, `cart/${currentUser.uid}/${firebaseId}`),
          updated
        );
      }
    }
  };

  const removeFromCart = async (firebaseId) => {
    if (!currentUser) return;
    await remove(ref(database, `cart/${currentUser.uid}/${firebaseId}`));
  };

  const clearCart = async () => {
    if (!currentUser) return;
    await set(ref(database, `cart/${currentUser.uid}`), null);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        onIncrease,
        onDecrease,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
