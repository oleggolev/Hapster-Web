import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './Header';
import Button from './Button';
import { FaHandPaper, FaQuestionCircle, FaLightbulb } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import FlyingEmojiOverlay from './FlyingEmojiOverlay'; // Adjust the path accordingly

const generateUserId = () => {
  // Check if the user ID already exists in localStorage
  let userId = localStorage.getItem('userId');

  // If it doesn't exist, generate a new one and store it in localStorage
  if (!userId) {
    userId = Math.random().toString(36).substring(2, 15);
    localStorage.setItem('userId', userId);
  }

  return userId;
};

// Define the icon mapping
const iconMapping = {
  1: <FaHandPaper />,
  2: <FaQuestionCircle />,
  3: <FaLightbulb />,
  // Add more mappings as needed
};

const Home = (props) => {
  // Get the session ID from the URL
  const { session_id } = useParams();
  const [emojiQueue, setEmojiQueue] = useState([]);

  // Generate a unique user ID
  const userId = generateUserId();

  const handleReactionClick = (reaction) => {
    // Specify the correct URL of your server's add-reaction endpoint
    const serverUrl = props.serverurl + '/add-reaction'; // Update with your server URL

    // Create the reaction data object
    const reactionData = {
      reaction: reaction,
      timeStamp: new Date().toISOString(),
      sessionId: session_id, // Assuming you have session_id available
      userSessionId: userId, // Assuming you have userId available
    };

    // Perform a POST request to add the reaction
    fetch(serverUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reactionData),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response if needed
        console.log(data);
        console.log(reaction);
      })
      .catch((error) => {
        console.error('Error adding reaction:', error);
      });

    // Get the corresponding icon component from the mapping
    const emoji = iconMapping[reaction];
    // Pass the icon component to the overlay
    const emojisToAdd = Array(20).fill(emoji);
    setEmojiQueue((prevQueue) => [...prevQueue, ...emojisToAdd]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header session_id={session_id} />
      <div className="button-container">
        <Button
          color="#3498db"
          icon={<FaHandPaper />}
          label="Hand-raise"
          onClick={() => handleReactionClick(1)}
        />
        <Button
          color="#e74c3c"
          icon={<FaQuestionCircle />}
          label="Confused"
          onClick={() => handleReactionClick(2)}
        />
        <Button
          color="#f1c40f"
          icon={<FaLightbulb />}
          label="Interesting"
          onClick={() => handleReactionClick(3)}
        />
      </div>

      {/* Render the FlyingEmojiOverlay component */}
      <FlyingEmojiOverlay
        emojiQueue={emojiQueue}
        setEmojiQueue={setEmojiQueue}
      />
    </div>
  );
};

export default Home;
