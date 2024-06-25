// components/Toast.js
import React from 'react';
import './Toast.module.css';  // Ensure this CSS file has appropriate styles

const Toast = ({ message, onClose }) => {
  return (
    <div className="toast">
      {message}
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default Toast;
