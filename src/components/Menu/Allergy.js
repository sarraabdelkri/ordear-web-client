import React, { useState, useRef } from "react";
import styles from "./Cart.module.css";
import close from "../../assets/xmark-solid.svg";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useNavigate } from "react-router-dom";
import creditImage from "../../assets/credit-card.png";
import CashImage from "../../assets/money.png";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import ReactStars from "react-rating-stars-component";
const Allergy = (props) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const cartData = useSelector((state) => state.cart.cartData);

  const creditRef = useRef(null);
  const cashRef = useRef(null);

  const navigate = useNavigate();

  const allergies = ["No allergy", "Gluten allergy", "Dairy allergy", "Other"];

  const [selectedAllergy, setSelectedAllergy] = useState("No allergy");
  const [otherAllergy, setOtherAllergy] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [showPaymentPopup, setShowPaymentPopup] = useState(true);
  const [showRatingTipPopup, setShowRatingTipPopup] = useState(false); // Initially false
  const [orderId, setOrderId] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [tip, setTip] = useState('');
  const userId = localStorage.getItem("userId");
  let restaurantId = localStorage.getItem("restaurantId");

  const handleChange = (e) => {
    setSelectedAllergy(e.target.value);
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };
  const ratingChanged = (newRating) => {
    setRating(newRating);
  };
  const closeModal = () => {
    setShowPaymentPopup(false);
    setShowRatingTipPopup(false);
  };

  const handleSubmit = async () => {
    try {
      if (!isAuthenticated) {
        toast.error("You must be logged in to place an order.", {
          style: {
            border: "1px solid #FA8072",
            padding: "16px",
            color: "#FA8072",
          },
          iconTheme: {
            primary: "#FA8072",
            secondary: "#D6C7D4",
          },
        });
        navigate("/login");
        return;
      }

      if (!userId) {
        toast.error("User ID is not found. Please log in again.", {
          style: {
            border: "1px solid #FA8072",
            padding: "16px",
            color: "#FA8072",
          },
          iconTheme: {
            primary: "#FA8072",
            secondary: "#D6C7D4",
          },
        });
        navigate("/login");
        return;
      }

      if (!restaurantId && cartData.length > 0 && cartData[0].restaurantFK) {
        restaurantId = cartData[0].restaurantFK._id;
      }

      if (!restaurantId) {
        toast.error("Restaurant ID is not found. Please select a restaurant.", {
          style: {
            border: "1px solid #FA8072",
            padding: "16px",
            color: "#FA8072",
          },
          iconTheme: {
            primary: "#FA8072",
            secondary: "#D6C7D4",
          },
        });
        return;
      }

      if (paymentMethod === "") {
        toast.error("Pick a payment method", {
          style: {
            border: "1px solid #FA8072",
            padding: "16px",
            color: "#FA8072",
          },
          iconTheme: {
            primary: "#FA8072",
            secondary: "#D6C7D4",
          },
        });
        return;
      }

      if (!cartData || cartData.length === 0) {
        toast.error("Select a menu before submitting an order", {
          style: {
            border: "1px solid #FA8072",
            padding: "16px",
            color: "#FA8072",
          },
          iconTheme: {
            primary: "#FA8072",
            secondary: "#D6C7D4",
          },
        });
        return;
      }

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/order/addOrderweb/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            restaurantFK: restaurantId,
            tableNb: 5,
            allergy: selectedAllergy === "Other" ? otherAllergy : selectedAllergy,
            payMethod: paymentMethod,
          }),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || responseData.error);
      } else {
        if (paymentMethod === "Cash") {
          await cashPayment();
        } else if (paymentMethod === "Credit card") {
          const generatedOrderId = responseData.data._id; // Adjust to match your response structure
          localStorage.setItem("orderId", generatedOrderId); // Store the order ID in localStorage

          // Redirect to the payment page
          navigate("/payment");
          return; // Exit the function after redirection
        }

        setOrderId(responseData.data._id); // Store the order ID for feedback submission
        setShowPaymentPopup(false); // Close the payment popup
    setShowRatingTipPopup(true); 

        toast.success("Order added", {
          style: {
            border: "1px solid #FA8072",
            padding: "16px",
            color: "#FA8072",
          },
          iconTheme: {
            primary: "#FA8072",
            secondary: "#D6C7D4",
          },
        });
      }
    } catch (err) {
      toast.error(err.message, {
        style: {
          border: "1px solid #FA8072",
          padding: "16px",
          color: "#FA8072",
        },
        iconTheme: {
          primary: "#FA8072",
          secondary: "#D6C7D4",
        },
      });
    }
  };

  const cashPayment = async () => {
    try {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        throw new Error("User ID is not found. Please log in again.");
      }

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/order/cash/method/payment/${userId}`,
        {
          method: "PUT",
          credentials: "include",
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || responseData.error);
      } else {
        toast.success("Payment confirmed and email sent", {
          style: {
            border: "1px solid #FA8072",
            padding: "16px",
            color: "#FA8072",
          },
          iconTheme: {
            primary: "#FA8072",
            secondary: "#D6C7D4",
          },
        });

        setOrderId(localStorage.getItem("orderId")); // Ensure the order ID is set
        setShowRatingTipPopup(true); // Show the feedback popup
      }
    } catch (err) {
      toast.error(err.message, {
        style: {
          border: "1px solid #FA8072",
          padding: "16px",
          color: "#FA8072",
        },
        iconTheme: {
          primary: "#FA8072",
          secondary: "#D6C7D4",
        },
      });
    }
  };

  const handleTipChange = (event) => {
    setTip(event.target.value);
  };

  const handleFeedbackSubmit = async () => {
    try {
      console.log('Submitting feedback with the following data:');
      console.log('User ID:', userId);
      console.log('Restaurant ID:', restaurantId);
      console.log('Order ID:', orderId);
      console.log('Comment:', comment);
      console.log('Rating:', rating);
      console.log('Tip:', tip);

      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/avis/resturant/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          comment,
          note: rating,
          restaurantFK: restaurantId,
          orderFK: orderId,
        }),
      });

      const responseData = await response.json();
      console.log('Response data:', responseData);

      if (!response.ok) {
        throw new Error(responseData.message || responseData.error);
      }

      toast.success('Thanks for your feedback!', {
        style: {
          border: '1px solid #FA8072',
          padding: '16px',
          color: '#FA8072',
        },
        iconTheme: {
          primary: '#FA8072',
          secondary: '#D6C7D4',
        },
      });

      setShowRatingTipPopup(false); // Close the feedback popup after submission
      navigate('/'); 
    } catch (err) {
      console.error('Error submitting feedback:', err);
      toast.error(err.message, {
        style: {
          border: '1px solid #FA8072',
          padding: '16px',
          color: '#FA8072',
        },
        iconTheme: {
          primary: '#FA8072',
          secondary: '#D6C7D4',
        },
      });
    }
  };

  return (
    <div className={styles.backdrop} onClick={props.closeModal} style={props.style}>
      {showPaymentPopup && (
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <div className={styles.top}>
            <h4 className={styles.h1}>Do you have allergies?</h4>
            <img src={close} alt="Close" onClick={props.closeModal} />
          </div>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Allergy</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              placeholder="Allergy"
              label="Allergy"
              onChange={handleChange}
              defaultValue=""
            >
              {allergies.map((el) => (
                <MenuItem key={el} value={el}>
                  {el}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {selectedAllergy === "Other" && (
            <>
              <input
                type="text"
                className={styles.input}
                placeholder="Other"
                onChange={(e) => setOtherAllergy(e.target.value)}
              />
              <br></br>
            </>
          )}

          <div className={styles.paymentMethods}>
            <h4 className={styles.h1}>Payment method</h4>
            <div className={styles.oneMethod}>
              <div className={styles["checkbox-wrapper-19"]}>
                <input
                  type="checkbox"
                  id="credit"
                  ref={creditRef}
                  onClick={() => {
                    cashRef.current.checked = false;
                    handlePaymentMethodChange("Credit card");
                  }}
                />
                <label htmlFor="credit" className={styles["check-box"]}></label>
              </div>
              <img src={creditImage} alt="Credit card" />
              <p className={styles.p}>Credit card</p>
            </div>
            <div className={styles.oneMethod}>
              <div className={styles["checkbox-wrapper-19"]}>
                <input
                  type="checkbox"
                  id="cash"
                  ref={cashRef}
                  onClick={() => {
                    creditRef.current.checked = false;
                    handlePaymentMethodChange("Cash");
                  }}
                />
                <label htmlFor="cash" className={styles["check-box"]}></label>
              </div>
              <img src={CashImage} alt="Cash" />
              <p className={styles.p}>Cash</p>
            </div>
          </div>
          <div className={styles.confirmOrderBtnContainer}>
            <button className={styles["button-3"]} onClick={handleSubmit}>
              Confirm order
            </button>
          </div>
        </div>
      )}
     {showRatingTipPopup && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.top}>
              <h4>Rate your experience</h4>
              <img src={close} alt="Close" onClick={props.closeModal} />
            </div>
            <div className={styles.content}>
              <ReactStars
                count={5}
                onChange={ratingChanged}
                size={24}
                activeColor="#ffd700"
                value={rating}
                classNames={styles.reactStars}
              />
              <textarea
                placeholder="Leave a comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className={styles.textArea}
              />
              <h6>Leave a tip</h6>
              <div className={styles.tips}>
                {['5$', '10$', '15$'].map((amount) => (
                  <button
                    key={amount}
                    className={tip === amount ? styles.selectedTip : styles.tip}
                    onClick={() => setTip(amount)}
                  >
                    {amount}
                  </button>
                ))}
                <input
                  type="number"
                  placeholder="Other"
                  value={tip}
                  onChange={(e) => setTip(e.target.value)}
                  className={styles.tipInput}
                />
              </div>
            </div>
            <div className={styles.actions}>
              <button className={styles.cancelButton}>Cancel</button>
              <button onClick={handleFeedbackSubmit} className={styles.submitButton}>Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default Allergy;