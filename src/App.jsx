// src/App.js
import React, { useEffect } from "react";
import Routers from "./Routers/Routers";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { useDispatch } from "react-redux";
import { listenToAuthChanges } from "./redux/slices/authSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(listenToAuthChanges());
  }, [dispatch]);

  return (
    <TooltipProvider>
      <Routers />
    </TooltipProvider>
  );
}

export default App;
