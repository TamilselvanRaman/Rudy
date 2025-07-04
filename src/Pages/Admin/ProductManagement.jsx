import React, { useEffect, useState } from "react";
import { database } from "../../firebase/firebaseConfig";
import { ref, child, get, remove, update, push, set } from "firebase/database";
import ProductEntry from "./ProductEntry";

const ProductManagement = () => {
  const [productsByCategory, setProductsByCategory] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  // Fetch products grouped by category
  const fetchProducts = async () => {
    try {
      const dbRef = ref(database);
      const snapshot = await get(child(dbRef, "products"));

      if (snapshot.exists()) {
        const rawData = snapshot.val();
        const grouped = {};

        for (const category in rawData) {
          const categoryProducts = rawData[category];
          grouped[category] = Object.entries(categoryProducts).map(
            ([productId, productData]) => ({
              id: productId,
              ...productData,
            })
          );
        }

        setProductsByCategory(grouped);
      } else {
        setProductsByCategory({});
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Delete a product
  const handleDelete = async (category, productId) => {
    try {
      await remove(ref(database, `products/${category}/${productId}`));
      fetchProducts();
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  };

  // Edit a product (open modal with pre-filled values)
  const handleEdit = (product, category) => {
    setEditProduct({ ...product, category });
    setShowModal(true);
  };

  // Add new product
  const handleAdd = () => {
    setEditProduct(null);
    setShowModal(true);
  };

  // Save (Add or Update) a product
  const handleSave = async (data) => {
    const { id, category, ...productData } = data;
    const categoryRef = ref(database, `products/${category}`);

    try {
      if (id) {
        // Update existing
        const productRef = child(categoryRef, id);
        await update(productRef, productData);
      } else {
        // Add new
        const newProductRef = push(categoryRef);
        await set(newProductRef, productData); // Use set instead of update here
      }

      setShowModal(false);
      setEditProduct(null);
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Product Management</h2>

      <div className="mb-6">
        <button
          onClick={handleAdd}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Add Product
        </button>
      </div>

      {!showModal && (
        <>
          {Object.keys(productsByCategory).map((category) => (
            <div key={category} className="mb-10">
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                {category}
              </h3>

              <div className="overflow-x-auto">
                <table className="min-w-full table-fixed bg-white shadow-md rounded-lg">
                  <thead>
                    <tr className="bg-gray-200 text-gray-700 text-left">
                      <th className="w-1/3 px-4 py-2">Product Name</th>
                      <th className="w-1/6 px-4 py-2">Quantity</th>
                      <th className="w-1/6 px-4 py-2">Price</th>
                      <th className="w-1/3 px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productsByCategory[category].map((product, index) => (
                      <tr
                        key={product.id}
                        className={`border-t ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        } hover:bg-gray-100 transition`}
                      >
                        <td className="px-4 py-2 truncate">{product.name}</td>
                        <td className="px-4 py-2">{product.quantity || 0}</td>
                        <td className="px-4 py-2">₹{product.price}</td>
                        <td className="px-4 py-2 space-x-2">
                          <button
                            onClick={() => handleEdit(product, category)}
                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(category, product.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </>
      )}

      {showModal && (
        <ProductEntry
          product={editProduct}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default ProductManagement;
