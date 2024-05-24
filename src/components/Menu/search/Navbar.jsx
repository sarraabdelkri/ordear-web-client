import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'; 
import { BsCart2 } from "react-icons/bs";
import { Link } from 'react-router-dom';
import { cartActions } from '../../../store/cartSlice';
import logo from '../../../assets/logo545.png';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Box } from '@mui/material';
import { Drawer } from '@mui/material';
import { Divider } from '@mui/material';
import { ListItemButton } from '@mui/material';
import { ListItemIcon } from '@mui/material';
import { Home as HomeIcon } from '@mui/icons-material';
import { Info as InfoIcon } from '@mui/icons-material';
import { CommentRounded as CommentRoundedIcon } from '@mui/icons-material';
import { PhoneRounded as PhoneRoundedIcon } from '@mui/icons-material';
import { ShoppingCartRounded as ShoppingCartRoundedIcon } from '@mui/icons-material';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const Navbar = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const cartItems = useSelector(state => state.cart.cartData || []); // Ensure it defaults to an empty array
  const [anchorEl, setAnchorEl] = useState(null);
  const wishlistCount = useSelector(state => state.wishlist.count);
  const isAuth = useSelector(state => state.auth.isAuthenticated)
 
  const dispatch = useDispatch()
  

// Assuming each item in your cart looks like {id: 'abc', quantity: 2}
const handleCartClick = (event) => {
  setAnchorEl(event.currentTarget);
};

const handleCartClose = () => {
  setAnchorEl(null);
};

const open = Boolean(anchorEl);
const id = open ? 'simple-popover' : undefined;
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
const total = useSelector(state => state.cart.total)
useEffect(()=>{


},[cartItems,total]);
useEffect(() => {
fetchCart()
},[])
const handleIncreaseQuantity = (itemId) => {
  dispatch(cartActions.increaseQuantity(itemId));
};

const handleDecreaseQuantity = (itemId) => {
  dispatch(cartActions.decreaseQuantity(itemId));
};

const handleRemoveItem = (itemId) => {
  dispatch(cartActions.removeItem(itemId));
};




  console.log(useSelector(state => state));
  const menuOptions = [
    {
      text: "Home",
      icon: <HomeIcon />,
    },
    {
      text: "About",
      icon: <InfoIcon />,
    },
    {
      text: "Testimonials",
      icon: <CommentRoundedIcon />,
    },
    {
      text: "Contact",
      icon: <PhoneRoundedIcon />,
    },
    {
      text: "Cart",
      icon: <ShoppingCartRoundedIcon />,
      onClick: () => setOpenCart(true)
    },
  ];

  return (
    <nav>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <a href="/" style={{ marginLeft: "50px" }}>
            <img src={logo} alt="logo" style={{ width: "150px" }} />
          </a>
        </div>
        <div className="navbar-links-container" style={{ display: "flex", justifyContent: "flex-end" }}>
          <a href="">Home</a>
          <a href="">About</a>
          <a href="">Testimonials</a>
          <a href="">Contact</a>
          
          <Link to="/cart" className="navbar-cart-link">
        
            <BsCart2 onClick={handleCartClick} style={{marginRight:"5px",marginLeft:"20px",marginBottom:"5px" }} />
            <span>${cartItems?.length}</span>
         
     
          <FontAwesomeIcon icon={faHeart} style={{ color: 'Red' ,marginRight:"30px",marginLeft:"20px"}} />
    
    </Link>
        </div>  
      </div>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleCartClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Typography sx={{ p: 2 }}>Your Shopping Cart</Typography>
        <List dense>
        {cartItems.map(item => (
                <ListItem key={item.id}>
                  <ListItemAvatar>
                    <Avatar alt={item.name} src={item.image} />
                  </ListItemAvatar>
                  <ListItemText primary={`${item.name} - $${item.price}`} secondary={`Quantity: ${item.quantity}`} />
                  <IconButton onClick={() => handleIncreaseQuantity(item.id)}><AddIcon /></IconButton>
                  <IconButton onClick={() => handleDecreaseQuantity(item.id)} disabled={item.quantity === 1}><RemoveIcon /></IconButton>
                  <IconButton onClick={() => handleRemoveItem(item.id)}><DeleteIcon /></IconButton>
                </ListItem>
              ))}
        </List>
        
        <Typography sx={{ p: 2 }}>
          Total: ${total}
          <Link to="/cart">Checkout</Link>
        </Typography>
      </Popover>
      <Drawer open={openMenu} onClose={() => setOpenMenu(false)} anchor="right">
        <Box sx={{ width: 250 }} role="presentation" onClick={() => setOpenMenu(false)} onKeyDown={() => setOpenMenu(false)}>
          <List>
            {menuOptions.map((item) => (
              <ListItem key={item.text} disablePadding onClick={item.onClick}>
                <ListItemButton>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <Drawer open={openCart} onClose={() => setOpenCart(false)} anchor="right">
          <Box role="presentation" sx={{ width: 250 }}>
            <List>
              {cartItems.map((item) => (
                <ListItem key={item.id} disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      {/* Example image placeholder */}
                      <img src="/path/to/default-image.png" alt={item.name} style={{ width: '40px', height: '40px' }} />
                    </ListItemIcon>
                    <ListItemText primary={`${item.name} - $${item.price}`} secondary={`Quantity: ${item.quantity}`} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            <Divider />
            <Box sx={{ padding: '10px' }}>
              <strong>Total: ${total}</strong>
              <button onClick={() => console.log('Proceed to checkout')}>Checkout</button>
            </Box>
          </Box>
        </Drawer>

        </Box>
      </Drawer>
    </nav>
  );
};

export default Navbar;
