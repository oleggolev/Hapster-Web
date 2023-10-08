import React, { useState } from 'react';
import { FaStopCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const InputPage = (props) => {
  const navigate = useNavigate();
  const [sessionId, setSessionId] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  // New function to fetch session data
  const getSessionData = async () => {
    try {
      const response = await fetch(
        `${props.serverurl}/get-session-data/${sessionId}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching session data:', error);
      return null;
    }
  };

  // Frontend code
  const handleEnterClick = async () => {
    const sessionData = await getSessionData();

    if (sessionData && sessionData.status === 'success') {
      // Redirect to the entered session ID if it exists
      navigate(`/${sessionId}`);
    } else {
      // Set session ID to non-existent and show red border
      setShowPopup(true);
      setSessionId('');
      setTimeout(() => {
        setShowPopup(false);
      }, 2000);
    }
  };

  const gradientBackground = {
    // Style for the gradient background
    background: 'linear-gradient(to bottom, #3498db, #e74c3c, #f1c40f)', // Define your gradient colors here
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        ...gradientBackground, // Apply the gradient background
      }}
    >
      <div
        style={{
          fontSize: '50px', // Increase font size
          fontWeight: 'bold', // Make it bold
          color: 'white',
          marginBottom: '40px',
        }}
      >
        Haptic-Xcel
      </div>
      <input
        type="text"
        placeholder="Session ID"
        value={sessionId}
        onChange={(e) => {
          setSessionId(e.target.value);
        }}
        style={{
          fontWeight: 'bold',
          marginBottom: '20px',
          padding: '5px',
          width: '300px', // Adjust width to make it the same size as the button
          height: '50px', // Adjust height to make it the same size as the button
          border: 'transparent', // Red border if session ID doesn't exist
          outline: 'none', // Remove the outline when focused
          textAlign: 'center', // Center-align the placeholder text
          borderRadius: '5px',
          fontSize: '20px', // Increase font size
        }}
      />
      <button onClick={handleEnterClick} className="enter">
        <strong>Enter</strong>
      </button>
      <div className={`popup ${showPopup ? 'show' : ''}`}>
        <FaStopCircle style={{ marginRight: '10px' }} /> Session ID doesn't
        exist
      </div>
    </div>
  );
};

export default InputPage;
