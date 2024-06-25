import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  count: 0
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist(state, action) {
      state.items.push(action.payload);
      state.count += 1;
    },
    removeFromWishlist(state, action) {
      state.items = state.items.filter(item => item._id !== action.payload._id);
      state.count -= 1;
    },
    toggleWishlist(state, action) {
      const index = state.items.findIndex(item => item._id === action.payload._id);
      if (index >= 0) {
        // Item exists in wishlist, remove it
        state.items.splice(index, 1);
        state.count -= 1;
      } else {
        // Item not in wishlist, add it
        state.items.push(action.payload);
        state.count += 1;
      }
    },
    setWishlist(state, action) {
      state.items = action.payload;
      state.count = action.payload.length;
    }
  }
});

export const wishlistActions = wishlistSlice.actions;
export default wishlistSlice.reducer;
