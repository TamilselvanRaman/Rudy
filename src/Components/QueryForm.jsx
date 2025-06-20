import React, { useState, useRef, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { getDatabase, ref, push, set } from "firebase/database"; // Firebase Realtime
import {app} from "../firebaseConfig"; // Update this path as needed

const QueryForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    contactMethod: "Mail",
  });

  const modalRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRadioChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      contactMethod: e.target.value,
    }));
  };

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const db = getDatabase(app);
      const queryRef = ref(db, "queries");
      const newQueryRef = push(queryRef);
      await set(newQueryRef, formData);
      alert("Query submitted successfully!");
      onClose();
    } catch (error) {
      console.error("Error submitting query:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fadeIn">
      <div
        ref={modalRef}
        className="bg-white p-6 md:p-8 rounded shadow-lg w-full max-w-2xl relative transition duration-300"
      >
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-red-500"
          onClick={onClose}
        >
          <FaTimes />
        </button>

        <h2 className="text-lg md:text-xl font-semibold mb-4 text-gray-800">
          Let us know about your query!
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name, Email, Phone */}
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="border px-4 py-2 w-full rounded outline-none"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="border px-4 py-2 w-full rounded outline-none"
              required
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              className="border px-4 py-2 w-full rounded outline-none"
            />
          </div>

          {/* Subject */}
          <textarea
            name="subject"
            placeholder="Subject"
            value={formData.subject}
            onChange={handleChange}
            rows={4}
            className="border px-4 py-2 w-full rounded outline-none"
            required
          ></textarea>

          {/* Contact Preference */}
          <div className="flex items-center gap-6 text-sm">
            {["Mail", "Phone", "Both"].map((option) => (
              <label key={option} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="contactMethod"
                  value={option}
                  checked={formData.contactMethod === option}
                  onChange={handleRadioChange}
                />
                {option}
              </label>
            ))}
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-[#e6b7a9] text-white px-6 py-2 rounded shadow hover:bg-[#d99f90] transition"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QueryForm;
