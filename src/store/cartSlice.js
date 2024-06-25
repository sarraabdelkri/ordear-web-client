import { Restaurant } from "@material-ui/icons";
import { createSlice } from "@reduxjs/toolkit";

const initialState = { cartData : [], total : 0 , tps : 0, tvq : 0}

const cartSlice = createSlice({
    name : 'cart',
    initialState,
    reducers : {
      setCart(state,action)  {
        state.total = action.payload.total
        state.cartData = action.payload.cartData
        state.tps = action.payload.convertedPriceTPS
        state.tvq = action.payload.convertedPriceTVQ
      },
    
    setTps(state, action) {
      state.tps = action.payload;
    },
    setTvq(state, action) {
      state.tvq = action.payload;
    },
    setTotal(state, action) {
      state.total = action.payload;
    },
      addToCart: (state, action) => {
        const existingItem = state.cartItems.find(item => item.id === action.payload.id);
        if (existingItem) {
          existingItem.quantity += action.payload.quantity;
        } else {
          state.cartItems.push({ ...action.payload, quantity: action.payload.quantity });
        }
        state.total += action.payload.price * action.payload.quantity;
      },
    removeFromCart(state, action) {
        const id = action.payload;
        const existingItem = state.cartItems.find(item => item.id === id);
        if (existingItem && existingItem.quantity > 1) {
            existingItem.quantity -= 1;
        } else {
            state.cartItems = state.cartItems.filter(item => item.id !== id);
        }
        state.total = state.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    },
    clearCart(state) {
        state.cartItems = [];
        state.total = 0;
    },
    incrementCartCount(state) {
      state.itemCount++;
  },
  decrementCartCount(state) {
      state.itemCount--;
    },
    removeItem(state, action) {
      const item = state.cartData.find(item => item.id === action.payload.id);
      if (item) {
        state.total -= item.price * item.quantity;
        state.cartData = state.cartData.filter(item => item.id !== action.payload.id);
      }
    },
  }
})

export const cartActions = cartSlice.actions
export default cartSlice