import styles from "./AddReviewOrClaimModal.module.css";
import close from "../../assets/xmark-solid.svg";
import review from "../../assets/review.png";
import claim from "../../assets/claim.png";
import { useState, useRef } from "react";
import { Rating } from "react-simple-star-rating";
import { toast } from "react-hot-toast";
import { useEffect, useCallback } from "react";
import Webcam from "react-webcam";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const videoConstraints = {
  facingMode: "environment",
};

const AddReviewOrClaimModal = (props) => {
  //review states
  const [reviewSection, setReviewSection] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  //claim states
  const [claimImgSrc, setClaimImgSrc] = useState(null);
  const [claimSection, setClaimSection] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [message, setMessage] = useState("");

  const reviewRef = useRef();
  const claimRef = useRef();

  const handleRating = (rate) => {
    setRating(rate);
  };

  const handleTextArea = (e) => {
    setComment(e.target.value);
  };

  const handleMessage = (e) => {
    setMessage(e.target.value);
  };

  const submitReview = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/avis/add/avis`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            comment: comment,
            restaurantFK: props.restaurantId,
            orderFK: props.orderId,
            note: rating,
          }),
        }
      );
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || responseData.error);
      } else {
        toast.success(responseData.message, {
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
        setTimeout(() => {
          props.closeModal();
        }, 1000);
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
          secondary: "#f88f8f",
        },
      });
      console.error(err.message[0], err.message[1]);
    }
  };

  const webcamRef = useRef(null);
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setClaimImgSrc(imageSrc);
    console.log(imageSrc, "length : ", imageSrc.length);
  }, [webcamRef]);
  const retake = () => {
    setClaimImgSrc(null);
  };

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
  };

  const submitClaim = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/reclamation/add/reclamation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            message: message,
            restaurantFK: props.restaurantId,
            orderFK: props.orderId,
            tableNb: props.tableNb,
            type: selectedType,
            image: claimImgSrc || "",
          }),
        }
      );
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || responseData.error);
      } else {
        toast.success(responseData.message, {
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
        setTimeout(() => {
          props.closeModal();
        }, 1000);
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
          secondary: "#f88f8f",
        },
      });
      console.error(err.message);
    }
  };

  useEffect(() => {
    console.log(props.restaurantId);
  }, []);

  return (
    <div className={styles.reviewBackdrop} onClick={props.closeModal}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.top}>
          <h3 className={styles.p}>your opinion is important</h3>
          <img src={close} alt="close" onClick={props.closeModal} />
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
            }}
          >
            <img src={claim} alt="claim" />
            <p className={styles.p}>claim</p>
          </div>
        </div>
        {reviewSection && (
          <section className={styles.reviewSection}>
            <h4 className={styles.p}>Review</h4>
            <Rating onClick={handleRating} showTooltip transition={true} />
            <p className={styles.p}>comment</p>
            <textarea
              className={`form-control ${styles.textarea}`}
              rows="3"
              value={comment}
              onChange={handleTextArea}
            ></textarea>
            <button
              className={styles["button-3"]}
              onClick={() => submitReview()}
            >
              Submit
            </button>
          </section>
        )}

        {claimSection && (
          <section className={styles.claimSection}>
            <h4 className={styles.p}>Claim</h4>
            <p className={styles.p}>Type : </p>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">type</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                placeholder="type"
                label="type"
                onChange={handleTypeChange}
                defaultValue=""
              >
                <MenuItem value="lateDelivery">late delivery</MenuItem>
                <MenuItem value="productDamaged">damaged product</MenuItem>
                <MenuItem value="missingItem">missing item</MenuItem>
                <MenuItem value="Other">other</MenuItem>
              </Select>
            </FormControl>

            <p className={styles.p}>leave a picture</p>
            {claimImgSrc ? (
              <img src={claimImgSrc} alt="claim" className={styles.capture} />
            ) : (
              <Webcam
                height={300}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={340}
                videoConstraints={videoConstraints}
              />
            )}
            {claimImgSrc ? (
              <button className={styles.button} onClick={retake}>
                retake
              </button>
            ) : (
              <button className={styles.button} onClick={capture}>
                Capture photo
              </button>
            )}
            <p className={styles.p}>leave a message</p>
            <textarea
              className={`form-control ${styles.textarea}`}
              rows="3"
              value={message}
              onChange={handleMessage}
            ></textarea>
            <button
              className={styles["button-3"]}
              onClick={() => submitClaim()}
            >
              Submit
            </button>
          </section>
        )}
      </div>
    </div>
  );
};

export default AddReviewOrClaimModal;
