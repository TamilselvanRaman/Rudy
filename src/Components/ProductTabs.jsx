import { useEffect, useState } from "react";
import { ref, push, onValue } from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { database } from "../firebaseConfig";

const tabs = ["Description", "Shipping & Returns", "Reviews"];
const storage = getStorage();

export default function ProductTabs({ product }) {
  const [activeTab, setActiveTab] = useState("Description");
  const [writingReview, setWritingReview] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewData, setReviewData] = useState({
    title: "",
    comment: "",
    name: "",
    email: "",
    rating: 0,
    image: null,
  });

  useEffect(() => {
    if (!product?.id) return;
    const reviewsRef = ref(database, `reviews/${product.id}`);
    const unsubscribe = onValue(reviewsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setReviews(Object.values(data));
      } else {
        setReviews([]);
      }
    });

    return () => unsubscribe();
  }, [product?.id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (
      !reviewData.rating ||
      !reviewData.title ||
      !reviewData.comment ||
      !reviewData.name ||
      !reviewData.email
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    const reviewsRef = ref(database, `reviews/${product.id}`);
    let imageUrl = null;

    if (reviewData.image) {
      const imageRef = storageRef(
        storage,
        `reviews/${Date.now()}_${reviewData.image.name}`
      );
      await uploadBytes(imageRef, reviewData.image);
      imageUrl = await getDownloadURL(imageRef);
    }

    await push(reviewsRef, {
      ...reviewData,
      image: imageUrl,
      timestamp: Date.now(),
    });

    alert("Review submitted!");
    setReviewData({
      title: "",
      comment: "",
      name: "",
      email: "",
      rating: 0,
      image: null,
    });
    setWritingReview(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex space-x-2 border-b mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setWritingReview(false);
            }}
            className={`px-4 py-2 font-medium rounded-t-md focus:outline-none ${
              activeTab === tab
                ? "bg-rose-200 text-black"
                : "bg-sky-100 text-black hover:bg-sky-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white p-4 border rounded-md shadow-sm text-sm text-gray-800">
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
          <div className="text-center max-w-2xl mx-auto">
            <p className="font-semibold text-lg mb-4">Customer Reviews</p>

            {reviews.length > 0 ? (
              <div className="mb-4 space-y-4">
                {reviews.map((review, i) => (
                  <div
                    key={i}
                    className="border p-3 rounded shadow-sm text-left"
                  >
                    <div className="text-yellow-400 text-sm mb-1">
                      {"★".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)}
                    </div>
                    <h4 className="font-semibold">{review.title}</h4>
                    <p className="text-sm">{review.comment}</p>
                    <p className="text-xs text-gray-500">— {review.name}</p>
                    {review.image && (
                      <img
                        src={review.image}
                        alt="Review"
                        className="w-full max-w-xs mt-2 rounded"
                      />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex gap-15 items-center justify-center ">
                <div className="mb-4 flex  flex-col items-center space-y-2  ">
                  <div className="text-yellow-400 text-xl">
                    {"★".repeat(0)}
                    {"☆".repeat(5)}
                  </div>
                  <p className=" text-md -mt-1">
                    Be the first to write a review
                  </p>
                </div>
                { !writingReview &&
                    <button
                  onClick={() => setWritingReview(true)}
                  className="bg-rose-200 text-white px-4 py-2 rounded"
                >
                  Write a review
                </button>
                }
                {writingReview && (
                  <button
                    type="button"
                    onClick={() => setWritingReview(false)}
                    className="px-4 py-2 border border-rose-200 text-rose-500 rounded"
                  >
                    Cancel review
                  </button>
                )}
              </div>
            )}

            {!writingReview ? (
              <div className="mt-4"></div>
            ) : (
              <form
                className="text-left max-w-xl mx-auto mt-6"
                onSubmit={handleSubmitReview}
              >
                <p className="font-semibold text-center text-lg mb-4">
                  Write a review
                </p>

                <label className="block mb-2 font-medium">Rating</label>
                <div className="flex space-x-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-xl cursor-pointer ${
                        reviewData.rating >= star
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                      onClick={() =>
                        setReviewData((prev) => ({ ...prev, rating: star }))
                      }
                    >
                      ★
                    </span>
                  ))}
                </div>

                <label className="block mb-1 font-medium">
                  Review Title <span className="text-xs">(100)</span>
                </label>
                <input
                  type="text"
                  className="w-full border px-3 py-2 mb-4 rounded focus:outline-none"
                  placeholder="Give your review a title"
                  value={reviewData.title}
                  onChange={(e) =>
                    setReviewData((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                />

                <label className="block mb-1 font-medium">Review</label>
                <textarea
                  className="w-full border px-3 py-2 mb-4 rounded focus:outline-none"
                  rows="4"
                  placeholder="Write your comments here"
                  value={reviewData.comment}
                  onChange={(e) =>
                    setReviewData((prev) => ({
                      ...prev,
                      comment: e.target.value,
                    }))
                  }
                ></textarea>

                <label className="block mb-2 font-medium">
                  Picture/Video (optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="mb-4"
                  onChange={(e) =>
                    setReviewData((prev) => ({
                      ...prev,
                      image: e.target.files[0],
                    }))
                  }
                />

                <label className="block mb-1 font-medium">
                  Name (displayed publicly)
                </label>
                <input
                  type="text"
                  className="w-full border px-3 py-2 mb-4 rounded focus:outline-none"
                  placeholder="Enter your name (public)"
                  value={reviewData.name}
                  onChange={(e) =>
                    setReviewData((prev) => ({ ...prev, name: e.target.value }))
                  }
                />

                <label className="block mb-1 font-medium">Email</label>
                <input
                  type="email"
                  className="w-full border px-3 py-2 mb-4 rounded focus:outline-none"
                  placeholder="Enter your email (private)"
                  value={reviewData.email}
                  onChange={(e) =>
                    setReviewData((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                />

                <p className="text-xs text-gray-500 mb-4">
                  How we use your data: We'll only contact you about the review
                  you left, and only if necessary.
                </p>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setWritingReview(false)}
                    className="px-4 py-2 border border-rose-200 text-rose-500 rounded"
                  >
                    Cancel review
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-rose-200 text-white rounded"
                  >
                    Submit Review
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
