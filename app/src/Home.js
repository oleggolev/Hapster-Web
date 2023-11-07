import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './Header';
import Button from './Button';
import { useParams, useNavigate } from 'react-router-dom';
import FlyingEmojiOverlay from './FlyingEmojiOverlay';
import { css } from '@emotion/react';
import { RingLoader } from 'react-spinners'; // Import the spinning circle component

const generateUserId = () => {
  let userId = localStorage.getItem('userId');
  if (!userId) {
    userId = Math.random().toString(36).substring(2, 15);
    localStorage.setItem('userId', userId);
  }
  return userId;
};

const iconMapping = {
  1: '✋',
  2: '😭',
  3: '😎',
};

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const Home = (props) => {
  const { session_id } = useParams();
  const [emojiQueue, setEmojiQueue] = useState([]);
  const userId = generateUserId();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const getSessionData = async () => {
    try {
      const response = await fetch(
        `${props.serverurl}/get-session-data/${session_id}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching session data:', error);
      return null;
    }
  };

  useEffect(() => {
    console.log('1');
    getSessionData().then((data) => {
      setTimeout(() => {
        if (!session_id || !data || data.status !== 'success') {
          console.log('2');
          navigate('/');
        } else {
          console.log('3');
          setIsLoading(false);
        }
      }, 1000); // Show loading indicator for 1 second
    });
  }, [session_id, navigate]);

  if (isLoading) {
    // Loading indicator style
    const loadingStyle = {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#333',
      color: 'white',
      flexDirection: 'column', // Center text vertically
    };

    return (
      <div style={loadingStyle}>
        <RingLoader
          css={override}
          color={'#3498db'}
          size={60}
          loading={isLoading}
        />
        <br></br>
        <p>Attempting to join session...</p>
      </div>
    );
  }

  const handleReactionClick = (reaction) => {
    const serverUrl = props.serverurl + '/add-reaction';

    const reactionData = {
      reaction: reaction,
      timeStamp: new Date().toISOString(),
      sessionId: session_id,
      userSessionId: userId,
    };

    fetch(serverUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reactionData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        console.log(reaction);
      })
      .catch((error) => {
        console.error('Error adding reaction:', error);
      });

    const emoji = iconMapping[reaction];
    const emojisToAdd = Array(20).fill(emoji);
    setEmojiQueue((prevQueue) => [...prevQueue, ...emojisToAdd]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header session_id={session_id} homepage={true} />
      <div className="button-container">
        <Button
          color="#3498db"
          icon="✋"
          label="Hand-raise"
          onClick={() => handleReactionClick(1)}
        />
        <Button
          color="#e74c3c"
          icon="😭"
          label="Confused"
          onClick={() => handleReactionClick(2)}
        />
        <Button
          color="#f1c40f"
          icon="😎"
          label="Confident"
          onClick={() => handleReactionClick(3)}
        />
      </div>
      <FlyingEmojiOverlay
        emojiQueue={emojiQueue}
        setEmojiQueue={setEmojiQueue}
      />
    </div>
  );
};

export default Home;
