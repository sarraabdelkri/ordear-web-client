import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart, faHeart as regularHeart } from "@fortawesome/free-solid-svg-icons";
import { faSquarePlus, faSquareMinus } from "@fortawesome/free-solid-svg-icons";
import { cartActions } from "../../store/cartSlice";
import { Row, Col, ListGroup, Image, Button, Card, Container } from 'react-bootstrap';
import Navbar from "../Navs/Navs";
import Footer from "../../components/Footer/Footer";
import Allergy from "./Allergy"; // Make sure the path to Allergy component is correct
import styles from "./Cart.module.css";

const Cart = () => {
  const dispatch = useDispatch();
  const cartData = useSelector((state) => state.cart.cartData);
  const total = useSelector((state) => state.cart.total);
  const tps = useSelector((state) => state.cart.tps);
  const tvq = useSelector((state) => state.cart.tvq);
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [cartTrash, setCartTrash] = useState(null);
  const [allergyModal, setAllergyModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const userId = localStorage.getItem('userId');

  const toggleFavorite = (id) => {
    console.log("Toggle favorite status for: ", id);
  };
  const fetchCart = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/cart/get/cartTrashweb/by/user/${userId}`,
        { credentials: "include" }
      );
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error("Cart doesn't exist");
      } else {
        console.log('Response Data:', responseData); // Ajoutez cette ligne pour vérifier la réponse
        dispatch(cartActions.setCart(responseData));
        setCartTrash(responseData._id);
        localStorage.setItem("cartTrash", responseData._id); // Stocker l'ID du cartTrash dans le local storage
      }
    } catch (err) {
      toast.error(err.message, {
        style: { border: "1px solid #81007F", padding: "16px", color: "#81007F" },
        iconTheme: { primary: "#81007F", secondary: "#D6C7D4" },
      });
    }
  };
  
  
  

  const increasequantityProductInCartOrder = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5555/cart/increase/quantity/Cartweb/Order/${id}/${userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || responseData.error);
      } else {
        toast.success(responseData.message, {
          style: { border: "1px solid #81007F", padding: "16px", color: "#81007F" },
          iconTheme: { primary: "#81007F", secondary: "#D6C7D4" },
        });
        fetchCart();
      }
    } catch (err) {
      toast.error(err.message, {
        style: { border: "1px solid #81007F", padding: "16px", color: "#81007F" },
        iconTheme: { primary: "#81007F", secondary: "#D6C7D4" },
      });
    }
  };

  const increasequantityProductInCartTrash = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5555/cart/increase/quantity/Cartweb/Trash/${userId}/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || responseData.error);
      } else {
        console.log(responseData.message);
        fetchCart();
      }
    } catch (err) {
      console.error(err.message);
    }
  };
  
  const decreasequantityProductInCartTrash = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5555/cart/decrease/quantity/Cartweb/Trash/${userId}/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || responseData.error);
      } else {
        console.log(responseData.message);
        fetchCart();
      }
    } catch (err) {
      console.error(err.message);
    }
  };
  

  const decreasequantityProductInCartOrder = async (id) => {
    if (
      cartData[0]?.quantityProduct[
        cartData[0]?.productFK?.findIndex((e) => e._id === id)
      ] === 1
    ) {
      deleteProduct(id);
    } else {
      try {
        const response = await fetch(
          `http://localhost:5555/cart/decrease/quantity/Cartweb/Order/${id}/${userId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );
        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(responseData.message || responseData.error);
        } else {
          toast.success(responseData.message, {
            style: { border: "1px solid #81007F", padding: "16px", color: "#81007F" },
            iconTheme: { primary: "#81007F", secondary: "#D6C7D4" },
          });
          fetchCart();
        }
      } catch (err) {
        toast.error(err.message, {
          style: { border: "1px solid #81007F", padding: "16px", color: "#81007F" },
          iconTheme: { primary: "#81007F", secondary: "#D6C7D4" },
        });
      }
    }
  };

 

  const clearCart = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/cart/clear/${userId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || responseData.error);
      } else {
        toast.success(responseData.message, {
          style: { border: "1px solid #81007F", padding: "16px", color: "#81007F" },
          iconTheme: { primary: "#81007F", secondary: "#D6C7D4" },
        });
        fetchCart();
      }
    } catch (err) {
      toast.error(err.message, {
        style: { border: "1px solid #81007F", padding: "16px", color: "#81007F" },
        iconTheme: { primary: "#81007F", secondary: "#D6C7D4" },
      });
    }
  };


  const deleteProduct = async (productId) => {
    console.log("Attempting to delete product with ID:", productId);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/cart/delete/productweb/${productId}/${userId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to delete product');
      }
      toast.success('Product deleted successfully');
      fetchCart();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error(error.message || 'Error deleting product');
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

 
  return (
    <>
      <Navbar />
      <Container className="my-4"  >
        <Row style={{ marginTop: "150px" }}>
          <Col md={8} >
            <ListGroup>
              {cartData[0]?.productFK.map((item, index) => (
                <ListGroup.Item key={item._id}>
                  <Row className="align-items-center">
                    <Col md={3}>
                      <FontAwesomeIcon
                        icon={solidHeart}
                        onClick={() => toggleFavorite(item._id)}
                        style={{ color: 'red', cursor: 'pointer', marginTop: "-150px" }}
                      />
                      <Image src={item.photo} className="img-fluid rounded-3" style={{ width: '60px', height: '60px', marginBottom: "30px", marginTop: "50px" }} />
                    </Col>
                    <Col md={3}>
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                          <span style={{ whiteSpace: 'nowrap', marginLeft: "-30px" }}>{item.name}</span>
                        </div>
                      </div>
                    </Col>
                    <Col md={2}>
                      <FontAwesomeIcon
                        icon={faSquareMinus}
                        style={{ color: 'salmon', width: '20px', height: '20px' }}
                        className={styles.quantityIcon}
                        onClick={() => {
                          decreasequantityProductInCartOrder(item._id);
                          decreasequantityProductInCartTrash(item._id);
                        }}
                      />
                      {cartData[0]?.quantityProduct[
                        cartData[0]?.productFK?.findIndex(
                          (e) => e._id == item._id
                        )
                      ]}
                      <FontAwesomeIcon
                        icon={faSquarePlus}
                        style={{ color: 'salmon', width: '20px', height: '20px' }}
                        className={styles.quantityIcon}
                        onClick={() => {
                          increasequantityProductInCartOrder(item._id);
                          increasequantityProductInCartTrash(item._id);
                        }}
                      />
                    </Col>
                    <Col md={2}>${(item.price * cartData[0].quantityProduct[index]).toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Header>Summary</Card.Header>
              <Card.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>TPS:</Col>
                      <Col>${tps}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>TVQ:</Col>
                      <Col>${tvq}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Total:</Col>
                      <Col>${total}</Col>
                    </Row>
                  </ListGroup.Item>
                </ListGroup>
                <Button style={{ color: 'white', background: 'salmon', border: "white" }} block="true" onClick={() => setAllergyModal(true)}>
                  Go to Checkout
                </Button>
                <Button className="mt-3" style={{ color: 'white', background: 'salmon', border: "white", marginLeft: "30px" }} block="true" onClick={clearCart}>
                  Clear Cart
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      {allergyModal && <Allergy closeModal={() => setAllergyModal(false)} />}
      <Footer />
    </>
  );
};

export default Cart;
