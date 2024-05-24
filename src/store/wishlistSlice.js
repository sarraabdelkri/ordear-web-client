import { createSlice } from '@reduxjs/toolkit';

export const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState: {
        count: 0
    },
    reducers: {
        incrementWishlistCount: state => {
            state.count += 1;
        }
    }
});

export const { incrementWishlistCount } = wishlistSlice.actions;
export default wishlistSlice;
