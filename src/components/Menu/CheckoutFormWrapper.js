import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  PaymentElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import styles from "./Checkout.module.css";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState(null);

  // /send/invoice/credit/card/pay

  const sendInvoice = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/order/send/invoice/credit/card/pay`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error("bill didn't get sent");
      } else {
        console.log("bill was sent");
      }
    } catch (err) {
      console.log(err);
    }
  };
  const confirmPayment = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/order/update/status/pay/by/user`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.error || responseData.message);
      } else {
        console.log("order confirmed");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (elements == null) {
      return;
    }

    // Trigger form validation and wallet collection
    const { error: submitError } = await elements.submit();

    if (submitError) {
      // Show error to your customer
      setErrorMessage(submitError.message);
      toast.error(errorMessage, {
        style: {
          border: "1px solid #FA8072",
          padding: "16px",
          color: "#FA8072",
        },
        iconTheme: {
          primary: "#FA8072",
          secondary: "#f88f8f",
        },
      });
      return;
    }

    // Create the PaymentIntent and obtain clientSecret from your server endpoint

    const { error } = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        return_url: `${process.env.REACT_APP_FRONT_URL}/menu`,
      },
      redirect: "if_required",
    });

    if (error) {
      // This point will only be reached if there is an immediate error when
      // confirming the payment. Show error to your customer (for example, payment
      // details incomplete)
      setErrorMessage(error.message);
      toast.error(errorMessage, {
        style: {
          border: "1px solid #FA8072",
          padding: "16px",
          color: "#FA8072",
        },
        iconTheme: {
          primary: "#FA8072",
          secondary: "#f88f8f",
        },
      });
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
      await sendInvoice();
      await confirmPayment();
      await toast.success("payment succesful", {
        style: {
          border: "1px solid #FA8072",
          padding: "16px",
          color: "#FA8072",
        },
        iconTheme: {
          primary: "#FA8072",
          secondary: "#f88f8f",
        },
      });
      navigate("/menu");
    }
  };

  return (
    <>
      <div>
        <Toaster />
      </div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <PaymentElement />
        <button
          className={styles.btn}
          type="submit"
          disabled={!stripe || !elements}
        >
          Pay
        </button>
        {/* Show error message to your customers */}
        {errorMessage && <div>{errorMessage}</div>}
      </form>
    </>
  );
}

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PROVIDER_KEY);

const CheckoutFormWrapper = () => {
  const [clientSecret, setClientSecret] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {}, []);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/stripe/create`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(async (response) => {
      const {
        paymentIntent: clientSecret,
        ephemeralKey,
        customer,
        setupIntent,
      } = await response.json();
      setClientSecret(clientSecret);
      setIsLoaded(true);
    });
  }, []);
  return (
    <>
      {!stripePromise && <div>no promise</div>}
      {!isLoaded && <div>Loading...</div>}
      {stripePromise && isLoaded && clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm />
        </Elements>
      )}
    </>
  );
};

export default CheckoutFormWrapper;
