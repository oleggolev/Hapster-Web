import React, { useState } from 'react';
import styled from 'styled-components';
import Color from 'color';

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  background-color: ${(props) =>
    props.isPressed ? darkenColor(props.color) : props.color};
  color: white;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s ease;
`;

const ButtonIcon = styled.div`
  font-size: 24px;
  margin-right: 10px;
`;

// Define the darkenColor function outside of the Button component
const darkenColor = (color) => {
  const colorObject = Color(color);
  return colorObject.darken(0.2).string(); // Adjust the 0.2 value to control darkness
};

const Button = ({ color, icon, label, onClick }) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleButtonPress = () => {
    setIsPressed(true);
  };

  const handleButtonRelease = () => {
    setIsPressed(false);
  };

  return (
    <ButtonWrapper
      color={color}
      isPressed={isPressed}
      onMouseDown={handleButtonPress}
      onMouseUp={handleButtonRelease}
      onMouseLeave={handleButtonRelease}
      onClick={onClick}
    >
      <ButtonIcon>{icon}</ButtonIcon>
      {label}
    </ButtonWrapper>
  );
};

export default Button;
