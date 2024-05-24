import styles from "./Menu.module.css";
import close from "../../assets/xmark-solid.svg";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useEffect } from "react";

const CancelModal = (props) => {
  const [note, setNote] = useState("");

  const confirmCancel = async (id) => {
    if (props.payMethod == "Credit card") {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/order/confirmCancelOrder/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              noteCancelOrder: note,
            }),
            credentials: "include",
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
          props.closeModal();
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
        console.log(err.message);
      }
    } else if (props.payMethod == "Cash") {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/order/ConfirmCancelOrderCash/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              noteCancelOrder: note,
            }),
            credentials: "include",
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
          props.closeModal();
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
        console.log(err.message);
      }
    }
  };

  return (
    <div className={styles.cancelBackdrop} onClick={props.closeModal}>
      <div className={styles.cancelModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.top}>
          <h2>Why ?</h2>
          <img src={close} alt="close" onClick={props.closeModal} />
        </div>
        <input
          type="text"
          className={styles.input}
          placeholder="write us a note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <center>
          <button
            className={styles["button-70"]}
            onClick={() => confirmCancel(props.id)}
          >
            Confirm cancel
          </button>
        </center>
      </div>
    </div>
  );
};

export default CancelModal;
