import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ref, get, child } from "firebase/database";
import { database } from "../../firebase/firebaseConfig";

// Thunk to fetch products from Firebase Realtime Database
export const fetchProducts = createAsyncThunk("products/fetch", async () => {
  const dbRef = ref(database);
  const snapshot = await get(child(dbRef, "products"));

  if (snapshot.exists()) {
    const rawData = snapshot.val();

    // Flatten the data: categoryName → products
    const allProducts = Object.entries(rawData).flatMap(
      ([categoryName, category]) =>
        Object.entries(category).map(([productId, product]) => ({
          ...product,
          id: productId,
          category: categoryName,
        }))
    );

    return allProducts;
  }

  return [];
});

const productsSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    filteredProducts: [],
    ratings: [],
    loading: false,
    error: null,
    singleProduct: null, 
  },
  reducers: {
    setFilteredProducts(state, action) {
      state.filteredProducts = action.payload;
    },
    setSingleProduct(state, action) {
      state.singleProduct = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload;
        state.filteredProducts = action.payload;

        // Generate random rating/review data
        state.ratings = action.payload.map(() => ({
          rating: Math.floor(Math.random() * 4) + 2,
          reviews: Math.floor(Math.random() * 20) + 1,
        }));

        state.loading = false;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  },
});

// Actions
export const { setFilteredProducts, setSingleProduct } = productsSlice.actions;

// Selectors
export const selectAllProducts = (state) => state.products.products;
export const selectFilteredProducts = (state) =>
  state.products.filteredProducts;
export const selectProductRatings = (state) => state.products.ratings;
export const selectProductLoading = (state) => state.products.loading;
export const selectProductError = (state) => state.products.error;
export const selectSingleProduct = (state) => state.products.singleProduct;

// Reducer
export default productsSlice.reducer;
