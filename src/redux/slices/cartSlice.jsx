import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ref, get, push, update, remove, set } from "firebase/database";
import { database } from "../../firebase/firebaseConfig";

// Helper to get Firebase reference
const getUserCartRef = (uid) => ref(database, `cart/${uid}`);

// Fetch cart items from Firebase
export const fetchCart = createAsyncThunk(
  "cart/fetch",
  async (uid, { rejectWithValue }) => {
    try {
      const snapshot = await get(getUserCartRef(uid));
      const data = snapshot.val();
      if (data) {
        return Object.entries(data).map(([key, value]) => ({
          ...value,
          firebaseId: key,
        }));
      }
      return [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Add or update item in cart
export const addToCart = createAsyncThunk(
  "cart/add",
  async ({ uid, newItem }, { dispatch }) => {
    const cartRef = getUserCartRef(uid);
    const snapshot = await get(cartRef);
    const data = snapshot.val();

    if (data) {
      const existingEntry = Object.entries(data).find(
        ([_, item]) =>
          item.id === newItem.id &&
          item.weight === newItem.weight &&
          item.flavour === newItem.flavour
      );

      if (existingEntry) {
        const [key, existingItem] = existingEntry;
        await update(ref(database, `cart/${uid}/${key}`), {
          quantity: existingItem.quantity + newItem.quantity,
        });
        return dispatch(fetchCart(uid));
      }
    }

    await push(cartRef, newItem);
    dispatch(fetchCart(uid));
  }
);

// Increase item quantity
export const increaseQuantity = createAsyncThunk(
  "cart/increase",
  async ({ uid, firebaseId }, { dispatch }) => {
    const itemRef = ref(database, `cart/${uid}/${firebaseId}`);
    const snapshot = await get(itemRef);
    const item = snapshot.val();
    if (item) {
      await update(itemRef, { quantity: item.quantity + 1 });
      dispatch(fetchCart(uid));
    }
  }
);

// Decrease item quantity or remove
export const decreaseQuantity = createAsyncThunk(
  "cart/decrease",
  async ({ uid, firebaseId }, { dispatch }) => {
    const itemRef = ref(database, `cart/${uid}/${firebaseId}`);
    const snapshot = await get(itemRef);
    const item = snapshot.val();
    if (item) {
      if (item.quantity <= 1) {
        await remove(itemRef);
      } else {
        await update(itemRef, { quantity: item.quantity - 1 });
      }
      dispatch(fetchCart(uid));
    }
  }
);

// Remove a specific item from cart
export const removeFromCart = createAsyncThunk(
  "cart/remove",
  async ({ uid, firebaseId }, { dispatch }) => {
    await remove(ref(database, `cart/${uid}/${firebaseId}`));
    dispatch(fetchCart(uid));
  }
);

// Clear all items from cart
export const clearCart = createAsyncThunk(
  "cart/clear",
  async (uid, { dispatch }) => {
    await set(getUserCartRef(uid), null);
    dispatch(fetchCart(uid));
  }
);

// Slice definition
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: [],
    isOpen: false,
    loading: false,
    error: null,
  },
  reducers: {
    setCartOpen: (state, action) => {
      state.isOpen = action.payload;
    },
    toggleCartOpen: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.cartItems = action.payload;
        state.loading = false;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { setCartOpen, toggleCartOpen } = cartSlice.actions;
export default cartSlice.reducer;
