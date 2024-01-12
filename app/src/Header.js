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
  margin-right: 10px;
  margin-left: 10px;

  &:hover {
    text-decoration: underline;
  }
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Header = ({ session_id, homepage }) => {
  return (
    <HeaderWrapper>
      <div className="header-title">
        <Title>Hapster</Title>
      </div>
      Session ID: {session_id}{' '}
      <Row>
        {homepage ? (
          <div>
            <LeaveSessionButton
              className="asdf"
              to={`/${session_id}/reactions`}
            >
              Session Analytics
            </LeaveSessionButton>
          </div>
        ) : (
          <div>
            <LeaveSessionButton to={`/${session_id}`}>
              Session Reactions
            </LeaveSessionButton>
          </div>
        )}{' '}
        <div className="dividermenu"> | </div>
        <LeaveSessionButton to={`https://forms.gle/DnYAq58uvFDi3BNS8`}>
          Student Survey
        </LeaveSessionButton>
        <div className="dividermenu"> | </div>
        <div>
          <LeaveSessionButton to="/">Leave Session</LeaveSessionButton>
        </div>
      </Row>
    </HeaderWrapper>
  );
};

export default Header;
