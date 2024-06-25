import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Chat from './Chat'; // Assurez-vous que le chemin est correct

const ChatButton = () => {
  const { restaurantId } = useParams();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [selectedRestaurantName, setSelectedRestaurantName] = useState('');

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  useEffect(() => {
    console.log("restaurantId:", restaurantId);
  }, [restaurantId]);

  const handleOpenChat = async () => {
    const currentUserId = localStorage.getItem('userId');
    try {
      // Fetch restaurant details to get the owner ID
      const restaurantResponse = await axios.get(`http://localhost:5555/restaurant/retrieve/${restaurantId}`);
      const restaurantData = restaurantResponse.data;
      const ownerId = restaurantData.owner;
  
      console.log("restId:", restaurantId);
      setSelectedRestaurantName(restaurantData.nameRes);
      console.log("restaurantResponse:", restaurantData);
  
      // Create a conversation with the current user and the restaurant owner
      const response = await axios.post('http://localhost:5555/messages/conversations', {
        participants: [currentUserId, ownerId],
      });
      setConversationId(response.data._id);
  
      setIsChatOpen(true);
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };
  

  return (
    <div>
      <button
        onClick={handleOpenChat}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: '#FA8072',
          border: 'none',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
        }}
      >
        📞
      </button>
      {isChatOpen && conversationId && (
        <div style={{
          position: 'fixed',
          bottom: '80px',
          right: '20px',
          zIndex: 1000,
        }}>
          <Chat
            conversationId={conversationId}
            onClose={handleCloseChat}
            restaurantName={selectedRestaurantName}
            restaurantId={restaurantId} // Passer restaurantId comme prop
          />
        </div>
      )}
    </div>
  );
};

export default ChatButton;
