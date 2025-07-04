import React from "react";
import Routers from ".//Routers/Routers";
import { AuthProvider } from "./context/AuthContext";
import { TooltipProvider } from "@radix-ui/react-tooltip";

function App() {
  return (
    <AuthProvider>
      <TooltipProvider>
        <Routers />
      </TooltipProvider>
    </AuthProvider>
  );
}

export default App;
