import React, { useState, useRef } from "react";
import { getDatabase, ref as dbRef, push, set } from "firebase/database";
import {app} from "../firebaseConfig";
//rgb(250, 240, 228)

const Dashboard = () => {
  const initialFormData = {
    category: "Skin Whiten Soap",
    name: "",
    price: "",
    vendor: "",
    type: "",
    quantity: "",
    flavour: [],
    description: "",
    skinTypes: "",
    idealFor: "Both",
    weight: "",
    color: "",
    highlights: "",
    benefits: [],
    reviews: [],
    images: [],
  };

  const initialReview = {
    reviewName: "",
    reviewEmail: "",
    description: "",
    reviewNumber: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [reviewInput, setReviewInput] = useState(initialReview);
  const [flavourInput, setFlavourInput] = useState("");
  const [imagePreviews, setImagePreviews] = useState([]);
  const fileInputRef = useRef();
  const [benefitInput, setBenefitInput] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const processImages = (files) => {
    if (files.length + imagePreviews.length > 10) {
      return alert("Max 10 images");
    }
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, reader.result],
        }));
        setImagePreviews((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDragDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    processImages(files);
  };

  const removeImage = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, images: updatedImages }));
    setImagePreviews(updatedPreviews);
  };

  const handleReviewAdd = () => {
    setFormData((prev) => ({
      ...prev,
      reviews: [...prev.reviews, reviewInput],
    }));
    setReviewInput(initialReview);
  };

  const handleReviewRemove = (index) => {
    setFormData((prev) => ({
      ...prev,
      reviews: prev.reviews.filter((_, idx) => idx !== index),
    }));
  };

  const handleAddFlavour = () => {
    const trimmed = flavourInput.trim();
    if (trimmed && !formData.flavour.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        flavour: [...prev.flavour, trimmed],
      }));
    }
    setFlavourInput("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.images.length < 2)
      return alert("Please upload at least 2 images");

    try {
      const db = getDatabase(app);
      const productRef = push(dbRef(db, `products/${formData.category}`));
      await set(productRef, formData);
      alert("Product uploaded successfully!");
      setFormData(initialFormData);
      setImagePreviews([]);
      setFlavourInput("");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-4 text-center">Dashboard</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="p-2 rounded border"
            >
              {[
                "Skin Whiten Soap",
                "Deep Clean Soap",
                "Fairness Soap",
                "Luxury Soap",
                "Herbal Soap",
                "Handmade Soap",
                "Ayurvedic Soap",
              ].map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>

            {[
              "name",
              "price",
              "vendor",
              "type",
              "quantity",
              "color",
              "weight",
              "skinTypes",
            ].map((field) => (
              <input
                key={field}
                name={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={formData[field]}
                onChange={handleInputChange}
                className="p-2 rounded border"
              />
            ))}

            <select
              name="idealFor"
              value={formData.idealFor}
              onChange={handleInputChange}
              className="p-2 rounded border"
            >
              <option value="Both">Both</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
            </select>
          </div>

          {/* Flavour Field with Add Button */}
          <div>
            <label className="block font-semibold mb-1">Flavours</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={flavourInput}
                onChange={(e) => setFlavourInput(e.target.value)}
                placeholder="Enter flavour"
                className="p-2 rounded border flex-1"
              />
              <button
                type="button"
                onClick={handleAddFlavour}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            {formData.flavour.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.flavour.map((item, idx) => (
                  <span
                    key={idx}
                    className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center"
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          flavour: prev.flavour.filter((_, i) => i !== idx),
                        }))
                      }
                      className="ml-2 text-red-600 hover:text-red-800"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {["description", "highlights"].map((field) => (
            <textarea
              key={field}
              name={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={formData[field]}
              onChange={handleInputChange}
              className="w-full p-2 rounded border"
            />
          ))}

          {/* Benefits Field with Add Button */}
          <div>
            <label className="block font-semibold mb-1">Benefits</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={benefitInput}
                onChange={(e) => setBenefitInput(e.target.value)}
                placeholder="Enter benefit"
                className="p-2 rounded border flex-1"
              />
              <button
                type="button"
                onClick={() => {
                  const trimmed = benefitInput.trim();
                  if (trimmed && !formData.benefits.includes(trimmed)) {
                    setFormData((prev) => ({
                      ...prev,
                      benefits: [...prev.benefits, trimmed],
                    }));
                  }
                  setBenefitInput("");
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            {formData.benefits.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.benefits.map((item, idx) => (
                  <span
                    key={idx}
                    className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm flex items-center"
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          benefits: prev.benefits.filter((_, i) => i !== idx),
                        }))
                      }
                      className="ml-2 text-red-600 hover:text-red-800"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="font-semibold">
              Drag and drop images (min 2)
            </label>
            <div
              className="mt-2 border-2 border-dashed border-gray-300 p-4 rounded text-center"
              onDrop={handleDragDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current.click()}
            >
              Drag & drop images or click to upload
              <input
                type="file"
                accept="image/*"
                multiple
                ref={fileInputRef}
                onChange={(e) => processImages(Array.from(e.target.files))}
                hidden
              />
            </div>
            <div className="flex flex-wrap gap-4 mt-4">
              {imagePreviews.map((src, idx) => (
                <div key={idx} className="relative w-24 h-24">
                  <img
                    src={src}
                    alt={`Preview ${idx}`}
                    className="w-full h-full object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Review Section */}
          <div className="border-t pt-6 space-y-6">
            {formData.reviews.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Preview Reviews
                </h3>
                <div className="grid gap-4">
                  {formData.reviews.map((review, idx) => (
                    <div
                      key={idx}
                      className="bg-white border rounded-lg p-4 shadow-sm"
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-1 text-sm">
                          <p>
                            <strong>Name:</strong> {review.reviewName}
                          </p>
                          <p>
                            <strong>Email:</strong> {review.reviewEmail}
                          </p>
                          <p>
                            <strong>Rating:</strong> {review.reviewNumber} / 5
                          </p>
                          <p>
                            <strong>Description:</strong> {review.description}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleReviewRemove(idx)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add Review */}
            <div className="bg-gray-50 p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-bold mb-4 text-gray-800">
                Add Review
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  name="reviewName"
                  placeholder="Name"
                  value={reviewInput.reviewName}
                  onChange={(e) =>
                    setReviewInput((prev) => ({
                      ...prev,
                      reviewName: e.target.value,
                    }))
                  }
                  className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                  name="reviewEmail"
                  placeholder="Email"
                  value={reviewInput.reviewEmail}
                  onChange={(e) =>
                    setReviewInput((prev) => ({
                      ...prev,
                      reviewEmail: e.target.value,
                    }))
                  }
                  className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                  name="reviewNumber"
                  placeholder="Rating (1 to 5)"
                  type="number"
                  min="1"
                  max="5"
                  value={reviewInput.reviewNumber}
                  onChange={(e) =>
                    setReviewInput((prev) => ({
                      ...prev,
                      reviewNumber: e.target.value,
                    }))
                  }
                  className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <textarea
                  name="description"
                  placeholder="Description"
                  value={reviewInput.description}
                  onChange={(e) =>
                    setReviewInput((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 md:col-span-2"
                  rows="3"
                />
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={handleReviewAdd}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg"
                >
                  Add Review
                </button>
                <button
                  type="button"
                  onClick={() => setReviewInput(initialReview)}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-medium px-5 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
          >
            Submit Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;
