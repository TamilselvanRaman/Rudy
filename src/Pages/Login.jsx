import React, { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [resetSuccessMessage, setResetSuccessMessage] = useState("");
  const [showResetForm, setShowResetForm] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (resetSuccessMessage) {
      const timer = setTimeout(() => {
        setResetSuccessMessage("");
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [resetSuccessMessage]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      // Specific error messages based on Firebase error codes
      if (err.code === "auth/user-not-found") {
        setError("Email not registered. Please check or create an account.");
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password. Please try again.");
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError("Failed to login. Please check your credentials.");
      }
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await sendPasswordResetEmail(auth, email);
      setResetSuccessMessage(
        "We've sent you an email with a link to update your password."
      );
      setShowResetForm(false);
    } catch (err) {
      console.error("Reset error:", err.message);
      if (err.code === "auth/user-not-found") {
        setError("Invalid email address.");
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError("Failed to send reset email. Make sure the email is correct.");
      }
    }
  };

  return (
    <div>
      {/* Top Banner */}
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

      {/* Form Container */}
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
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
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

              {/* ✅ Success Message with Icon */}
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

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
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
                    setError("");
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
