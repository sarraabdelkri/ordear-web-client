import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import styles from './ReclamationForm.module.css';
import SubHeading from "../../Menu/SubHeading";

const ReclamationForm = () => {
  const { restaurantId: paramRestaurantId } = useParams();
  const [userId, setUserId] = useState('');
  const [restaurantId, setRestaurantId] = useState(paramRestaurantId || '');
  const [type, setType] = useState('');
  const [tableNb, setTableNb] = useState('');
  const [orderNb, setOrderNb] = useState('');
  const [message, setMessage] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [cameraOpen, setCameraOpen] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const userIdFromStorage = localStorage.getItem('userId');
    const restaurantIdFromStorage = localStorage.getItem('restaurantId');

    if (userIdFromStorage) {
      setUserId(userIdFromStorage);
    }
    if (restaurantIdFromStorage && !paramRestaurantId) {
      setRestaurantId(restaurantIdFromStorage);
    }
  }, [paramRestaurantId]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCameraOpen = () => {
    setCameraOpen(true);
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          setTimeout(handleCapture, 1000); // Automatically capture after 1 second
        };
      })
      .catch(err => {
        console.error('Error accessing the camera:', err);
      });
  };

  const handleCapture = () => {
    const context = canvasRef.current.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    canvasRef.current.toBlob(blob => {
      setImage(blob);
      setImagePreview(URL.createObjectURL(blob));
      setCameraOpen(false);
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop()); // Stop the camera stream
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('message', message);
    formData.append('type', type);
    formData.append('tableNb', tableNb);
    formData.append('orderNb', orderNb);
    formData.append('restaurantFK', restaurantId);

    if (image) {
      formData.append('image', image);
    }

    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/reclamation/reclamation/add/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Reclamation submitted successfully');
    } catch (error) {
      console.error('Error submitting reclamation:', error);
      setError('Failed to submit reclamation');
    }
  };

  return (
    <div className={styles.container}>
      <div className="app__specialMenu-title" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginTop: "20px" }}>
        <SubHeading title="Claims" />
        <h1 className="headtext__cormorant"></h1>
      </div>
      <h1 className="headtext__cormorant">Share your complaint</h1>
      <p>Our goal is to provide excellent service. If you have any complaints, please share them with us, and we will take action.</p>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.row}>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
            className={styles.inputField}
          >
            <option value="" disabled>Select Type</option>
            <option value="lateDelivery">Late Delivery</option>
            <option value="productDamaged">Damaged Product</option>
            <option value="missingItem">Missing Item</option>
            <option value="other">Other</option>
          </select>
          <input
            type="number"
            value={tableNb}
            onChange={(e) => setTableNb(e.target.value)}
            placeholder="Table Number"
            required
            className={styles.inputField}
          />
          <input
            type="number"
            value={orderNb}
            onChange={(e) => setOrderNb(e.target.value)}
            placeholder="Order Number"
            required
            className={styles.inputField}
          />
        </div>
        <div className={styles.formGroup}>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message"
            required
            className={styles.textarea}
          />
        </div>
        <div className={styles.buttonRow}>
          <label className={styles.customFileUpload}>
            <input
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
            <span>Upload Image</span>
          </label>
          <button type="button" onClick={handleCameraOpen} className={styles.cameraButton}>Open Camera</button>
        </div>
        {imagePreview && <img src={imagePreview} alt="Image Preview" className={styles.imagePreview} />}
        {cameraOpen && (
          <div className={styles.cameraContainer}>
            <div className={styles.cameraModal}>
              <video ref={videoRef} width="300" height="200" autoPlay></video>
              <button onClick={handleCapture} className={styles.captureButton}>Capture</button>
            </div>
          </div>
        )}
        <canvas ref={canvasRef} style={{ display: 'none' }} width="300" height="200"></canvas>
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className={styles.submitButton}>
          Send Message
        </button>
      </form>
    </div>
  );
};

export default ReclamationForm;
