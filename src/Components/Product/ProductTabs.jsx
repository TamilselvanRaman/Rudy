import React, { useEffect, useRef, useState } from "react";
import { ref, push, onValue, remove, update } from "firebase/database";
import { database } from "../../firebase/firebaseConfig";
import { getAuth } from "firebase/auth";

const tabs = ["Description", "Shipping & Returns", "Reviews"];

export default function ProductTabs({ product }) {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const isAdmin = currentUser?.email === import.meta.env.VITE_ADMIN_EMAIL; 

  const [activeTab, setActiveTab] = useState("Description");
  const [writingReview, setWritingReview] = useState(false);
  const [editingReviewKey, setEditingReviewKey] = useState(null);
  const [reviews, setReviews] = useState({});
  const [imagePreviews, setImagePreviews] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    comment: "",
    name: "",
    email: "",
    rating: 0,
    images: [],
  });

  const fileInputRef = useRef();

  useEffect(() => {
    if (!product?.id) return;
    const reviewsRef = ref(database, `review/${product.id}/reviews`);
    return onValue(reviewsRef, (snapshot) => {
      const data = snapshot.val() || {};
      setReviews(data);
    });
  }, [product?.id]);

  const processImages = (files) => {
    const validFiles = files.slice(0, 10 - imagePreviews.length);
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result;
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, base64Image],
        }));
        setImagePreviews((prev) => [...prev, base64Image]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDragDrop = (e) => {
    e.preventDefault();
    processImages(Array.from(e.dataTransfer.files));
  };

  const removeImage = (index) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!currentUser) return alert("Please login to submit a review");

    const reviewPath = `review/${product.id}/reviews`;
    const reviewData = {
      ...formData,
      uid: currentUser.uid,
      timestamp: Date.now(),
    };

    if (editingReviewKey) {
      await update(
        ref(database, `${reviewPath}/${editingReviewKey}`),
        reviewData
      );
    } else {
      await push(ref(database, reviewPath), reviewData);
    }

    setFormData({
      title: "",
      comment: "",
      name: "",
      email: "",
      rating: 0,
      images: [],
    });
    setImagePreviews([]);
    setWritingReview(false);
    setEditingReviewKey(null);
  };

  const handleEdit = (key, review) => {
    setFormData(review);
    setImagePreviews(review.images || []);
    setEditingReviewKey(key);
    setWritingReview(true);
  };

  const handleDelete = async (key, uid) => {
    if (!currentUser || (!isAdmin && currentUser.uid !== uid)) return;
    await remove(ref(database, `review/${product.id}/reviews/${key}`));
  };

  const reviewList = Object.entries(reviews);
  const averageRating =
    reviewList.length > 0
      ? (
          reviewList.reduce((acc, [, r]) => acc + (r.rating || 0), 0) /
          reviewList.length
        ).toFixed(1)
      : null;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex space-x-2 border-b mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setWritingReview(false);
              setEditingReviewKey(null);
            }}
            className={`px-4 py-2 font-medium rounded-t-md ${
              activeTab === tab ? "bg-rose-200" : "bg-sky-100"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white p-4 rounded shadow">
        {activeTab === "Description" && (
          <div>
            <p className="mb-4">
              {product.description || "Loading description..."}
            </p>
            <p className="font-semibold mb-1">Highlights:</p>
            <p className="mb-4">
              {product.highlights || "Loading highlights..."}
            </p>
            <p className="font-semibold mb-1">Benefits:</p>
            <ul className="list-disc list-inside mb-4">
              {(product.benefits || []).map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === "Shipping & Returns" && (
          <div>
            <p className="font-semibold mb-1">Returns policy</p>
            <p className="mb-4">
              You may return most new, unopened items within 30 days of delivery
              for a full refund. We'll also pay the return shipping costs if the
              return is a result of our error (you received an incorrect or
              defective item, etc.).
            </p>
            <p className="mb-4">
              You should expect to receive your refund within four weeks of
              giving your package to the return shipper, however, in many cases
              you will receive a refund more quickly. This time period includes
              the transit time for us to receive your return from the shipper (5
              to 10 business days), the time it takes us to process your return
              once we receive it (3 to 5 business days), and the time it takes
              your bank to process our refund request (5 to 10 business days).
            </p>
            <p className="mb-4">
              If you need to return an item, simply login to your account, view
              the order using the 'Complete Orders' link under the My Account
              menu and click the Return Item(s) button. We'll notify you via
              e-mail of your refund once we've received and processed the
              returned item.
            </p>
            <p className="font-semibold mb-1">Shipping details</p>
            <p className="mb-4">
              We can ship to virtually any address in the world. Note that there
              are restrictions on some products, and some products cannot be
              shipped to international destinations.
            </p>
            <p className="mb-4">
              When you place an order, we will estimate shipping and delivery
              dates for you based on the availability of your items and the
              shipping options you choose. Depending on the shipping provider
              you choose, shipping date estimates may appear on the shipping
              quotes page.
            </p>
            <p className="mb-4">
              Please also note that the shipping rates for many items we sell
              are weight-based. The weight of any such item can be found on its
              detail page. To reflect the policies of the shipping companies we
              use, all weights will be rounded up to the next full pound.
            </p>
          </div>
        )}

        {activeTab === "Reviews" && (
          <div>
            {averageRating && (
              <p className="mb-4 font-semibold">
                Average Rating: ⭐ {averageRating}
              </p>
            )}

            {reviewList.length > 0 ? (
              reviewList.map(([key, r], i) => (
                <div key={i} className="border rounded p-3 mb-3">
                  <div className="text-yellow-500 mb-1">
                    {"★".repeat(r.rating)}
                    {"☆".repeat(5 - r.rating)}
                  </div>
                  <h4 className="font-bold">{r.title}</h4>
                  <p>{r.comment}</p>
                  <p className="text-sm text-gray-600">— {r.name}</p>
                  <div className="flex gap-2 mt-2">
                    {(r.images || []).map((img, j) => (
                      <img
                        key={j}
                        src={img}
                        alt="review"
                        className="w-20 h-20 object-cover rounded"
                      />
                    ))}
                  </div>
                  {(currentUser?.uid === r.uid || isAdmin) && (
                    <div className="mt-2 flex gap-2">
                      <button
                        className="text-blue-600 text-sm"
                        onClick={() => handleEdit(key, r)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-500 text-sm"
                        onClick={() => handleDelete(key, r.uid)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p>No reviews yet.</p>
            )}

            <button
              onClick={() => setWritingReview(true)}
              className="bg-rose-500 text-white px-4 py-2 rounded mt-4"
            >
              {editingReviewKey ? "Edit Review" : "Write a review"}
            </button>

            {writingReview && (
              <form onSubmit={handleSubmitReview} className="mt-6">
                <label className="block mb-1">Rating</label>
                <div className="flex mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`cursor-pointer text-xl ${
                        formData.rating >= star
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, rating: star }))
                      }
                    >
                      ★
                    </span>
                  ))}
                </div>

                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Title"
                  className="w-full border p-2 mb-2 rounded"
                />
                <textarea
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                  placeholder="Comment"
                  rows={3}
                  className="w-full border p-2 mb-2 rounded"
                />
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="w-full border p-2 mb-2 rounded"
                />
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your email"
                  className="w-full border p-2 mb-4 rounded"
                />

                <div
                  className="mt-2 border-2 border-dashed border-gray-300 p-4 rounded text-center"
                  onClick={() => fileInputRef.current.click()}
                  onDrop={handleDragDrop}
                  onDragOver={(e) => e.preventDefault()}
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

                <div className="flex gap-2 mt-3">
                  {imagePreviews.map((src, i) => (
                    <div key={i} className="relative w-20 h-20">
                      <img
                        src={src}
                        className="w-full h-full object-cover rounded"
                        alt=""
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-0 right-0 text-white bg-red-600 px-1 rounded"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setWritingReview(false);
                      setEditingReviewKey(null);
                      setFormData({
                        title: "",
                        comment: "",
                        name: "",
                        email: "",
                        rating: 0,
                        images: [],
                      });
                      setImagePreviews([]);
                    }}
                    className="px-4 py-2 border border-gray-400 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-rose-500 text-white rounded"
                  >
                    {editingReviewKey ? "Update Review" : "Submit Review"}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
