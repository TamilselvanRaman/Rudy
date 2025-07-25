import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ref, get, child } from "firebase/database";
import { database } from "../../firebase/firebaseConfig";
import {
  FaMinus,
  FaPlus,
  FaTruck,
  FaEye,
  FaShareAlt,
  FaCommentDots,
} from "react-icons/fa";
import QueryForm from "../../Components/Shared/QueryForm";
import ProductTabs from "../../Components/Product/ProductTabs";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../../redux/slices/cartSlice";
import { addToWishlist } from "../../redux/slices/wishlistSlice";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.auth.currentUser);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const wishlistItems = useSelector((state) => state.wishlist.items);

  const [product, setProduct] = useState(null);
  const [selectedWeight, setSelectedWeight] = useState("");
  const [selectedFlavour, setSelectedFlavour] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState("");
  const [isQueryOpen, setIsQueryOpen] = useState(false);

  const rating = 4;
  const reviews = 120;

  useEffect(() => {
    const fetchProduct = async () => {
      const snapshot = await get(child(ref(database), "products"));
      if (snapshot.exists()) {
        const cats = Object.values(snapshot.val());
        const all = cats.flatMap((c) =>
          Object.entries(c)
            .filter(([k]) => k !== "id")
            .map(([key, p]) => ({ ...p, id: key }))
        );
        const single = all.find((p) => p.id === id);
        if (single) {
          setProduct(single);
          setSelectedWeight(single.weight?.[0] || "");
          setSelectedFlavour(single.flavour?.[0] || "");
          setMainImage(single.images?.[0] || "");
        }
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <div className="p-6">Loading...</div>;

  const onAddToCart = () => {
    dispatch(
      addToCart({
        uid: currentUser?.uid,
        newItem: {
          id: product.id,
          name: product.name,
          price: parseFloat(product.price),
          quantity,
          weight: selectedWeight,
          flavour: selectedFlavour,
          image: product.images?.[0] || "",
        },
      })
    );
    // setAddedToCart(true);
  };

  const onAddToWishlist = () => {
    if (!currentUser) {
      alert("You must be logged in to add to wishlist.");
      return;
    }

    dispatch(
      addToWishlist({
        uid: currentUser.uid,
        item: {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images?.[0] || "",
        },
      })
    );
    // setAddedToWishlist(true);
  };

  const isInCart = cartItems?.some(
    (item) =>
      item.id === product?.id &&
      item.weight === selectedWeight &&
      item.flavour === selectedFlavour
  );

  const isInWishlist = wishlistItems?.some((item) => item.id === product?.id);
  console.log("isInWishlist", isInWishlist);

  return (
    <div>
      {/* Banner */}

      <BannerComponent
        title={product.name}
        subtitle={`Home / ${product.name}`}
      />

      <div className="max-w-4xl mx-auto p-6 flex flex-col md:flex-row gap-10">
        {/* Left column */}
        <div className="w-full md:w-1/2 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-[350px]">
              <img
                src={mainImage}
                alt="Main"
                className="w-full h-auto rounded-lg shadow-md object-cover"
              />
            </div>
            <div className="flex sm:flex-col gap-3 justify-center items-center sm:items-start">
              {product.images?.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`thumb-${i}`}
                  onClick={() => setMainImage(img)}
                  className={`w-16 h-16 rounded border object-cover cursor-pointer hover:shadow-md ${
                    mainImage === img ? "ring-2 ring-pink-300" : ""
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="w-full md:w-1/2 space-y-4">
          <h1 className="text-3xl font-semibold">{product.name}</h1>
          <p className="text-lg text-gray-600">${product.price}</p>

          {/* Rating */}
          <div className="flex items-center text-xs text-gray-500 mt-1">
            <div className="text-pink-400 text-sm flex">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <span
                    key={i}
                    className={i < rating ? "text-pink-500" : "text-gray-300"}
                  >
                    ★
                  </span>
                ))}
            </div>
            <span className="ml-2">{reviews} reviews</span>
          </div>

          {/* Attributes */}
          <div className="grid grid-cols-[120px_1fr] gap-y-4 text-sm text-gray-700 mt-6">
            <div className="font-semibold text-gray-800">Type:</div>
            <div>{product.type || "Alcohol Free"}</div>
            <div className="font-semibold text-gray-800">Vendor:</div>
            <div>{product.vendor}</div>
            <div className="font-semibold text-gray-800">Weight:</div>
            <div className="flex gap-2 flex-wrap">
              {product.weight?.map((w) => (
                <button
                  key={w}
                  onClick={() => setSelectedWeight(w)}
                  className={`px-4 py-1.5 rounded-md border font-semibold text-sm transition min-w-[64px] text-center ${
                    selectedWeight === w
                      ? "bg-[#f5e9e4] text-[#b15b5b] border-[#e8bdbd]"
                      : "bg-[#fdf7f3] text-[#444] border-[#eee] hover:bg-[#f3ece9]"
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>

            <div className="font-semibold text-gray-800">Flavour:</div>
            <div className="flex gap-2 flex-wrap items-center">
              {product.flavour?.map((f) => (
                <button
                  key={f}
                  onClick={() => setSelectedFlavour(f)}
                  className={`px-4 py-1.5 rounded-md border font-semibold text-sm transition min-w-[100px] text-center ${
                    selectedFlavour === f
                      ? "bg-[#fdeaea] text-[#cc5c5c] border-[#e0b4b4]"
                      : "bg-[#fdf9f7] text-[#555] border-[#eee] hover:bg-[#f4eceb]"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="font-semibold text-gray-800">Quantity:</div>
            <div className="flex items-center border border-gray-300/60 rounded-md bg-white shadow-sm overflow-hidden w-max">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="bg-gray-100 px-3 py-2 text-gray-600 hover:bg-gray-200"
              >
                <FaMinus size={12} />
              </button>
              <span className="px-4 py-1 text-base font-medium">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="bg-gray-100 px-3 py-2 text-gray-600 hover:bg-gray-200"
              >
                <FaPlus size={12} />
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 mt-6">
            {isInCart ? (
              <button
                onClick={() => navigate("/cartpage")}
                className="bg-rose-300 hover:bg-rose-400 text-black px-6 py-2 rounded-lg shadow text-sm transition font-semibold"
              >
                View Cart
              </button>
            ) : (
              <button
                onClick={onAddToCart}
                className="bg-[#b0c4d6] hover:bg-[#9ab3c6] text-gray-800 px-6 py-2 rounded-lg shadow text-sm transition font-semibold"
              >
                Add To Cart
              </button>
            )}

            {isInWishlist ? (
              <button
                onClick={() => navigate("/wishlist")}
                className="bg-pink-200 hover:bg-pink-300 text-black px-6 py-2 rounded-lg shadow text-sm transition font-semibold"
              >
                View Wishlist
              </button>
            ) : (
              <button
                onClick={onAddToWishlist}
                className="bg-[#dfe5ea] hover:bg-[#ccd4da] text-gray-700 px-6 py-2 rounded-lg shadow text-sm transition font-semibold"
              >
                Add to Wishlist
              </button>
            )}
          </div>

          <div className="w-68 mt-4">
            <button
              onClick={() => navigate("/cartpage")}
              className="w-full mt-3 bg-[#c5dde0] hover:bg-[#a9cbd0] text-gray-900 text-sm px-10 py-2 rounded-lg shadow font-semibold transition"
            >
              Buy it now
            </button>
          </div>

          {/* Extra info */}
          <div className="mt-6 text-sm text-gray-600 space-y-2">
            <p className="flex items-center gap-2">
              <FaTruck className="text-blue-500" />
              Estimated delivery:{" "}
              <span className="font-medium text-gray-800">5–7 days</span>
            </p>
            <p className="flex items-center gap-2">
              <FaEye className="text-pink-400" />
              <span>
                <span className="font-medium text-gray-800">181</span> people
                viewing now
              </span>
            </p>
            <p className="flex items-center gap-2">
              <FaShareAlt className="text-gray-600" />
              Share
            </p>
          </div>

          {/* Query form */}
          <div className="mt-6">
            {isQueryOpen && <QueryForm onClose={() => setIsQueryOpen(false)} />}
            <a
              onClick={() => setIsQueryOpen(true)}
              className="cursor-pointer inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 underline font-semibold text-sm mt-2"
            >
              <FaCommentDots className="text-blue-500" />
              Let us know about your query!
            </a>
          </div>
        </div>
      </div>

      <ProductTabs product={product} />
    </div>
  );
}

export default ProductDetail;
