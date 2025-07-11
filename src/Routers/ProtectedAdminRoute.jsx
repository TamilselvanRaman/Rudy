// src/Routers/ProtectedAdminRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { ref, get } from "firebase/database";
import { useSelector } from "react-redux";
import { database } from "../firebase/firebaseConfig";

const ProtectedAdminRoute = ({ children }) => {
  const currentUser = useSelector((state) => state.auth.currentUser);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!currentUser) {
        setChecking(false);
        return;
      }
      const userRef = ref(database, `users/${currentUser.uid}`);
      const snapshot = await get(userRef);
      const userData = snapshot.val();
      setIsAdmin(userData?.role === "admin");
      setChecking(false);
    };

    checkAdmin();
  }, [currentUser]);

  if (checking)
    return <div className="text-center mt-10">Checking access...</div>;
  if (!currentUser) return <Navigate to="/login" />;
  if (!isAdmin) return <Navigate to="/" />;

  return children;
};

export default ProtectedAdminRoute;
