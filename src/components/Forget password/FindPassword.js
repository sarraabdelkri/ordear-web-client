import React from "react";
import Copyright from "../Footer/Copyright";
import Logo from "../../assets/logo5.png";
import { AiOutlineHome } from "react-icons/ai";

function FindPassword() {
  return (
    <div className="paper">
      <div className="wrapper justifyc-content-center align-items-center">
        <div className="d-flex justify-content-start align-items-start">
          <a
            title="Revenir en accueil"
            style={{ color: "#f88f8f", fontSize: 24 }}
            href="/"
          >
            <AiOutlineHome />
          </a>
        </div>
        <div className="title-text">
          <div className="title login">
          <img
                src={Logo}
                width={100}
                height={100}
                alt=""
                style={{ borderRadius: '50%',   marginTop: "-18px"}}
              /> 
          </div>
        </div>
        <div className="form-container">
          <div className="form-inner">
            <form action="#" className="login">
              <div className="field">
                <input type="email" placeholder="Adresse Email" required />
              </div>

              <div style={{ borderRadius: 100 }} className="field btn">
                <button className="btn">Chercher votre compte</button>
              </div>
              <div className="pass-link mt-3">
                <a href="/login">
                  <small>Mot de passe souvenu ? Connectez-vous</small>
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Copyright />
    </div>
  );
}

export default FindPassword;
