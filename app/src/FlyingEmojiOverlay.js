import React, { useState, useEffect } from 'react';
import { FaHandPaper, FaQuestionCircle, FaLightbulb } from 'react-icons/fa';
import './FlyingEmojiOverlay.css';

const FlyingEmojiOverlay = ({ emojiQueue, setEmojiQueue }) => {
  const [displayedEmojis, setDisplayedEmojis] = useState([]);

  const dequeueEmoji = () => {
    if (emojiQueue.length > 0) {
      // Dequeue the first emoji from the queue
      const [emoji, ...rest] = emojiQueue;
      setEmojiQueue(rest);
      return emoji;
    }
    return null;
  };

  useEffect(() => {
    const dequeueInterval = setInterval(() => {
      const emoji = dequeueEmoji();
      if (emoji) {
        // Generate a random horizontal position
        const leftPosition = `${Math.random() * 90}%`;

        // Add the dequeued emoji with the horizontal position to the displayedEmojis array
        setDisplayedEmojis((prevEmojis) => [
          ...prevEmojis,
          { emoji, leftPosition },
        ]);
      }
    }, 100); // Dequeue an emoji every 100 milliseconds

    return () => {
      clearInterval(dequeueInterval);
    };
  }, [emojiQueue, setEmojiQueue]);

  // Check if emojiQueue is empty and clear displayedEmojis after 3 seconds
  useEffect(() => {
    if (emojiQueue.length === 0) {
      const clearEmojisTimeout = setTimeout(() => {
        setDisplayedEmojis([]);
      }, 3000); // Clear displayedEmojis 3 seconds after queue is empty
      return () => {
        clearTimeout(clearEmojisTimeout);
      };
    }
  }, [emojiQueue]);

  return (
    <div className="emoji-overlay">
      {displayedEmojis.map((emojiObj, index) => (
        <div
          key={index}
          className={`emoji fly-up`}
          style={{
            left: emojiObj.leftPosition, // Use the stored horizontal position
            transform: `rotate(${Math.random() * 360}deg)`, // Random rotation
          }}
        >
          {emojiObj.emoji}
        </div>
      ))}
    </div>
  );
};

export default FlyingEmojiOverlay;
