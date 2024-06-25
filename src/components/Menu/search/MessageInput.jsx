// src/components/MessageInput.js

import React, { useState } from 'react';
import axios from 'axios';
import './MessageInput.module.css';

const MessageInput = ({ conversationId }) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = async () => {
    if (!message.trim()) return; // Eviter l'envoi de messages vides
    const userId = localStorage.getItem('userId');
    try {
      await axios.post(`http://localhost:5555/message/messages`, {
        conversationId,
        sender: userId,
        text: message,
      });
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="message-input d-flex align-items-center p-3 border-top">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className="form-control form-control-lg"
        onKeyPress={handleKeyPress}
      />
      <button onClick={handleSendMessage} className="btn btn-primary ms-3">Send</button>
    </div>
  );
};

export default MessageInput;
