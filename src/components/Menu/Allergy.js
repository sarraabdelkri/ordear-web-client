import styles from "./Cart.module.css";
import close from "../../assets/xmark-solid.svg";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import creditImage from "../../assets/credit-card.png";
import CashImage from "../../assets/money.png";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

const Allergy = (props) => {
  const restaurantData = useSelector((state) => state.restaurant);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const creditRef = useRef(null);
  const cashRef = useRef(null);

  const navigate = useNavigate();

  const allergies = ["No allergy", "Gluten allergy", "Dairy allergy", "Other"];

  const [selectedAllergy, setSelectedAllergy] = useState("No allergy");
  const [otherAllergy, setOtherAllergy] = useState("other");
  const [paymentMethod, setPaymentMethod] = useState("");

  const handleChange = (e) => {
    setSelectedAllergy(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      if (!isAuthenticated) {
        toast.error("You must be logged in to place an order.", {
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
        navigate("/login");
        return;
      }

      if (paymentMethod === "") {
        toast.error("Pick a payment method", {
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
        return;
      }
      if (!restaurantData.tableNb || !restaurantData.restaurantId) {
        throw new Error("Select a menu before submitting an order");
      }

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/order/add/order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            restaurantFK: restaurantData.restaurantId,
            tableNb: restaurantData.tableNb,
            allergy:
              selectedAllergy === "Other" ? otherAllergy : selectedAllergy,
            payMethod: paymentMethod,
          }),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || responseData.error);
      } else {
        toast.success("Order added", {
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
        props.closeModal();
        setTimeout(() => {
          navigate("/");
        }, 1000);
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

  const cashPayment = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/order/cash/method/payment`,
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

  return (
    <div
      className={styles.backdrop}
      onClick={props.closeModal}
      style={props.style}
    >
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
                  setPaymentMethod("Credit card");
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
                  setPaymentMethod("Cash");
                  cashPayment(); // Appel de la fonction cashPayment
                }}
              />
              <label htmlFor="cash" className={styles["check-box"]}></label>
            </div>
            <img src={CashImage} alt="Cash" />
            <p className={styles.p}>Cash</p>
          </div>
        </div>
        <div className={styles.confirmOrderBtnContainer}>
          <button
            className={styles["button-3"]}
            onClick={() => {
              handleSubmit();
            }}
          >
            Confirm order
          </button>
        </div>
      </div>
    </div>
  );
};

export default Allergy;
