import React, { useState, useEffect, useRef } from "react";
import Copyright from "../Footer/Copyright";
import { AiOutlineHome } from "react-icons/ai";
import Logo from "../../assets/logo5.png";
import { useNavigate } from "react-router-dom";
import { Toast, Toaster, toast } from "react-hot-toast";

function ActivateAccount() {
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];

  const [code, setCode] = useState(["", "", "", ""]);
  const [isCodeFilled, setIsCodeFilled] = useState(false);

  const handleInputChange = (e, index) => {
    const { value } = e.target;
    let newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value.length === 1 && index < inputRefs.length - 1) {
      inputRefs[index + 1].current.focus();
    }

    // Vérifier si tous les champs sont remplis
    if (newCode.every((val) => val.length === 1)) {
      setIsCodeFilled(true);
    } else {
      setIsCodeFilled(false);
    }
  };

  const sendCode = async () => {
    try {
      setIsLoaded(true);

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/auth/activateAccountWeb`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            activationCode: code.join(''), // Joindre tous les éléments du tableau pour former le code complet
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
          navigate("/login");
        }, 2000);
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

  useEffect(() => {
    if (isCodeFilled) {
      sendCode();
    }
  }, [isCodeFilled]);
  return (
    <div className="paper">
      <Toaster />
      <div
        className="wrapper justifyc-content-center align-items-center mt-5"
        style={{ width: 300 }}
      >
        <div className="d-flex justify-content-start align-items-start">
          <a
            title="Revenir en accueil"
            style={{ color: "#FA8072", fontSize: 24 }}
            href="/"
          >
            <AiOutlineHome />
          </a>
        </div>
        <div className="title-text">
          <div className="title login">
            <img
              src={Logo}
              width={150}
              height={150}
              alt=""
              style={{ borderRadius: 100 }}
            />
          </div>
        </div>
        <div className="form-container mt-5">
          <div className="form-inner">
            <form className="login">
              <div className="row">
                <div className="col-12">
                  <center>
                    <h1 className="fw-bolder" style={{ fontSize: "25px" }}>
                      Code de validation
                    </h1>
                  </center>
                  <div className="code-container">
                    {code.map((value, index) => (
                      <input
                        key={index}
                        className="code"
                        placeholder="0"
                        type="text"
                        pattern="^[0-9]$"
                        maxLength="1"
                        required
                        value={value}
                        ref={inputRefs[index]}
                        onChange={(e) => handleInputChange(e, index)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Copyright />
    </div>
  );
}

export default ActivateAccount;
