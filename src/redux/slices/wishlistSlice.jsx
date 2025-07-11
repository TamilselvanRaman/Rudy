import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ref, get, remove, child, set } from "firebase/database";
import { database } from "../../firebase/firebaseConfig";

export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (uid, thunkAPI) => {
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, `wishlist/${uid}`));
    if (!snapshot.exists()) return [];
    return Object.entries(snapshot.val()).map(([id, data]) => ({
      id,
      ...data,
    }));
  }
);

export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async ({ uid, item }, thunkAPI) => {
    try {
      await set(ref(database, `wishlist/${uid}/${item.id}`), item);
      return item;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const removeWishlistItem = createAsyncThunk(
  "wishlist/removeWishlistItem",
  async ({ uid, itemId }, thunkAPI) => {
    await remove(ref(database, `wishlist/${uid}/${itemId}`));
    return itemId;
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchWishlist.rejected, (state) => {
        state.loading = false;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(removeWishlistItem.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export default wishlistSlice.reducer;
