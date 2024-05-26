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
    setWishlist(state, action) {
      state.items = action.payload;
      state.count = action.payload.length;
    }
  }
});

export const wishlistActions = wishlistSlice.actions;
export default wishlistSlice;
