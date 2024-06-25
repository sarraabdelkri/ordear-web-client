// src/components/MessagesList.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MessagesList.module.css';

const MessagesList = ({ conversationId }) => {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:5555/message/messages/${conversationId}`);
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [conversationId]);

  return (
    <div className="messages-list">
      <h2>Messages</h2>
      <ul>
        {messages.map(message => (
          <li key={message._id} className={message.sender === localStorage.getItem('userId') ? 'message-sender' : 'message-receiver'}>
            <strong>{message.sender}</strong>: {message.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MessagesList;