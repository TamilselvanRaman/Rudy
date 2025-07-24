import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import {
  fetchWishlist,
  removeWishlistItem,
} from "../../redux/slices/wishlistSlice";
import { useAuth } from "../../hooks/useAuth";

export default function Wishlist() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { items: wishlistItems, loading } = useSelector(
    (state) => state.wishlist
  );

  useEffect(() => {
    if (currentUser) {
      dispatch(fetchWishlist(currentUser.uid));
    }
  }, [currentUser, dispatch]);

  const handleRemove = (itemId) => {
    if (currentUser) {
      dispatch(removeWishlistItem({ uid: currentUser.uid, itemId }));
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      {/* Banner */}
      <BannerComponent
        title="Your Wishlist"
        subtitle="Home / Your Wishlist"
      />

      {loading ? (
        <div className="p-6 text-center">Loading...</div>
      ) : wishlistItems.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          Your wishlist is empty.
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block w-full max-w-5xl mt-15 border mb-15 border-gray-300 rounded-sm overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-[#c2d8e0] text-sm uppercase font-medium text-gray-700 text-center border-b border-black/40">
                  <th className="py-3 px-4 border-r border-[#f9f9f9] w-[130px]">
                    Image
                  </th>
                  <th className="py-3 px-4 border-r border-[#f9f9f9]">
                    Product
                  </th>
                  <th className="py-3 px-4 border-r border-[#f9f9f9]">Price</th>
                  <th className="py-3 px-4 border-r border-[#f9f9f9]">
                    Purchase
                  </th>
                  <th className="py-3 px-4">Remove</th>
                </tr>
              </thead>
              <tbody>
                {wishlistItems.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`text-center border-b last:border-none border-gray-200 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50/40"
                    }`}
                  >
                    <td className="py-4 px-4">
                      <div
                        className="flex justify-center cursor-pointer"
                        onClick={() => navigate(`/products/${item.id}`)}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-24 h-24 object-contain"
                        />
                      </div>
                    </td>
                    <td
                      className="font-semibold text-black text-sm px-4 py-4 cursor-pointer"
                      onClick={() => navigate(`/products/${item.id}`)}
                    >
                      {item.name}
                    </td>
                    <td className="text-black text-sm px-4 py-4">
                      ${parseFloat(item.price).toFixed(2)}
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => navigate(`/products/${item.id}`)}
                        className="bg-[#c2d8e0] hover:bg-[#ffdac1] hover:text-black/80 cursor-pointer font-semibold text-black text-sm px-4 py-2  transition"
                      >
                        SELECT OPTIONS
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="text-gray-600 hover:text-[#ffdac1] cursor-pointer transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden w-full px-4 mt-8 mb-10 space-y-6">
            {wishlistItems.map((item) => (
              <div
                key={item.id}
                className="border border-gray-200 rounded-md shadow-sm overflow-hidden bg-white"
              >
                <div
                  className="w-full cursor-pointer bg-gray-50"
                  onClick={() => navigate(`/products/${item.id}`)}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-60 object-contain p-4"
                  />
                </div>
                <div className="p-4 text-center">
                  <h2
                    className="font-medium text-base text-black mb-2 cursor-pointer"
                    onClick={() => navigate(`/products/${item.id}`)}
                  >
                    {item.name}
                  </h2>
                  <p className="text-sm text-gray-600 mb-4">
                    ${parseFloat(item.price).toFixed(2)}
                  </p>
                  <button
                    onClick={() => navigate(`/products/${item.id}`)}
                    className="block w-full bg-[#c2d8e0] hover:bg-[#a4c3d0] text-black text-sm py-2 rounded-sm font-medium transition"
                  >
                    SELECT OPTIONS
                  </button>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="mt-4 text-gray-600 hover:text-[#C48D69]"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
