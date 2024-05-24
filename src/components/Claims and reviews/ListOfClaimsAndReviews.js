import { useEffect, useRef, useState } from "react";
import review from "../../assets/review.png";
import claim from "../../assets/claim.png";
import styles from "./ListOfClaimsAndReviews.module.css";
import { Toaster, toast } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileCircleExclamation } from "@fortawesome/free-solid-svg-icons";

const ListOfClaimsAndReviews = () => {
  const [claimSection, setClaimSection] = useState(false);
  const [reviewSection, setReviewSection] = useState(true);

  const [reviews, setReviews] = useState([]);
  const [claims, setClaims] = useState([]);

  const reviewRef = useRef();
  const claimRef = useRef();

  const fetchReviews = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/avis/getByUser`,
        {
          method: "GET",
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
        console.log(responseData?.message);
        setReviews(responseData);
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
          secondary: "#f88f8f   ",
        },
      });
    }
  };

  const fetchClaims = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/reclamation/getListByUser`,
        {
          method: "GET",
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
        console.log(responseData?.message);
        setClaims(responseData);
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
          secondary: "#f88f8f   ",
        },
      });
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className={styles.mainSection}>
      <div>
        <Toaster />
      </div>
      <div className={styles.options}>
        <div
          className={styles.imgContainer}
          ref={reviewRef}
          onClick={() => {
            setReviewSection(true);
            setClaimSection(false);
            reviewRef.current.style.backgroundColor = "bisque";
            claimRef.current.style.backgroundColor = "white";
            fetchReviews();
          }}
        >
          <img src={review} alt="review" />
          <p className={styles.p}>Review</p>
        </div>
        <div
          className={styles.imgContainer}
          ref={claimRef}
          onClick={() => {
            setClaimSection(true);
            setReviewSection(false);
            reviewRef.current.style.backgroundColor = "white";
            claimRef.current.style.backgroundColor = "bisque";
            fetchClaims();
          }}
        >
          <img src={claim} alt="claim" />
          <p className={styles.p}>claim</p>
        </div>
      </div>
      {reviewSection && (
        <section className={styles.singleSection}>
          {reviews.length === 0 ? (
            <h4 className={styles.p}>No reviews</h4>
          ) : (
            <div>
              {reviews.map((el, index) => (
                <div className={styles.single} key={index}>
                  <div className={styles.upper}>
                    <h4 className={styles.p}>Review n°{index}</h4>
                    <FontAwesomeIcon
                      icon={faFileCircleExclamation}
                      style={{ color: "#e854db" }}
                    />
                  </div>
                  <p className={styles.pColor}>Content : {el.comment}</p>
                  <p className={styles.pColor}>response : {el.response}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {claimSection && (
        <section className={styles.singleSection}>
          {claims.length === 0 ? (
            <h4 className={styles.p}>No claims</h4>
          ) : (
            <div>
              {claims.map((el, index) => (
                <div className={styles.single} key={index}>
                  <div className={styles.upper}>
                    <h4 className={styles.p}>Claim n°{index}</h4>
                    <FontAwesomeIcon
                      icon={faFileCircleExclamation}
                      style={{ color: "#e854db" }}
                    />
                  </div>

                  <p className={styles.pColor}>Content : {el.message}</p>
                  <p className={styles.pColor}>response : {el.response}</p>
                  <img
                    src={el.image}
                    alt="claimImage"
                    className={styles.claimImage}
                  />
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default ListOfClaimsAndReviews;
