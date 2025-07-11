// src/pages/Register.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../redux/slices/authSlice";

function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    if (currentUser) {
      setSuccess("Registration successful!");
      const timeout = setTimeout(() => navigate("/"), 1500);
      return () => clearTimeout(timeout);
    }
  }, [currentUser, navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const result = await dispatch(
      signup({ email, password, firstName, lastName })
    );

    if (signup.rejected.match(result)) {
      setError(result.payload || "Registration failed.");
    }

    setLoading(false);
  };

  return (
    <div>
      {/* Banner */}
      <div
        className="bg-cover bg-center h-64 flex flex-col justify-center items-center text-black"
        style={{
          backgroundImage: `url('/banner-image.jpg')`,
          backgroundColor: "rgba(255,255,255,0.5)",
          backgroundBlendMode: "lighten",
        }}
      >
        <h1 className="text-3xl font-bold uppercase">Create Account</h1>
        <p className="text-sm mt-2">Home / Create Account</p>
      </div>

      {/* Form */}
      <div className="flex justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md bg-gray-50 p-8 border border-gray-300 rounded-sm shadow-sm">
          <h2 className="text-center text-2xl font-bold text-gray-900 mb-6">
            Create Account
          </h2>

          {error && (
            <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
          )}
          {success && (
            <p className="text-green-500 text-sm mb-3 text-center">{success}</p>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name"
              required
              className="block w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-black focus:border-black"
            />
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last name"
              required
              className="block w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-black focus:border-black"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="block w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-black focus:border-black"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="block w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-black focus:border-black"
            />
            <button
              type="submit"
              disabled={loading}
              className={`w-full font-medium py-2 px-4 rounded-sm ${
                loading
                  ? "bg-blue-100 text-gray-500 cursor-not-allowed"
                  : "bg-blue-200 text-black hover:bg-blue-300"
              }`}
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </form>

          <p className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
