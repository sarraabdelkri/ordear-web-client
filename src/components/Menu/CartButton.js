import cartIcon from '../../assets/cart-plus-solid.svg'
import styles from './Menu.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartPlus } from '@fortawesome/free-solid-svg-icons'
import { useSelector , useDispatch  } from 'react-redux';
import Cart from './Cart';
import { useState, useEffect } from 'react';
import { cartActions } from "../../store/cartSlice";




const CartButton = () => {
  
  const isAuth = useSelector(state => state.auth.isAuthenticated)
  const total = useSelector(state => state.cart.total)
  const dispatch = useDispatch()
  
  const [showCart,setShowCart] = useState(false)
  

  const fetchCart = async() => {
    try {
                  
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/cart/get/cartTrash/by/user`,{
          credentials : "include"
        })
        const responseData = await response.json()
        if(!response.ok) {
          throw new Error("cart doesn't exist")
         }
         else {
            dispatch(cartActions.setCart(responseData))
           
         }
   }
   catch(err) {
    console.error(err.message)
   }
}

useEffect(() => {
  fetchCart()
},[])
  


    return (
        <>
        { isAuth &&
    <div className={styles.cartBtn} onClick={() => setShowCart(true)}>
        <FontAwesomeIcon icon={faCartPlus} beat style={{color: "#044494",}} className={styles.carticon} />
        <h3>{total}$</h3>
    </div>
        }
        {
          showCart && <Cart closeModal={() => setShowCart(false)} />
        }
        </>
  )
}

export default CartButton