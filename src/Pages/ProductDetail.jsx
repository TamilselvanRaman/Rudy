import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ref, get, child } from "firebase/database";
import { database } from "../firebaseConfig";
import { Minus, Plus } from "lucide-react";
import {
  FaMinus,
  FaPlus,
  FaTruck,
  FaEye,
  FaShareAlt,
  FaCommentDots,
} from "react-icons/fa";
import QueryForm from "../Components/QueryForm";
import  ProductTabs  from "../Components/ProductTabs";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedWeight, setSelectedWeight] = useState("");
  const [selectedFlavour, setSelectedFlavour] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState("");
  const [isQueryOpen, setIsQueryOpen] = useState(false);

  const rating = 4; // Static rating for now
  const reviews = 120; // Static review count for now

  useEffect(() => {
    const fetchProduct = async () => {
      const dbRef = ref(database);
      const snapshot = await get(child(dbRef, "products"));
      if (snapshot.exists()) {
        const allCategories = Object.values(snapshot.val());
        const allProducts = allCategories.flatMap((category) => {
          const cat = category.id;
          return Object.entries(category)
            .filter(([key]) => key !== "id")
            .map(([key, p]) => ({ ...p, id: key, category: cat }));
        });

        const singleProduct = allProducts.find((p) => p.id === id);
        setProduct(singleProduct);
        setSelectedWeight(singleProduct?.weight?.[0]);
        setSelectedFlavour(singleProduct?.flavour?.[0]);
        setMainImage(singleProduct?.images?.[0]);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <div className="p-6">Loading...</div>;

  return (
    <div>
      {/* Banner */}
      <div
        className="bg-cover bg-center h-64 flex flex-col justify-center items-center text-black"
        style={{
          backgroundImage: `url('/banner-image.jpg')`,
          backgroundColor: "rgba(255,255,255,0.4)",
          backgroundBlendMode: "lighten",
        }}
      >
        <h1 className="text-3xl font-bold uppercase ">Product</h1>
        <p className="text-[13px] mt-2 ">Home / {product.name}</p>
      </div>

      <div className="max-w-4xl mx-auto p-6 flex flex-col md:flex-row gap-10">
        {/* Left Side */}
        <div className="w-full md:w-1/2 space-y-4">
          {/* Main Image and Thumbnails */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Main Image */}
            <div className="w-full sm:w-[350px]">
              <img
                src={mainImage}
                alt="Main"
                className="w-full h-auto rounded-lg shadow-md object-cover"
              />
            </div>

            {/* Thumbnails */}
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

        {/* Right Side - Product Info */}
        <div className="w-full md:w-1/2 space-y-4">
          <h1 className="text-3xl font-semibold">{product.name}</h1>
          <p className="text-lg text-gray-600">${product.price}</p>

          {/* Rating and reviews */}

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

          {/* Table-like layout */}
          <div className="grid grid-cols-[120px_1fr] gap-y-4 text-sm text-gray-700 mt-6">
            {/* Type */}
            <div className="font-semibold text-gray-800">Type:</div>
            <div>{product.type || "Alcohol Free"}</div>

            {/* Vendor */}
            <div className="font-semibold text-gray-800">Vendor:</div>
            <div>{product.vendor}</div>

            {/* Weight */}
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

            {/* Flavour */}
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

            {/* Quantity */}
            <div className="font-semibold text-gray-800">Quantity:</div>
            <div className="flex items-center border rounded-md bg-white shadow-sm overflow-hidden w-max">
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

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mt-6">
            <button className="bg-[#b0c4d6] hover:bg-[#9ab3c6] text-gray-800 px-6 py-2 rounded-lg shadow text-sm transition font-semibold">
              Add To Cart
            </button>
            <button className="bg-[#dfe5ea] hover:bg-[#ccd4da] text-gray-700 px-6 py-2 rounded-lg shadow text-sm transition font-semibold">
              View Wishlist
            </button>
          </div>

          <div className="w-68 mt-4 ">
            <button className="w-full mt-3 bg-[#c5dde0] hover:bg-[#a9cbd0] text-gray-900 text-sm px-10  py-2 rounded-lg shadow font-semibold transition">
              Buy it now
            </button>
          </div>

          {/* Footer Info */}
          {/* Footer Info */}
          <div className="mt-6 text-sm text-gray-600 space-y-2">
            <p className="flex items-center gap-2">
              <FaTruck className="text-blue-500" />
              <span>
                Estimated delivery:{" "}
                <span className="font-medium text-gray-800">5–7 days</span>
              </span>
            </p>
            <p className="flex items-center gap-2">
              <FaEye className="text-pink-400" />
              <span>
                <span className="font-medium text-gray-800">181</span> people
                are viewing this right now
              </span>
            </p>
            <p className="flex items-center gap-2">
              <FaShareAlt className="text-gray-600" />
              <span>Share</span>
            </p>
          </div>

          {/* Query Link + Form */}
          <div className="mt-6">
            {/* Show Modal if Open */}
            {isQueryOpen && <QueryForm onClose={() => setIsQueryOpen(false)} />}

            {/* Trigger Button */}
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
