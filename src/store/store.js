import { configureStore } from '@reduxjs/toolkit'
import  authSlice  from './authSlice'
import cartSlice from './cartSlice'
import restaurantSlice from './restaurantSlice'
import wishlistSlice from './wishlistSlice'

const store = configureStore({
    reducer : { auth : authSlice.reducer ,
                cart : cartSlice.reducer ,
                restaurant :  restaurantSlice.reducer,
                 wishlist : wishlistSlice.reducer}
})

export default store