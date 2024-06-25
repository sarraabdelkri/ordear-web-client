import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import ReactRecorder from './TimeRecorder'; // Ensure you have this component
import axios from 'axios';
import { toast } from 'react-toastify';

const socket = io('http://localhost:5566');

const Chat = ({ conversationId, onClose, restaurantName, restaurantId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const currentUserId = localStorage.getItem('userId');
  const [audioBlob, setAudioBlob] = useState(null);
  const [restaurantData, setRestaurantData] = useState(null);
  const [claimStep, setClaimStep] = useState(null);
  const [claimType, setClaimType] = useState('');
  const [claimMessage, setClaimMessage] = useState('');
  const [currentReclamationId, setCurrentReclamationId] = useState(localStorage.getItem('currentReclamationId'));
  const [imgFile, setImgFile] = useState(null);
  const [modalImage, setModalImage] = useState(null);
  useEffect(() => {
    if (conversationId) {
      socket.emit('joinConversation', conversationId);
      fetchMessages(conversationId);
    }

    socket.on('receiveMessage', (message) => {
      if (message.conversationId === conversationId) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [conversationId ]);

  const fetchMessages = async (conversationId) => {
    try {
      const response = await axios.get(`http://localhost:5555/messages/messages/${conversationId}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };


  const sendTextMessage = async (text, senderType) => {
    const message = {
      conversationId,
      senderId: currentUserId, // Ensure this is correct, you might need to adjust based on who is sending the message.
      text,
      senderType,
    };
  
    try {
      await axios.post('http://localhost:5566/send-message', message);
      // Do not add message here
      // socket.emit('sendMessage', response.data.data);
      // setNewMessage('');
      // setMessages((prevMessages) => [...prevMessages, response.data.data]);
    } catch (error) {
      console.error('Error sending text message:', error);
      toast.error('Error sending message');
    }
  };

  const handleSendMessage = async () => {
    if (claimStep) {
      handleClaimSteps(newMessage);
    
    } else if (newMessage.trim() !== '') {
      await sendTextMessage(newMessage, 'customer');
    }
  }
  const sendResponseMessage = async (text) => {
    const message = {
        conversationId,
        senderId: restaurantId,
        text,
        senderType: 'restaurant',
        type: 'response'
    };
    await axios.post('http://localhost:5566/send-message', message);
    socket.emit('sendMessage', message);
    setMessages((prevMessages) => [...prevMessages, message]);
};


  const sendAudioMessage = async (audioBlob) => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'audioMessage.wav');
    formData.append('conversationId', conversationId);
    formData.append('senderId', currentUserId);

    try {
      const response = await axios.post('http://localhost:5566/send-audio-message', formData);
      socket.emit('sendMessage', response.data.data);
      setMessages((prevMessages) => [...prevMessages, response.data.data]);
    } catch (error) {
      console.error('Error sending audio message:', error);
    }
  };

  const sendImageMessage = (imgFile) => {
    const formData = new FormData();
    formData.append('img', imgFile);
    formData.append('conversationId', conversationId);
    formData.append('senderId', currentUserId);

    fetch('http://localhost:5566/send-img-message', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        socket.emit('sendMessage', data.data);
      })
      .catch((error) => console.error('Error sending image message:', error));
  };

  const handleClaim = async () => {
    try {
        console.log('Creating a new reclamation...');
        const reclamationResponse = await axios.post(`http://localhost:5555/reclamation/reclamation/add/${currentUserId}`, {
            message: "I want to claim",
            restaurantFK: restaurantId,
        });

        const newReclamation = reclamationResponse.data.data;
        console.log('Reclamation response:', reclamationResponse.data);

        const reclamationId = newReclamation._id;
        if (reclamationId) {
            setCurrentReclamationId(reclamationId);
            localStorage.setItem('currentReclamationId', reclamationId);
            console.log("Reclamation ID:", reclamationId);

            const claimMessage = {
                conversationId,
                senderId: restaurantId,
                text: "I want to claim",
                createdAt: new Date().toISOString(),
                type: 'claim',
                senderType: 'customer',
                reclamationId: reclamationId
            };

            await sendTextMessage(claimMessage.text, 'customer'); // Send initial claim message
            setClaimStep('type'); // Move to next step
        } else {
            throw new Error('Reclamation ID is undefined');
        }
    } catch (error) {
        console.error('Claim not initiated:', error.message);
        toast.error('Claim not initiated');
    }
};

const handleClaimSteps = async (message) => {
    if (claimStep === 'type' && message.trim() !== '') {
        setClaimType(message);
        sendResponseMessage("Please describe your claim.");
        setClaimStep('describe'); // Ensure this step is not repeated
    } else if (claimStep === 'describe' && message.trim() !== '') {
        setClaimMessage(message);
        const claimData = {
            type: claimType,
            message: message,
            reclamationId: currentReclamationId
        };

        const response = await axios.put(`http://localhost:5555/reclamation/reclamation/update/${currentReclamationId}`, claimData);
        sendResponseMessage("Claim submitted successfully.");
      

        setClaimStep(null); // End the claim process
        localStorage.removeItem('currentReclamationId');
        setCurrentReclamationId(null);
    }
};



// const handleClaimSteps = async (message) => {
//     if (claimStep === 'type') {
//         setClaimType(message);
//         setClaimStep('message');
//         sendResponseMessage("Please describe your claim.");
//     } else if (claimStep === 'message') {
//         setClaimMessage(message);
//         setClaimStep(null);

//         const claimData = {
//             type: claimType,
//             message: message,
//             reclamationId: currentReclamationId
//         };

//         try {
//             // Mettre à jour la réclamation dans la base de données des réclamations
//             await axios.put(`http://localhost:5555/reclamation/reclamation/update/${currentReclamationId}`, claimData);

//             // Confirmez la soumission de la réclamation à l'utilisateur
//             sendResponseMessage("Claim submitted successfully.");
//             toast.success("Claim added successfully");
//         } catch (error) {
//             console.error('Claim not added:', error);
//             sendResponseMessage("Claim not added.");
//             toast.error('Claim not added');
//         } finally {
//             localStorage.removeItem('currentReclamationId');
//             setCurrentReclamationId(null);
//         }
//     }
// };


  const handleHelpRequest = async () => {
    const note = "I need help.";
    const type = "general";

    try {
      const response = await axios.post(`http://localhost:5555/help/addhelpweb/${currentUserId}`, {
        note,
        type,
      });

      const helpMessage = {
        conversationId,
        senderId: currentUserId,
        text: note,
        createdAt: new Date().toISOString(),
        type: 'help',
        senderType: 'customer',
      };

      socket.emit('sendMessage', helpMessage);
      setMessages((prevMessages) => [...prevMessages, helpMessage]);

      toast.success("Help request sent successfully.");
    } catch (error) {
      console.error('Error sending help request:', error);
      toast.error('Error sending help request.');
    }
  };

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await axios.get(`http://localhost:5555/restaurant/retrieve/${restaurantId}`);
        setRestaurantData(response.data);
      } catch (error) {
        console.error('Error fetching restaurant details:', error);
        toast.error('Error fetching restaurant details.');
      }
    };
    fetchRestaurant();
  }, [restaurantId]);

  const handleRecordingComplete = (audioBlob) => {
    sendAudioMessage(audioBlob);
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    sendImageMessage(file);
  };
  const handleImageClick = (imgSrc) => {
    setModalImage(imgSrc);
  };
  
  const closeModal = () => {
    setModalImage(null);
  };

  const styles = {
    overlay: {
      position: 'fixed',
      top: 60,
      bottom: 0,
      left: -30,
      width: '100%',
      height: '100%',
      background: 'transparent',
      display: 'flex',
      justifyContent: 'right',
      alignItems: 'center',
    },
    modal: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.😎',
      zIndex: 950,
    },
    modalImage: {
      maxWidth: '90%',
      maxHeight: '90%',
    },
    customFileUpload: {
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      color: 'white',
      fontSize: '16px',
      marginRight: '10px',
      marginLeft:"10px"
    },
    customFileUploadIcon: {
      marginRight: '5px',
      fontSize: '24px',
    },

    chatBox: {
      display: 'flex',
      flexDirection: 'column',
      width: '30%',
      height: '80%',
      maxHeight: '600px',
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      borderRadius: '15px',
      overflow: 'hidden',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    },
    chatHeader: {
      padding: '10px',
      background: 'linear-gradient(to right, #FA8072, rgba(250, 128, 114, 0.7))',
      color: 'white',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
      animation: 'gradientBackground 3s infinite alternate',
      transition: 'background 0.5s ease',
      textAlign: 'center',
    },
    restaurantName: {
      flex: '1',
      textAlign: 'center',
      fontSize: '24px',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      margin: '0',
      fontFamily: 'Playfair Display, serif',
    },
    restaurantNameContainer: {
      padding: '3px 8px',
      background: 'transparent',
      color: 'black',
      borderRadius: '15px',
      marginBottom: '5px',
      maxWidth: 'fit-content',
      textAlign: 'center',
      fontSize: '12px',
      fontWeight: 'bold',
      textTransform: 'uppercase',
    },
    chatBody: {
      flex: 1,
      padding: '10px',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'white',
    },
    messageContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      marginBottom: '10px',
      position: 'relative',
    },
    message: {
      padding: '10px',
      borderRadius: '10px',
      backgroundColor: '#ca9c9c',
      position: 'relative',
      maxWidth: '70%',
      display: 'inline-flex',
      alignItems: 'center',
    },
    received: {
      alignSelf: 'flex-end',
      backgroundColor: '#82ccdd',
    },
    messageText: {
      marginLeft: '10px',
      color: 'black',
      wordWrap: 'break-word',
      whiteSpace: 'pre-wrap',
      maxWidth: '100%',
      color: 'black',
    },
    optionButtons: {
      display: 'flex',
      justifyContent: 'space-around',
      marginBottom: '-5px',
      backgroundColor: 'white',
    },
    optionButton: {
      backgroundColor: '#FA8072',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '20px',
      cursor: 'pointer',
    },
    messageTime: {
      marginTop: '5px',
      fontSize: '10px',
      color: 'black',
      textAlign: 'right',
    },
    chatFooter: {
      padding: '10px',
      background: 'linear-gradient(to right, #FA8072, rgba(250, 128, 114, 0.7))',
      display: 'flex',
      alignItems: 'center',
      borderTop: '1px solid rgba(255, 255, 255, 0.2)',
      animation: 'gradientBackground 3s infinite alternate',
      transition: 'background 0.5s ease',
    },
    input: {
      flex: 1,
      border: 'none',
      padding: '10px',
      borderRadius: '15px',
      marginRight: '20px',
      marginLeft: '20px',
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      color: 'white',
    },
    button: {
      backgroundColor: '#25D366',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '15px',
      color: 'white',
      cursor: 'pointer',
    },
    closeButton: {
      background: 'none',
      border: 'none',
      color: 'white',
      fontSize: '16px',
      cursor: 'pointer',
    },
    actionButtons: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '10px',
    },
    actionButton: {
      backgroundColor: '#FA8072',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '15px',
      cursor: 'pointer',
      marginRight: '10px',
    },
    avatar: {
      width: '30px',
      height: '30px',
      borderRadius: '50%',
      marginRight: '10px',
    },
    iconsend: {
      backgroundColor: 'transparent',
      border: 'none',
      fontSize: '1rem',
      color: 'white',
      cursor: 'pointer',
    },
    iconimage: {
      backgroundColor: 'transparent',
      border: 'none',
      fontSize: '1rem',
      color: 'white',
      cursor: 'pointer',
      marginRight: '10px',
    },
    '@keyframes gradientBackground': {
      '0%': {
        background: 'linear-gradient(to right, #FA8072, rgba(250, 128, 114, 0.7))',
      },
      '100%': {
        background: 'linear-gradient(to right, #FA8072, rgba(250, 128, 114, 0.3))',
      },
    },
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.chatBox}>
        <div style={styles.chatHeader}>
          <div style={styles.restaurantName}>{restaurantName}</div>
          <button onClick={onClose} style={styles.closeButton}>X</button>
        </div>
        <div style={styles.chatBody}>
          {messages.map((message, index) => {
            const isSender = message.senderId === currentUserId;
            const isRestaurant = message.senderType === 'restaurant';

            return (
              <React.Fragment key={index}>
                {index === 0 || messages[index - 1].senderId !== message.senderId ? (
                  <div
                    style={{
                      ...styles.messageContainer,
                      alignItems: isSender ? 'flex-start' : 'flex-end',
                    }}
                  >
                    <div
                      style={{
                        ...styles.restaurantNameContainer,
                        ...(isSender ? {} : styles.restaurantNameContainer),
                      }}
                    >
                      <div style={styles.restaurantNameContainer}>
                        {isSender ? 'You' : restaurantName}
                      </div>
                    </div>
                  </div>
                ) : null}

                <div
                  style={{
                    ...styles.messageContainer,
                    alignItems: isSender ? 'flex-start' : 'flex-end',
                  }}
                >
                  <div
                    style={{
                      ...styles.message,
                      ...(isSender ? {} : styles.received),
                      ...(isRestaurant ? { backgroundColor: '#FFD700' } : {}),
                    }}
                  >
                    <div style={styles.messageText}>
                      {message.text ||
                        (message.audioUrl && (
                          <audio controls src={message.audioUrl}  />

                        ))}

                    </div>
                    { (message.img && (
                      <img
                        src={`${message.img}`}
                        width="200"
                        height="200"
                        onClick={() => handleImageClick(message.img)}
                      />
                    ))}
                  </div>
                  <span style={styles.messageTime}>
                    {new Date(message.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              </React.Fragment>
            );
          })}
          <div style={styles.optionButtons}>
            <button style={styles.optionButton} onClick={handleHelpRequest}>I want help</button>
            <button style={styles.optionButton} onClick={handleClaim}>I want to claim</button>
          </div>
        </div>

        <div style={styles.chatFooter}>
          <ReactRecorder
            audioBlobCallback={(blob) => setAudioBlob(blob)}
            onRecordingComplete={handleRecordingComplete}
          />
          <input
            type="file"
            accept="image/*"
            id="image-upload"  
            onChange={handleFileChange}
            style={{ display: 'none' }} 
          />
          <label htmlFor="image-upload" style={styles.customFileUpload}>
            
            <FontAwesomeIcon icon={faImage} />
          </label>
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            style={styles.input}
          />
          <button onClick={() => handleSendMessage()} style={styles.iconsend}>
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </div>
      </div>
          {modalImage && (
      <div style={styles.modal} onClick={closeModal}>
        <img src={modalImage} alt="Zoomed" style={styles.modalImage} />
      </div>
    )}
    </div>
  );
};

export default Chat;
