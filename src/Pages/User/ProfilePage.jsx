import React, { useEffect, useState } from "react";
import {
  FiUser,
  FiLock,
  FiHeart,
  FiEdit,
  FiTrash2,
  FiEye,
  FiEdit2,
  FiPackage,
  FiRepeat,
  FiStar,
  FiMenu,
  FiX,
  FiSave,
  FiEyeOff,
  FiMessageCircle,
  FiCalendar,
  FiTag,
  FiMapPin,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserProfile,
  updateProfileImage,
  updateUserProfile,
  changePassword,
  resetPassword,
  fetchUserReviews,
  fetchUserOrders,
} from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import parsePhoneNumber from "libphonenumber-js";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { currentUser, profile } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [localProfile, setLocalProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState("My Accounts");

  useEffect(() => {
    if (currentUser?.uid) {
      dispatch(fetchUserProfile(currentUser.uid));
    }
  }, [currentUser, dispatch]);

  useEffect(() => {
    if (profile) {
      setLocalProfile(profile);
    }
  }, [profile]);

  const handleChange = (e) => {
    setLocalProfile({ ...localProfile, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64 = await convertToBase64(file);
      dispatch(
        updateProfileImage({ userId: currentUser.uid, imageUrl: base64 })
      );
    }
  };

  const handlePhoneChange = (phone) => {
    setLocalProfile((prev) => ({ ...prev, phone }));
  };

  const convertToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleSave = () => {
    if (currentUser?.uid && localProfile) {
      const {
        firstName,
        dob,
        gender,
        phone,
        address,
        apt,
        city,
        state,
        country,
        postalCode,
      } = localProfile;
      dispatch(
        updateUserProfile({
          userId: currentUser.uid,
          firstName,
          dob,
          gender,
          phone,
          address,
          apt,
          city,
          state,
          country,
          postalCode,
        })
      );
      setIsEditing(false);
    }
  };

  const getCountryFromPhone = (phone) => {
    try {
      const parsed = parsePhoneNumber("+" + phone);
      return parsed?.country?.toLowerCase() || "in";
    } catch {
      return "in";
    }
  };

  const handleUseCurrentLocation = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        try {
          const OPENCAGE_API_KEY = "929aa1ae748647639e1709e958fb7ff8";
          const response = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${OPENCAGE_API_KEY}`
          );
          const data = await response.json();

          console.log("Geolocation fetched:", latitude, longitude);
          console.log("Geocoding response:", data);

          if (!data.results || data.results.length === 0) {
            alert("Could not determine your address.");
            return;
          }

          const result = data.results[0];
          const components = result.components || {};
          const address = result.formatted || "";

          setLocalProfile((prev) => ({
            ...prev,
            address,
            apt: components.house_number || "",
            city:
              components.city || components.town || components.village || "",
            state: components.state || "",
            country: components.country || "",
            postalCode: components.postcode || "",
          }));
        } catch (error) {
          console.error("Error fetching address:", error);
          alert("An error occurred while getting address.");
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Unable to retrieve your location.");
      }
    );
  };

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [cooldown, setCooldown] = useState(false);

  const getTodayKey = () => {
    const today = new Date();
    return `forgotAttempts_${today.getFullYear()}_${today.getMonth()}_${today.getDate()}`;
  };

  const handleToggle = (setter, current) => {
    setter(!current);
    if (!current) {
      setTimeout(() => {
        setter(false);
      }, 2000);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!newPassword || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await dispatch(
        changePassword({ email: currentUser.email, newPassword })
      ).unwrap();
      setMessage("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.message || "Failed to change password.");
    }
  };

  const handleForgotPassword = async () => {
    const now = Date.now();
    const todayKey = getTodayKey();
    const lastClicked = localStorage.getItem("lastForgotClick");
    const attemptsToday = JSON.parse(localStorage.getItem(todayKey)) || [];

    // Check cooldown (60 seconds from last click)
    if (lastClicked && now - parseInt(lastClicked) < 60000) {
      setError("Please wait 1 minute before trying again.");
      setMessage("");
      return;
    }

    // Check daily limit
    if (attemptsToday.length >= 3) {
      setError("You’ve reached the maximum limit (3 times) for today.");
      setMessage("");
      return;
    }

    try {
      const result = await dispatch(resetPassword(currentUser.email));
      if (resetPassword.fulfilled.match(result)) {
        setMessage("Password reset email sent. Check your inbox.");
        setError("");

        // Save attempt time
        localStorage.setItem("lastForgotClick", now.toString());
        localStorage.setItem(todayKey, JSON.stringify([...attemptsToday, now]));

        setCooldown(true);
        setTimeout(() => setCooldown(false), 60000);
      } else {
        setError("Failed to send reset email. Try again.");
        setMessage("");
      }
    } catch (err) {
      setError("Something went wrong.");
      setMessage("");
    }
  };

  const menuItems = [
    { label: "My Accounts", icon: <FiUser /> },
    { label: "My Orders", icon: <FiPackage /> },
    { label: "Returns & Cancel", icon: <FiRepeat /> },
    { label: "My Rating & Reviews", icon: <FiStar /> },
    {
      label: "My Wishlist",
      icon: <FiHeart />,
      action: () => navigate("/wishlist"),
    },
    { label: "Change Password", icon: <FiLock /> },
  ];

  const userReviews = useSelector((state) => state.auth.reviews) || [];
  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       dispatch(fetchUserReviews(user.uid));
  //     }
  //   });

  //   return () => unsubscribe();
  // }, [dispatch]);

  useEffect(() => {
    if (currentUser?.uid) {
      dispatch(fetchUserReviews(currentUser.uid));
    }
  }, [dispatch, currentUser?.uid]);

  const userOrders = useSelector((state) => state.orders?.userOrders || []);

  useEffect(() => {
    if (currentUser?.uid) {
      dispatch(fetchUserOrders(currentUser.uid));
    }
  }, [dispatch, currentUser?.uid]);

  const renderContent = () => {
    switch (selectedMenuItem) {
      case "My Accounts":
        return (
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-10 pb-4 border-b border-gray-200">
              <h2 className="text-3xl font-bold text-gray-900">
                Personal Information
              </h2>
              <div className="flex gap-3">
                {isEditing && (
                  <button
                    onClick={handleSave}
                    className="text-green-600 hover:text-green-700 flex items-center gap-1 text-base font-medium"
                  >
                    <FiSave className="text-lg" /> Save
                  </button>
                )}
                <button
                  onClick={() => setIsEditing((prev) => !prev)}
                  className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-base font-medium"
                >
                  <FiEdit2 className="text-lg" />
                  {isEditing ? "Cancel" : "Edit"}
                </button>
              </div>
            </div>

            {/* Form Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={localProfile.firstName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 text-base border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100"
                />
              </div>

              {/* DOB */}
              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dob"
                  value={localProfile.dob}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 text-base border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">
                  Gender
                </label>
                <div className="flex gap-4 mt-2">
                  {["male", "female"].map((g) => (
                    <label
                      key={g}
                      className="flex items-center gap-2 text-base text-gray-700"
                    >
                      <input
                        type="radio"
                        name="gender"
                        value={g}
                        checked={localProfile.gender === g}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="accent-blue-500"
                      />
                      {g.charAt(0).toUpperCase() + g.slice(1)}
                    </label>
                  ))}
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">
                  Phone
                </label>
                <PhoneInput
                  country={getCountryFromPhone(localProfile.phone)}
                  value={localProfile.phone}
                  onChange={handlePhoneChange}
                  inputProps={{
                    name: "phone",
                    disabled: !isEditing,
                  }}
                  inputClass="!w-full !pl-14 !py-2 !text-base !border !rounded-xl !focus:outline-none !focus:ring-2 !focus:ring-blue-400 !disabled:bg-gray-100"
                  containerClass="!w-full"
                  disableDropdown={!isEditing}
                  enableSearch={false}
                />
              </div>

              {/* Address */}
              <div className="relative sm:col-span-2">
                <label className="block mb-1 text-sm font-semibold text-gray-700">
                  Delivery Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={localProfile.address}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Enter your address"
                  className="w-full pl-4 pr-10 py-2 text-base border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100"
                />
                {isEditing && (
                  <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    className="absolute right-3 top-10 text-xl text-blue-500 hover:text-blue-700"
                  >
                    <FiMapPin />
                  </button>
                )}
              </div>

              {/* Conditional Fields */}
              {isEditing &&
                ["apt", "city", "state", "country", "postalCode"].map(
                  (field) => (
                    <div key={field}>
                      <label className="block mb-1 text-sm font-semibold text-gray-700 capitalize">
                        {field === "apt" ? "Apartment" : field}
                      </label>
                      <input
                        type="text"
                        name={field}
                        value={localProfile[field] || ""}
                        onChange={handleChange}
                        className="w-full px-4 py-2 text-base border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </div>
                  )
                )}

              {/* Email */}
              <div className="sm:col-span-2">
                <label className="block mb-1 text-sm font-semibold text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={localProfile.email}
                  disabled
                  className="w-full px-4 py-2 text-base border rounded-xl bg-gray-100 text-gray-500"
                />
              </div>
            </div>
          </div>
        );

      case "Change Password":
        return (
          <div className="min-h-screen flex  justify-center p-4">
            <div className="max-w-full w-full bg-white rounded-3xl shadow-lg p-8">
              <form onSubmit={handlePasswordChange} className="space-y-6">
                {/* Current Password */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrent ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Current Password"
                      className="w-full px-4 py-3 border rounded-lg pr-12 focus:outline-none focus:ring-2 focus:ring-[#f2d2bd]"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                      onClick={() => handleToggle(setShowCurrent, showCurrent)}
                    >
                      {showCurrent ? <FiEye /> : <FiEyeOff />}
                    </button>
                  </div>
                  <div className="mt-2 text-start">
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      disabled={cooldown}
                      className={`text-sm font-semibold underline ${
                        cooldown
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-[#84b1e7] hover:underline"
                      }`}
                    >
                      Forgot password?
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNew ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="New Password"
                      className="w-full px-4 py-3 border rounded-lg pr-12 focus:outline-none focus:ring-2 focus:ring-[#C48D69]"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                      onClick={() => handleToggle(setShowNew, showNew)}
                    >
                      {showNew ? <FiEye /> : <FiEyeOff />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm New Password"
                      className="w-full px-4 py-3 border rounded-lg pr-12 focus:outline-none focus:ring-2 focus:ring-[#f2d2bd]"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                      onClick={() => handleToggle(setShowConfirm, showConfirm)}
                    >
                      {showConfirm ? <FiEye /> : <FiEyeOff />}
                    </button>
                  </div>
                </div>

                {/* Feedback Messages */}
                {(error || message) && (
                  <p
                    className={`text-center text-sm ${
                      error ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {error || message}
                  </p>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-[#eaccb7] text-white py-3 rounded-xl font-semibold tracking-wide hover:bg-blue-100 transition-shadow duration-200 shadow-md"
                >
                  Save Changes
                </button>
              </form>

              {/* Password Requirements */}
              <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-5 text-gray-600 text-sm">
                <h3 className="font-semibold mb-2 text-gray-700">
                  Password must contain:
                </h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>At least 8 characters</li>
                  <li>One uppercase letter</li>
                  <li>One lowercase letter</li>
                  <li>One number or special character</li>
                </ul>
              </div>
            </div>
          </div>
        );
      case "My Rating & Reviews":
        return (
          <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-lg border border-gray-100">
            <h2 className="text-4xl font-bold text-gray-900 mb-10">
              My Ratings & Reviews
            </h2>

            {userReviews.length === 0 ? (
              <p className="text-xl text-gray-500">
                You haven't posted any reviews yet.
              </p>
            ) : (
              <div className="space-y-8">
                {userReviews.map((r, index) => (
                  <Link
                    to={`/products/${r.productId}`}
                    key={index}
                    className="block group"
                  >
                    <div className="flex flex-col sm:flex-row gap-6 p-6 rounded-2xl border border-gray-200 bg-[#FAFAFA] hover:bg-[#F3F3F3] transition-shadow duration-300 group-hover:shadow-md cursor-pointer">
                      {/* Product Image */}
                      <div className="w-full sm:w-32 h-32 overflow-hidden rounded-xl bg-white border border-gray-300 flex-shrink-0">
                        <img
                          src={r.images?.[0] || "/placeholder.jpg"}
                          alt={r.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Review Content */}
                      <div className="flex-1 flex flex-col justify-between">
                        {/* Title & Stars */}
                        <div className="mb-3">
                          <h3 className="text-2xl font-semibold text-gray-800 group-hover:text-[#C48D69]">
                            {r.name}
                          </h3>
                          <div className="flex items-center mt-2 gap-1 group">
                            {Array.from({ length: 5 }, (_, i) => (
                              <FiStar
                                key={i}
                                className={`w-6 h-6 transition-all duration-200 ${
                                  i < r.rating
                                    ? "fill-[#C48D69] text-[#C48D69]"
                                    : "text-gray-300 group-hover:scale-110"
                                }`}
                              />
                            ))}
                            <span className="ml-2 text-lg font-medium text-[#C48D69]">
                              {r.rating}
                            </span>
                          </div>
                        </div>

                        {/* Review Title */}
                        {r.title && (
                          <p className="text-lg text-gray-700 font-medium mb-1">
                            {r.title}
                          </p>
                        )}

                        {/* Review Comment */}
                        {r.comment && (
                          <p className="text-base text-gray-600 leading-relaxed">
                            {r.comment}
                          </p>
                        )}

                        {/* Timestamp */}
                        <div className="mt-4 text-sm text-gray-400">
                          {new Date(r.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      case "My Orders":
        return (
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              My Orders
            </h2>
            {userOrders.length === 0 ? (
              <p className="text-gray-500">You have no orders yet.</p>
            ) : (
              <div className="space-y-6">
                {userOrders.map((order, idx) => (
                  <div key={idx} className="border-b pb-4">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Order ID:</span>{" "}
                      {order.id}
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Product:</span>{" "}
                      {order.productName}
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Status:</span>{" "}
                      {order.status}
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Date:</span>{" "}
                      {new Date(order.date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case "Returns & Cancel":
        return (
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Returns & Cancellations
            </h2>
            {userOrders.length === 0 ? (
              <p className="text-gray-500">
                No returnable or cancellable orders.
              </p>
            ) : (
              <div className="space-y-6">
                {userOrders
                  .filter(
                    (o) => o.status === "Delivered" || o.status === "Processing"
                  )
                  .map((order, idx) => (
                    <div key={idx} className="border-b pb-4">
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">Product:</span>{" "}
                        {order.productName}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">Status:</span>{" "}
                        {order.status}
                      </p>
                      <div className="mt-2 flex gap-4">
                        {order.status === "Processing" && (
                          <button
                            onClick={() => dispatch(cancelOrder(order.id))}
                            className="text-red-600 text-sm font-medium hover:underline"
                          >
                            Cancel Order
                          </button>
                        )}
                        {order.status === "Delivered" && (
                          <button
                            onClick={() => dispatch(returnOrder(order.id))}
                            className="text-blue-600 text-sm font-medium hover:underline"
                          >
                            Return Order
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (!localProfile)
    return <div className="p-6 text-center text-lg">Loading...</div>;

  return (
    <div className="flex flex-col md:flex-row bg-gray-50 min-h-screen ">
      <div className="p-4 md:hidden bg-white shadow ">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-2xl"
        >
          {sidebarOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>
      <aside
        className={`bg-white w-full md:w-1/4 p-6 shadow-sm ${
          sidebarOpen ? "block" : "hidden md:block"
        }`}
      >
        <div className="flex flex-col items-center text-center">
          <div className="relative w-24 h-24">
            <img
              src={localProfile.profileImage || "https://i.pravatar.cc/150"}
              alt="Avatar"
              className="w-full h-full rounded-full object-cover border-4 border-blue-200"
            />
            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1 cursor-pointer">
                <FiEdit2 size={14} />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </label>
            )}
          </div>
          <p className="mt-3 text-sm text-gray-500">Welcome back</p>
          <h3 className="text-lg font-semibold text-gray-800">
            {localProfile.firstName}
          </h3>
        </div>
        <div className="mt-6 space-y-3">
          {menuItems.map((item, idx) => (
            <div
              key={idx}
              onClick={() => {
                item.action ? item.action() : setSelectedMenuItem(item.label);
              }}
              className={`flex items-center gap-3 px-4 py-2 rounded-md cursor-pointer transition-all ${
                selectedMenuItem === item.label
                  ? "bg-blue-100 text-blue-600 font-medium"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </aside>
      <main className="flex-1 p-4 sm:p-6">{renderContent()}</main>
    </div>
  );
};

export default ProfilePage;
