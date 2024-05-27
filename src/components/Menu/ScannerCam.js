import React, { useState, useEffect } from 'react';
import QrScanner from 'react-qr-scanner';
import { FaBarcode } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { restaurantActions } from '../../store/restaurantSlice';

function ScannerWithCamera() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [hasCameraAccess, setHasCameraAccess] = useState(true);

  const handleScan = (data) => {
    if (data && data.text) {
      console.log("Scanned QR Data:", data.text);
      try {
        const scanResult = JSON.parse(data.text);
        console.log("Scanned Data:", scanResult);

        if (scanResult.restaurantId && scanResult.tableNb) {
          dispatch(restaurantActions.setRestaurantData({ restaurantId: scanResult.restaurantId, tableNb: scanResult.tableNb }));
          console.log(`Restaurant ID: ${scanResult.restaurantId}, Table ID: ${scanResult.tableNb}`);
          navigate(`/search/${scanResult.restaurantId}`);
        } else {
          console.error("Required information (restaurant ID or table ID) missing in the QR data.");
        }
      } catch (err) {
        console.error("Error parsing QR data:", err);
      }
    }
  };

  const handleError = (err) => {
    console.error("QR Scanner Error:", err);
    if (err.name === 'NotAllowedError' || err.name === 'NotFoundError') {
      setHasCameraAccess(false);
    }
  };

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(() => setHasCameraAccess(true))
      .catch(err => {
        console.error("Camera access error:", err);
        setHasCameraAccess(false);
      });
  }, []);

  return (
    <>
      <div className="scannerContainer">
        {hasCameraAccess ? (
          <div className="scannerStyle">
            <QrScanner
              delay={300}
              onError={handleError}
              onScan={handleScan}
              style={{ width: '80vw', maxWidth: '400px' }}
            />
          </div>
        ) : (
          <div className="errorMessage">
            <p>Camera access is required to scan QR codes. Please check your browser settings and allow camera access.</p>
          </div>
        )}
        <div className="scannerIcon">
          <FaBarcode />
        </div>
      </div>
    </>
  );
}

export default ScannerWithCamera;
