// Assurez-vous que clientSecret est défini correctement où vous utilisez CheckoutFormWrapper
import React, { useEffect, useState } from "react";
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

function CheckoutForm({ clientSecret }) { // Utilisez clientSecret comme prop ici
  const stripe = useStripe();
  const elements = useElements();

  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(PaymentElement);

    try {
      // Confirmation du paiement avec Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        }
      });

      if (error) {
        setErrorMessage(error.message);
        toast.error(error.message);
      } else if (paymentIntent.status === 'succeeded') {
        toast.success('Paiement réussi!');
        navigate("/menu");
      }
    } catch (error) {
      console.error("Erreur lors de la confirmation du paiement:", error);
      setErrorMessage("Une erreur s'est produite lors du paiement.");
      toast.error("Une erreur s'est produite lors du paiement.");
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
          disabled={!stripe}
        >
          Payer
        </button>
        {errorMessage && <div>{errorMessage}</div>}
      </form>
    </>
  );
}

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PROVIDER_KEY);

const CheckoutFormWrapper = ({ clientSecret }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true); // Note: Vous devez implémenter la logique de récupération de clientSecret ici si ce n'est pas déjà fait
  }, []);

  return (
    <>
      {!isLoaded && <div>Chargement...</div>}
      {isLoaded && (
        <Elements stripe={stripePromise}>
          <CheckoutForm clientSecret={clientSecret} />
        </Elements>
      )}
    </>
  );
};

export default CheckoutFormWrapper;
