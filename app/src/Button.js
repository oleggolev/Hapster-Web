import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Color from 'color';
import Countdown from 'react-countdown'; // Import countdown component

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  background-color: ${(props) =>
    props.isPressed ? darkenColor(props.color) : props.color};
  color: white;
  font-size: 18px;
  cursor: ${(props) => (props.isPressed ? 'not-allowed' : 'pointer')};
  transition: background-color 0.3s ease;
  pointer-events: ${(props) => (props.cooldown ? 'none' : 'auto')};
`;

const ButtonIcon = styled.div`
  font-size: 24px;
  margin-right: 10px;
`;

// Define the darkenColor function outside of the Button component
const darkenColor = (color) => {
  const colorObject = Color(color);
  return colorObject.darken(0.3).hex(); // Use hex() to get the hex value
};

const Button = ({ color, icon, label, onClick }) => {
  const [isPressed, setIsPressed] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [originalColor, setOriginalColor] = useState(color);
  const [countdownStartTime, setCountdownStartTime] = useState(null);

  const handleButtonPress = () => {
    if (!cooldown) {
      setIsPressed(true);
      setCooldown(true);
      setCountdownStartTime(Date.now() + 20000); // Set the countdown start time

      // Set cooldown to false after 20 seconds
      setTimeout(() => {
        setCooldown(false);
        setIsPressed(false);
        setOriginalColor(color); // Reset the original color
      }, 20000);

      // Call the onClick function provided as a prop
      onClick();
    }
  };

  const handleButtonRelease = () => {
    if (!cooldown) {
      setIsPressed(false);
    }
  };

  return (
    <ButtonWrapper
      color={isPressed ? darkenColor(originalColor) : originalColor}
      isPressed={isPressed}
      cooldown={cooldown}
      onMouseDown={handleButtonPress}
      onMouseUp={handleButtonRelease}
      onMouseLeave={handleButtonRelease}
      onClick={onClick} // Pass the onClick prop here
    >
      <div className="buttoniconcol">
        <div className="buttoniconrow">
          <ButtonIcon>{icon}</ButtonIcon>
          {label}
        </div>
        <div></div>
        {cooldown && countdownStartTime && (
          <div className="buttoniconrow">
            <p>Cool-down:&nbsp;</p>
            <Countdown
              date={countdownStartTime}
              renderer={({ seconds }) => <span>{seconds}</span>}
            />
            <p>s</p>
          </div>
        )}
      </div>
    </ButtonWrapper>
  );
};

export default Button;
