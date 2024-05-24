import { CART_ADD_ITEM, CART_REMOVE_ITEM, CART_SAVE_SHIPPING_ADDRESS, CART_RESET,
  CART_SAVE_PAYMENT_METHOD,  } from './cartConstants';

//when you press add to cart button, it will perform this action
export const cartReducer = (state = {cartItems: []}, action) => {
  switch(action.type){
    case CART_ADD_ITEM:
      const item = action.payload
      const existItem = state.cartItems.find(x => x.product === item.product); //checks if the item is already in the cart
      if (existItem){
       // item.qty = existItem.qty + item.qty
        return {
          ...state,
          cartItems: state.cartItems.map(x => x.product === existItem.product ? item : x)
        }
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, item]
        }
      }

    case CART_REMOVE_ITEM:
      return {
        ...state,
        cartItems: state.cartItems.filter(x => x.product !== action.payload) //filters out the item that matches the payload
      }

      case CART_RESET:
        return {cartItems: []} 
        
    case CART_SAVE_SHIPPING_ADDRESS:
      return {
        ...state,
        shippingAddress: action.payload,
      }
    case CART_SAVE_PAYMENT_METHOD:
      return {
        ...state,
        paymentMethod: action.payload,
      }
    default:
      return state
  }
}