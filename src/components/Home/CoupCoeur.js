import React from 'react';
import Logo1 from "../../images/google_play.png";
import Logo2 from "../../images/app_store.png";
import Loge3 from "../../images/mobile.png";
import style from './Best.module.css';
import backgroundImage from '../../assets/body-bg.jpg';                                     
import { useState } from 'react';
function CoupCoeur() {
    const [fontColor, setFontColor] = useState('#000000'); // Par défaut, la couleur du texte est noire

    const handleClick = () => {
      setFontColor('#ffffff'); // Lors du clic, la couleur du texte devient blanche
    };
  return (
    <React.Fragment>
      <section
      className="pride"
      style={{ backgroundColor: "#f88f8f", marginTop: 0 }}
    >
        <div className="container">
          <div className="row">
            <div className="col-md-9 mx-auto">
              <div className="row">
                <div className="col-md-7 col-lg-8">
                  <div className="detail-box">
                    <h2>
                      <span style={{marginTop:"30px",marginBottom:"30px",color:'white'}}> Get the</span> <br />
                      Menu.com App
                    </h2>
                    <p style={{marginTop:"30px"}}>
                      long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The poin
                    </p>
                    <div className="app_btn_box" style={{marginTop:"30px"}}>
                      <a href="#" className="mr-1">
                      <img src={Logo1}  className="box-img" alt=""  style={{marginBottom:"50px" ,height:"50px"}}/>
                      </a>
                      <a href="#">
                        <img src={Logo2} className="box-img" alt="" style={{marginBottom:"50px",height:"50px"}} />
                      </a>
                    </div>
                    <a href="#" className={style.downloadbtn} style={{ color: fontColor }} onClick={handleClick}>
                    Download Now
                    </a>
                    </div>
                </div>
                <div className="col-md-5 col-lg-4">
                  <div className="img-box">
                    <img src={Loge3} className="box-img" alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}

export default CoupCoeur;
