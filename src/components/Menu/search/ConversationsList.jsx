// src/components/ConversationsList.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ConversationsList.module.css';

const ConversationsList = ({ onSelectConversation }) => {
  const [conversations, setConversations] = useState([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await axios.get(`http://localhost:5555/message/conversations/${userId}`);
        setConversations(response.data);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    };

    fetchConversations();
  }, [userId]);

  return (
    <div className="conversations-list">
      <h2>Conversations</h2>
      <ul>
        {conversations.map(conversation => (
          <li key={conversation._id} onClick={() => onSelectConversation(conversation)}>
            {conversation.participants.map(p => p.name).join(', ')}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConversationsList;