import React, { useState, useEffect } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { ref, get } from "firebase/database";
import { auth, database } from "../firebase/firebaseConfig";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/slices/authSlice";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [resetSuccessMessage, setResetSuccessMessage] = useState("");
  const [showResetForm, setShowResetForm] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    if (resetSuccessMessage) {
      const timer = setTimeout(() => setResetSuccessMessage(""), 7000);
      return () => clearTimeout(timer);
    }
  }, [resetSuccessMessage]);

  useEffect(() => {
    if (currentUser) {
      const checkAdminAndNavigate = async () => {
        const snapshot = await get(ref(database, `users/${currentUser.uid}`));
        const userData = snapshot.val();
        const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;

        if (!userData) {
          setLocalError("User data not found in database.");
          return;
        }

        if (userData.role === "admin" && currentUser.email === adminEmail) {
          navigate("/adminpanel");
        } else {
          navigate("/home");
        }
      };

      checkAdminAndNavigate();
    }
  }, [currentUser, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLocalError("");

    const resultAction = await dispatch(login({ email, password }));

    if (login.rejected.match(resultAction)) {
      const errorCode = resultAction.payload;
      if (errorCode === "auth/user-not-found") {
        setLocalError(
          "Email not registered. Please check or create an account."
        );
      } else if (errorCode === "auth/wrong-password") {
        setLocalError("Incorrect password. Please try again.");
      } else if (errorCode === "auth/invalid-email") {
        setLocalError("Please enter a valid email address.");
      } else {
        setLocalError("Failed to login. Please check your credentials.");
      }
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLocalError("");

    try {
      await sendPasswordResetEmail(auth, email);
      setResetSuccessMessage(
        "We've sent you an email with a link to update your password."
      );
      setShowResetForm(false);
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        setLocalError("Invalid email address.");
      } else if (err.code === "auth/invalid-email") {
        setLocalError("Please enter a valid email address.");
      } else {
        setLocalError(
          "Failed to send reset email. Make sure the email is correct."
        );
      }
    }
  };

  return (
    <div>
      {/* Banner */}
      <div
        className="bg-cover bg-center h-64 flex flex-col justify-center items-center text-black"
        style={{
          backgroundImage: `url('/banner-image.jpg')`,
          backgroundColor: "rgba(255,255,255,0.4)",
          backgroundBlendMode: "lighten",
        }}
      >
        <h1 className="text-3xl font-bold">ACCOUNT</h1>
        <p className="text-sm mt-2">Home / Account</p>
      </div>

      {/* Login or Reset Form */}
      <div className="flex justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-gray-50 p-8 border border-gray-300 rounded-sm shadow-sm">
          {showResetForm ? (
            <>
              <h2 className="text-center text-2xl font-bold text-gray-900">
                Reset Your Password
              </h2>
              <p className="text-center text-sm mb-4 text-gray-600">
                We will send you an email to reset your password
              </p>
              {localError && (
                <p className="text-red-500 text-sm text-center">{localError}</p>
              )}
              <form onSubmit={handleResetPassword} className="space-y-4">
                <input
                  type="email"
                  required
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded placeholder-gray-500 focus:outline-none focus:ring-black focus:border-black"
                />
                <button
                  type="submit"
                  className="w-full bg-blue-200 hover:bg-blue-300 text-sm py-2 font-medium text-center"
                >
                  Submit
                </button>
              </form>
              <p
                onClick={() => setShowResetForm(false)}
                className="text-center mt-4 text-sm text-black font-semibold cursor-pointer hover:underline"
              >
                Cancel
              </p>
            </>
          ) : (
            <>
              <h2 className="text-center text-2xl font-bold text-gray-900">
                Login
              </h2>

              {resetSuccessMessage && (
                <div className="flex items-center gap-2 text-green-600 text-sm bg-green-50 border border-green-300 px-4 py-2 rounded">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 10-1.414 1.414L9 13.414l4.707-4.707z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p>{resetSuccessMessage}</p>
                </div>
              )}

              {localError && (
                <p className="text-red-500 text-sm text-center">{localError}</p>
              )}

              <form onSubmit={handleLogin} className="mt-8 space-y-6">
                <div className="mb-4">
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded placeholder-gray-500 focus:outline-none focus:ring-black focus:border-black"
                  />
                </div>
                <div className="mb-6">
                  <input
                    type="password"
                    required
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded placeholder-gray-500 focus:outline-none focus:ring-black focus:border-black"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-200 hover:bg-blue-300 text-sm py-2 font-medium text-black"
                >
                  Sign In
                </button>
              </form>

              <div className="flex justify-between items-center pt-4 border-t text-sm text-gray-700 font-medium">
                <span
                  onClick={() => {
                    setShowResetForm(true);
                    setLocalError("");
                    setResetSuccessMessage("");
                  }}
                  className="hover:underline cursor-pointer font-semibold"
                >
                  Forgot Your Password?
                </span>
                <Link to="/register" className="hover:underline font-semibold">
                  Create Account
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
