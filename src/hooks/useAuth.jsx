// src/hooks/useAuth.js
import { useSelector } from "react-redux";

export const useAuth = () => {
  const currentUser = useSelector((state) => state.auth.currentUser);
  return { currentUser };
};
