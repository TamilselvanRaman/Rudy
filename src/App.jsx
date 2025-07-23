// src/App.js
import React, { useEffect, useState } from "react";
import Routers from "./Routers/Routers";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { useDispatch } from "react-redux";
import { listenToAuthChanges } from "./redux/slices/authSlice";
import LoadingSpinner from "./components/Shared/LoadingSpinner";
import { fetchCart } from "./redux/slices/cartSlice";
import { useSelector } from "react-redux";

function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(listenToAuthChanges());

    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [dispatch]);

  const cartItems = useSelector((state) => state.cart.cartItems);
  const currentUser = useSelector((state) => state.auth.currentUser);
  const uid = currentUser?.uid;
  const groupId = currentUser?.uid;

  useEffect(() => {
    if (uid && groupId) {
      dispatch(fetchCart({ uid, groupId }));
      console.log("User ID:", uid);
      console.log("Cart Items:", cartItems);
    }
  }, [uid, groupId, dispatch]);

  return (
    <TooltipProvider>
      {loading ? <LoadingSpinner /> : <Routers />}
    </TooltipProvider>
  );
}

export default App;
