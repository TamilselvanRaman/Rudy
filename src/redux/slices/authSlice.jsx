import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { app, database } from "../../firebase/firebaseConfig";
import { ref as dbRef, set, get, update } from "firebase/database";
import { updatePassword } from "firebase/auth";
import { sendPasswordResetEmail } from "firebase/auth";

const auth = getAuth(app);

// THUNKS
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return {
        uid: result.user.uid,
        email: result.user.email,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const signup = createAsyncThunk(
  "auth/signup",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = result.user;

      await set(dbRef(database, `users/${user.uid}`), {
        email: user.email,
        profileImage: "",
        name: "",
        dob: "",
        gender: "",
        phone: "",
      });

      return {
        uid: user.uid,
        email: user.email,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await signOut(auth);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const listenToAuthChanges = createAsyncThunk(
  "auth/listenToAuthChanges",
  async () => {
    return new Promise((resolve) => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          resolve({ uid: user.uid, email: user.email });
        } else {
          resolve(null);
        }
      });
    });
  }
);

export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async (userId, { rejectWithValue }) => {
    try {
      const snapshot = await get(dbRef(database, `users/${userId}`));
      if (snapshot.exists()) {
        return { userId, ...snapshot.val() };
      } else {
        throw new Error("User profile not found.");
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async ({ userId, ...updates }, { rejectWithValue }) => {
    try {
      await update(dbRef(database, `users/${userId}`), updates);
      return updates;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (email, { rejectWithValue }) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return "Password reset email sent";
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateProfileImage = createAsyncThunk(
  "auth/updateProfileImage",
  async ({ userId, imageUrl }, { rejectWithValue }) => {
    try {
      await update(dbRef(database, `users/${userId}`), {
        profileImage: imageUrl,
      });
      return imageUrl;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async ({ newPassword }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const user = auth.currentUser;

      if (!user) {
        throw new Error("No authenticated user");
      }

      await updatePassword(user, newPassword);
      return "Password updated successfully";
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUserReviews = createAsyncThunk(
  "auth/fetchUserReviews", // action type
  async (userId, { rejectWithValue }) => {
    try {
      const snapshot = await get(dbRef(database, "review"));

      // If no data exists under "review", return an empty array
      if (!snapshot.exists()) {
        console.log("No review data found.");
        return [];
      }

      // Get the review object
      const reviewData = snapshot.val();
      const userReviews = [];

      // Traverse through all products and their reviews
      Object.entries(reviewData).forEach(([productId, product]) => {
        if (product.reviews) {
          Object.values(product.reviews).forEach((review) => {
            // Check if the review belongs to the current user
            if (review.uid === userId) {
              userReviews.push({ ...review, productId });
            }
          });
        }
      });
      return userReviews; // Return the filtered reviews
    } catch (error) {
      console.error("Error fetching user reviews:", error.message);
      return rejectWithValue(error.message); // Pass error to Redux state
    }
  }
);

export const fetchUserOrders = createAsyncThunk(
  "orders/fetchUserOrders",
  async (userUid, thunkAPI) => {
    try {
      const dbRef = ref(database);
      const snapshot = await get(child(dbRef, "orders"));
      const ordersData = snapshot.exists() ? snapshot.val() : {};

      const userOrders = Object.entries(ordersData)
        .filter(([_, order]) => order.uid === userUid)
        .map(([id, order]) => ({
          id,
          ...order,
        }));

      return userOrders;
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch orders");
    }
  }
);

// SLICE
const authSlice = createSlice({
  name: "auth",
  initialState: {
    currentUser: null,
    profile: null,
    status: "idle",
    reviews: [],
    userOrders: [],
    loading: false,
    error: null,
  },
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(login.pending, (state) => {
        state.status = "loading";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentUser = action.payload;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Login failed";
      })

      // SIGNUP
      .addCase(signup.pending, (state) => {
        state.status = "loading";
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentUser = action.payload;
        state.error = null;
      })
      .addCase(signup.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Signup failed";
      })

      // LOGOUT
      .addCase(logout.fulfilled, (state) => {
        state.status = "idle";
        state.currentUser = null;
        state.profile = null;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Logout failed";
      })

      // AUTH STATE LISTENER
      .addCase(listenToAuthChanges.fulfilled, (state, action) => {
        state.currentUser = action.payload;
      })

      // FETCH USER PROFILE
      .addCase(fetchUserProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Profile fetch failed";
      })

      // UPDATE USER PROFILE
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile = {
            ...state.profile,
            ...action.payload,
          };
        }
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.error = action.payload || "Profile update failed";
      })

      // UPDATE PROFILE IMAGE
      .addCase(updateProfileImage.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile.profileImage = action.payload;
        }
        state.error = null;
      })
      .addCase(updateProfileImage.rejected, (state, action) => {
        state.error = action.payload || "Profile image update failed";
      }) // CHANGE PASSWORD
      .addCase(changePassword.pending, (state) => {
        state.status = "loading";
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Password update failed";
      })
      .addCase(resetPassword.pending, (state) => {
        state.status = "loading";
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Reset password failed";
      })
      .addCase(fetchUserReviews.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserReviews.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.reviews = action.payload;
        state.error = null;
      })
      .addCase(fetchUserReviews.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch user reviews";
      })
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.userOrders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// EXPORTS
export const { setCurrentUser } = authSlice.actions;

export default authSlice.reducer;
