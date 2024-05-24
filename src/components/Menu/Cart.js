  import styles from "./Cart.module.css";
  import { useDispatch, useSelector } from "react-redux";
  import { cartActions } from "../../store/cartSlice";
  import { toast } from "react-hot-toast";
  import { useEffect, useState, useRef } from "react";
  import close from "../../assets/xmark-solid.svg";
  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
  import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons"; // Solid heart for favorited
  import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons"; // Regular heart for not favorited
  import {
    faCartShopping,
    faSquarePlus,
    faSquareMinus,
    faTrashCan,
  } from "@fortawesome/free-solid-svg-icons";
  import Allergy from "./Allergy";
  import { Row, Col, ListGroup, Image, Button, Card, Form ,Container} from 'react-bootstrap';
  import { Link } from "react-router-dom";
  import Message from './Message';
  import Navbar from "./search/Navbar";
  import Footer from "../../components/Footer/Footer";

  const Cart = (props) => {
    const dispatch = useDispatch();
    const cartData = useSelector((state) => state.cart.cartData);
    const total = useSelector((state) => state.cart.total);
    const tps = useSelector((state) => state.cart.tps);
    const tvq = useSelector((state) => state.cart.tvq);
    const [paymentMethod, setPaymentMethod] = useState('credit');
    const [cartTrash, setCartTrash] = useState(null);
    const [allergyModal, setAllergyModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));  // Stores today's date by default or the date items were added to cart
const [taxeTPS, setTaxeTPS] = useState('');
  const [taxeTVQ, setTaxeTVQ] = useState('');
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

    const toggleFavorite = (id) => {
      // Dispatch action to toggle favorite
      console.log("Toggle favorite status for: ", id);
      // Add your dispatch call here to update state
    };
    const fetchCart = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/cart/get/cartTrashweb/by/user`,
          {
            credentials: "include",
          }
        );
        const responseData = await response.json();
        console.log(responseData);
        if (!response.ok) {
          throw new Error("cart doesn't exist");
        } else {
          dispatch(cartActions.setCart(responseData));
          setCartTrash(responseData?.cartData[0]?._id);
        }
      } catch (err) {
        toast.error(err.message, {
          style: {
            border: "1px solid #81007F",
            padding: "16px",
            color: "#81007F",
          },
          iconTheme: {
            primary: "#81007F",
            secondary: "#D6C7D4",
          },
        });
      }
    };
  

    const increasequantityProductInCartOrder = async (id) => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/cart/increase/quantity/Cartweb/Order/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(responseData.message || responseData.error);
        } else {
          toast.success(responseData.message, {
            style: {
              border: "1px solid #81007F",
              padding: "16px",
              color: "#81007F",
            },
            iconTheme: {
              primary: "#81007F",
              secondary: "#D6C7D4",
            },
          });
          fetchCart();
        }
      } catch (err) {
        toast.error(err.message, {
          style: {
            border: "1px solid #81007F",
            padding: "16px",
            color: "#81007F",
          },
          iconTheme: {
            primary: "#81007F",
            secondary: "#D6C7D4",
          },
        });
      }
    };

    const increasequantityProductInCartTrash = async (id) => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/cart/increase/quantity/Cartweb/Trash/${cartTrash}/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(responseData.message || responseData.error);
        } else {
          console.log(responseData.message);
        }
      } catch (err) {
        console.error(err.message);
      }
    };

    const decreasequantityProductInCartOrder = async (id) => {
      if (
        cartData[0]?.quantityProduct[
          cartData[0]?.productFK?.findIndex((e) => e._id == id)
        ] == 1
      ) {
        deleteProduct(id);
        console.log(
          cartData[0]?.quantityProduct[
            cartData[0]?.productFK?.findIndex((e) => e._id == id)
          ]
        );
      } else {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/cart/decrease/quantity/Cartweb/Order/${id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
            }
          );
          const responseData = await response.json();
          if (!response.ok) {
            throw new Error(responseData.message || responseData.error);
          } else {
            toast.success(responseData.message, {
              style: {
                border: "1px solid #81007F",
                padding: "16px",
                color: "#81007F",
              },
              iconTheme: {
                primary: "#81007F",
                secondary: "#D6C7D4",
              },
            });
            fetchCart();
          }
        } catch (err) {
          toast.error(err.message, {
            style: {
              border: "1px solid #81007F",
              padding: "16px",
              color: "#81007F",
            },
            iconTheme: {
              primary: "#81007F",
              secondary: "#D6C7D4",
            },
          });
        }
      }
    };

    const decreasequantityProductInCartTrash = async (id) => {
      if (
        cartData[0]?.quantityProduct[
          cartData[0]?.productFK?.findIndex((e) => e._id == id)
        ] == 1
      ) {
        deleteProduct(id);
      } else {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/cart/decrease/quantity/Cartweb/Trash/${cartTrash}/${id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
            }
          );
          const responseData = await response.json();
          if (!response.ok) {
            throw new Error(responseData.message || responseData.error);
          } else {
            console.log(responseData.message);
          }
        } catch (err) {
          console.error(err.message);
        }
      }
    };

    const clearCart = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/cart/clear`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(responseData.message || responseData.error);
        } else {
          toast.success(responseData.message, {
            style: {
              border: "1px solid #81007F",
              padding: "16px",
              color: "#81007F",
            },
            iconTheme: {
              primary: "#81007F",
              secondary: "#D6C7D4",
            },
          });
          fetchCart();
        }
      } catch (err) {
        toast.error(err.message, {
          style: {
            border: "1px solid #81007F",
            padding: "16px",
            color: "#81007F",
          },
          iconTheme: {
            primary: "#81007F",
            secondary: "#D6C7D4",
          },
        });
      }
    };

    const deleteProduct = async (productId) => {
      console.log("Attempting to delete product with ID:", productId); // Debugging output
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/cart/delete/productweb/${productId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(responseData.message || 'Failed to delete product');
        }
        toast.success('Product deleted successfully');
        fetchCart(); // Re-fetch cart to update UI
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error(error.message || 'Error deleting product');
      }
    };
    
    useEffect(() => {
      fetchCart();
    }, []);
    useEffect(() => {
      
    }, [cartData,total]);


    
    const cartRef = useRef(null);

    const handlePaymentChange = (method) => {
      setPaymentMethod(method);
    };
    const [showAllergyModal, setShowAllergyModal] = useState(false);

    // Open Allergy Modal
    const handleCheckout = () => {
      
      setShowAllergyModal(true);
    };

    // Close Allergy Modal
    const closeAllergyModal = () => {
      setShowAllergyModal(false);
    };


    return (
      <>
      <Navbar />
        <Container className="my-5">
          <Row>
            <Col md={8}>
              <ListGroup>
              
            {cartData[0]?.productFK?.map((item, index) => (
                <ListGroup.Item key={item.id}>
                  <Row className="align-items-center">
                    <Col md={3}>
                    <FontAwesomeIcon
                      icon={item.isFavorited ? solidHeart : regularHeart}
                      onClick={() => toggleFavorite(item.id)}
                      style={{ color: 'red', cursor: 'pointer',marginTop:"-150px" }}
                    />
                      <Image img src={item.photo} className="img-fluid rounded-3"   style={{ width: '60px', height: '60px',marginBottom:"30px",marginTop:"50px" }}/>
                    
                    </Col>
                    <Col md={3}>
                
                <div className="d-flex align-items-center justify-content-between">
                <Col md={3}>
                  <div className="d-flex align-items-center">
                    
                    <span style={{ whiteSpace: 'nowrap' ,marginLeft:"-30px" }}>{item.name}</span>
                  </div>
                </Col>     
                </div>
              
              </Col>
                    <Col md={2}>
                    <td>

                            <FontAwesomeIcon
                          icon={faSquareMinus}
                          style={{ color: 'salmon',width: '20px', height: '20px'  }}
                          className={styles.quantityIcon}
                          onClick={() => {
                            decreasequantityProductInCartOrder(item._id);
                            decreasequantityProductInCartTrash(item._id);
                          }}
                        />


                          {
                            cartData[0]?.quantityProduct[
                              cartData[0]?.productFK?.findIndex(
                                (e) => e._id == item._id
                              )
                            ]
                          }

                        <FontAwesomeIcon
                          icon={faSquarePlus}
                          style={{ color: 'salmon' ,width: '20px', height: '20px'  }}
                          className={styles.quantityIcon}
                          onClick={() => {
                            increasequantityProductInCartOrder(item._id);
                            increasequantityProductInCartTrash(item._id);
                          }}
                        />
                                </td>
                                {/* <td>${(item.price * item.quantity).toFixed(2)}</td>
                                <td>
                                <FontAwesomeIcon
                                  icon={faTrashCan}
                                  style={{ color: "#4B0082", marginLeft: '10px' }}
                                  onClick={() => deleteProduct(item.id)}
                                />
                                </td> */}
                    </Col>
                    <Col md={2}>${(item.price * cartData[0].quantityProduct[index])}</Col>
                    {/* <Col md={2}>
                      <Button type="button" variant="light"  onClick={() => deleteProduct(item.id)}>
                        Remove
                      </Button>
                    </Col> */}
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col >
          
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
                        <Col>${total }</Col>
                      </Row>
                    </ListGroup.Item>
                  </ListGroup>
                  <Button style={{color:'white',background:'salmon',border:"white "}} block onClick={handleCheckout}>
                    Go to Checkout
                  </Button> 
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
        {showAllergyModal && <Allergy closeModal={closeAllergyModal} />}
        <Footer />
      </>
    );
  };

  export default Cart;