// cartReducer.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: []
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action) {
      state.cartItems.push(action.payload); // Ajoute l'article au tableau des articles du panier
    },
 
  }
});

export const { addToCart } = cartSlice.actions;
export default cartSlice.reducer;
