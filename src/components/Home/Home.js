import Header from "./Header";
import styles from "./Home.module.css";
import { useReducer, useEffect ,useState } from "react";
import Saveurs from "./Saveurs";
import BestOfBest from "./BestOfBest";
import CoupCoeur from "./CoupCoeur";
import AboutUs from "./AboutUs";
import Review from "./Review";
import Footer from "../Footer/Footer";
import WhyChooseUs from "./whychooseUs";
import Navs from "../Navs/Navs";
import { QRCode } from 'react-qr-code';
import { FaCamera } from 'react-icons/fa';
import { FaRegMessage } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import Orders from "./orders";
import Toast from "./Toast";
import { useSelector } from "react-redux";
import Mapevent from "./Map/mapevent";


const initialState = {
  number1: { start: 1, target: 500 },
  number2: { start: 1, target: 250 },
  number3: { start: 1, target: 30 },
  number4: { start: 1, target: 300 },
};

function reducer(state, action) {
  switch (action.type) {
    case "INCREMENT":
      return {
        ...state,
        [action.payload]: {
          ...state[action.payload],
          start: state[action.payload].start + 1,
        },
      };
    default:
      return state;
  }
}

const Home = () => {
  const isAuth = useSelector((state) => state.auth.isAuthenticated);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [showIcon, setShowIcon] = useState(false);
 
  const [toastMessage, setToastMessage] = useState('');

  const incrementDuration = 2000; // 2000 milliseconds (2 seconds)
  useEffect(() => {
    const incrementInterval1 = setInterval(() => {
      if (state.number1.start < state.number1.target) {
        dispatch({ type: "INCREMENT", payload: "number1" });
      }
    }, incrementDuration / (state.number1.target - 1));

    const incrementInterval2 = setInterval(() => {
      if (state.number2.start < state.number2.target) {
        dispatch({ type: "INCREMENT", payload: "number2" });
      }
    }, incrementDuration / (state.number2.target - 1));

    const incrementInterval3 = setInterval(() => {
      if (state.number3.start < state.number3.target) {
        dispatch({ type: "INCREMENT", payload: "number3" });
      }
    }, incrementDuration / (state.number3.target - 1));

    const incrementInterval4 = setInterval(() => {
      if (state.number4.start < state.number4.target) {
        dispatch({ type: "INCREMENT", payload: "number4" });
      }
    }, incrementDuration / (state.number4.target - 1));

    return () => {
      clearInterval(incrementInterval1);
      clearInterval(incrementInterval2);
      clearInterval(incrementInterval3);
      clearInterval(incrementInterval4);
    };
    
  }, [state]);
  useEffect(() => {
    const handleScroll = () => {
    
      if (window.scrollY > -1500 ) {
        setShowIcon(true);
      } else {
        setShowIcon(false);
      }
    };
    window.addEventListener('scroll', handleScroll);

  
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const socket = new WebSocket('ws://your-backend-url.com/ws/orders');

    socket.onmessage = function(event) {
      const data = JSON.parse(event.data);
      if (data.status === 'ready') {
        setShowToast(true);  // Show toast notification when order is ready
      }
    };

    return () => socket.close();  // Clean up the socket when the component unmounts
  }, []);
  return (
    <>
      <section className={styles.firstPage}>
        <Navs/>
        <div className={styles.codeIcon}>
            {showIcon && (
              <div className={styles.centerContent}>
                
                <div className="qrCodeContainer">
                <QRCode
                  value="Votre texte à encoder en QR code ici"
                  size={80}
                 
                />
                </div>
                <br/>
                <div className={styles.scanButton}>
                    <FaRegMessage className={styles.cameraIcon} />
                   <Link to="/menu" className={styles.link}>Scan Me</Link>
                  </div> 
              </div>
            )}
          </div>
         
            
        <Header />
        {isAuth && <Orders />}
        {showToast && <Toast message="Your order is ready! Please pick it up." onClose={() => setShowToast(false)} />}
       
          {!isAuth && <AboutUs/>}
          <BestOfBest/>
            {/* {!isAuth && <CoupCoeur/>} */}
            {!isAuth && <WhyChooseUs/>}
            <Mapevent/>
            <Footer/>
      </section>

    </>
  );
};

export default Home;
