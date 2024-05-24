import React from 'react';
import QrScanner from 'react-qr-scanner';
import { FaBarcode } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { restaurantActions } from '../../store/restaurantSlice';

function ScannerWithCamera() {
  const navigate = useNavigate();
  const dispatch = useDispatch();  // Add this line to get access to the dispatch function

  const handleScan = (data) => {
    if (data && data.text) {
      console.log("Scanned QR Data:", data.text); // Log raw QR data for debugging
      try {
        const scanResult = JSON.parse(data.text);  // Parse the JSON string from QR data
        console.log("Scanned Data:", scanResult); // Log the parsed data

        // Check for restaurantId and tableNb in the QR data
        if (scanResult.restaurantId && scanResult.tableNb) {
          dispatch(restaurantActions.setRestaurantData({ restaurantId: scanResult.restaurantId, tableNb: scanResult.tableNb }));
          console.log(`Restaurant ID: ${scanResult.restaurantId}, Table ID: ${scanResult.tableNb}`); // Log both IDs
          navigate(`/search/${scanResult.restaurantId}`);  // Navigate using the restaurantId
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
  };
  return (
    <>
      <div className="scannerContainer">
        <div className="scannerStyle">
          <QrScanner
            delay={300}
            onError={handleError}
            onScan={handleScan}
            style={{ width: '80vw', maxWidth: '400px' }}
          />
        </div>
        <div className="scannerIcon">
          <FaBarcode />
        </div>
      </div>
    </>
  );
}

export default ScannerWithCamera;
