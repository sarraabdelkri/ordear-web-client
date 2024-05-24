import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "./SignUp.module.css";
import forget from "../../assets/brandComputer2.png";
import { Toast, Toaster, toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

const ActivateAccount = () => {
  const [code, setCode] = useState("");
  const navigate = useNavigate();
  const isAuth = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (code.length === 6) {
      sendCode();
    }
  }, [code]);

  const sendCode = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/auth/activateAccount`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            activationCode: code,
          }),
        }
      );
      console.log("code 0 ");
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
          navigate("/home");
        }, 1000);
      }
    } catch (err) {
      console.log(err);
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
    }
  };

  return (
    <>
      {isAuth ? (
        <center style={{ marginTop: "30px" }}>
          <h2>you're already logged in !</h2>
          <FontAwesomeIcon
            icon={faTriangleExclamation}
            style={{ color: "#ec27dc", width: "50px", height: "50px" }}
          />
        </center>
      ) : (
        <>
          <div>
            <Toaster />
          </div>

          <section className="forget mt-4">
            <div className="container shadow my-5">
              <div className="row">
                <div className="col-md-6 d-flex flex-column align-items-center text-white justify-content-center form">
                  <div className="background-image-container">
                    <div className="background-image-wrapper">
                      <img alt="" className={styles.image} src={forget} />
                    </div>
                  </div>
                </div>
                <div className="col-md-6 p-5">
                  <center>
                    <h1 className="display-6 fw-bolder mb-5 mt-5 ">
                      Activate account
                    </h1>
                    <h6> Please enter your code</h6>
                    <br />
                  </center>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      sendCode();
                    }}
                  >
                    <div className="mb-3">
                      <center>
                        <label
                          htmlFor="exampleInputEmail1"
                          className="form-label"
                        >
                          {" "}
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="exampleInputEmail1"
                          placeholder="code"
                          name="code"
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                        />
                      </center>
                      <br />

                      <center className={styles.buttonsA}>
                        <NavLink to="/signup" className={() => styles.goback}>
                          Go back
                        </NavLink>
                      </center>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
};
export default ActivateAccount;
