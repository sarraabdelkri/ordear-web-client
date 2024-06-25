import { createSlice } from "@reduxjs/toolkit";

const initialState = { restaurantId : "", tableNb : "5"}

const restaurantSlice = createSlice({
    name : 'restaurant',
    initialState,
    reducers : {
      setRestaurantData(state,action)  {
        state.restaurantId = action.payload.restaurantId
        state.tableNb = action.payload.tableNb
      }
    }
})

export const restaurantActions = restaurantSlice.actions
export default restaurantSlice