import React from 'react';
import R1 from '../../assets/food.jpg'
import R2 from '../../assets/cocktail.jpg'
import R3 from '../../assets/Coffee.jpg'
import R4 from '../../assets/foodd.jpg'
import backgroundImage from '../../assets/body-bg.jpg';
import styles from './Saveurs.module.css';
import { AiOutlineArrowRight } from 'react-icons/ai';

function Saveurs() {
    return (
      <React.Fragment>
         <section className='pride' style={{ backgroundImage: `url(${backgroundImage})`, marginTop:0}}>
         <div className='container'>
         <div className='mt-4 text-center'>
                    <h1 className='mb-0' style={{ color: '#120B3B' }}>
                    New Flavors to Discover
                    </h1>
                </div>

            <div className='d-flex justify-content-center align-items-center text-center'>
                <div className='row'>
                    <div className='col-12 text-center mt-3' style={{ border:'1px solid #120B3B', width:160}}></div>
                </div>
            </div>

            <div className='row mt-5'>
                <div className='col-lg-3 col-md-6 col-sm-12'>
                    <div className='card' style={{ borderRadius:15, border:'1px solid #f88f8f', backgroundColor:"#f88f8f", marginBottom: '15px'}}>
                        <img src={R1} alt="" className="responsive-image" />
                    </div>
                </div>
                <div className='col-lg-3 col-md-6 col-sm-12'>
                    <div className='card' style={{ borderRadius:15, border:'1px solid #f88f8f', backgroundColor:"#f88f8f", marginBottom: '15px'}}>
                        <img src={R2} alt="" className="responsive-image" />
                    </div>
                </div>
                <div className='col-lg-3 col-md-6 col-sm-12'>
                    <div className='card' style={{ borderRadius:15, border:'1px solid #f88f8f', backgroundColor:"#f88f8f", marginBottom: '15px'}}>
                        <img src={R3} alt="" className="responsive-image" />
                    </div>
                </div>
                <div className='col-lg-3 col-md-6 col-sm-12'>
                    <div className='card' style={{ borderRadius:15, border:'1px solid #f88f8f', backgroundColor:"#f88f8f", marginBottom: '15px'}}>
                        <img src={R4} alt="" className="responsive-image" />
                    </div>
                </div>
            </div>
            <div className='mt-5'></div>
            <div className='d-flex justify-content-center align-items-center'>
                <button className={styles['button-30']}>Voir plus &nbsp; &nbsp;<AiOutlineArrowRight/> </button>
            </div>
            <div className='mt-3'></div>
        </div>
       
       </section>
      </React.Fragment>
    );
}

export default Saveurs;
