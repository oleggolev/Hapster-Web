import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import './Header.css';

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #333;
  color: white;
  padding: 20px 30px;
`;

const Title = styled.div`
  font-size: 24px;
  font-weight: bold;
`;

const LeaveSessionButton = styled(Link)`
  text-decoration: none;
  color: white;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const Header = ({ session_id }) => {
  return (
    <HeaderWrapper>
      {/* Conditionally apply a class for phones and iPads */}
      <div className="header-title">
        <Title>Haptic-Xcel</Title>
      </div>
      Session ID: {session_id}{' '}
      <div>
        <LeaveSessionButton to="/">Leave Session</LeaveSessionButton>
      </div>
    </HeaderWrapper>
  );
};

export default Header;
