import React, { useEffect, useState, useContext } from "react";
import { ref, get, remove, child } from "firebase/database";
import { database } from "../../firebase/firebaseConfig";
import { Trash2 } from "lucide-react";
import { AuthContext } from "../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function Wishlist() {
  const { currentUser } = useContext(AuthContext);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch wishlist
  useEffect(() => {
    if (!currentUser) return;

    const fetchWishlist = async () => {
      setLoading(true);
      const dbRef = ref(database);
      const snapshot = await get(child(dbRef, `wishlist/${currentUser.uid}`));
      if (snapshot.exists()) {
        const items = Object.entries(snapshot.val()).map(([id, data]) => ({
          id,
          ...data,
        }));
        setWishlistItems(items);
      }
      setLoading(false);
    };

    fetchWishlist();
  }, [currentUser]);

  // Remove item
  const handleRemove = async (itemId) => {
    if (!currentUser) return;
    await remove(ref(database, `wishlist/${currentUser.uid}/${itemId}`));
    setWishlistItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      {/* Banner */}
      <div className="w-full bg-[#f4f1ee] py-10 flex flex-col items-center">
        <h1 className="text-3xl font-semibold tracking-widest">WISHLIST</h1>
        <p className="text-xs mt-1 text-gray-500">Home / Wishlist</p>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          Your wishlist is empty.
        </div>
      ) : (
        <div className="w-full max-w-5xl mt-8 border rounded-lg overflow-hidden shadow-sm">
          {/* Table Header */}
          <div className="hidden sm:grid grid-cols-5 bg-[#c2d8e0] text-sm uppercase font-medium text-gray-700 text-center">
            <div className="py-3">Image</div>
            <div className="py-3">Product</div>
            <div className="py-3">Price</div>
            <div className="py-3">Purchase</div>
            <div className="py-3">Remove</div>
          </div>

          {/* Items */}
          {wishlistItems.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-1 sm:grid-cols-5 items-center text-center border-b last:border-0 p-4 sm:p-0"
            >
              {/* Image */}
              <div className="flex justify-center sm:py-4 mb-4 sm:mb-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-contain"
                />
              </div>

              {/* Product */}
              <div className="text-left pl-4 font-medium">{item.name}</div>

              {/* Price */}
              <div className="py-2 sm:py-4 text-gray-700">
                ${parseFloat(item.price).toFixed(2)}
              </div>

              {/* Purchase */}
              <div className="py-2 sm:py-4">
                <button
                  onClick={() => navigate(`/product/${item.id}`)}
                  className="bg-[#c2d8e0] hover:bg-[#a4c3d0] text-sm px-4 py-2 rounded transition font-medium"
                >
                  SELECT OPTIONS
                </button>
              </div>

              {/* Remove */}
              <div className="py-2 sm:py-4">
                <button
                  onClick={() => handleRemove(item.id)}
                  className="text-gray-500 hover:text-red-500"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
