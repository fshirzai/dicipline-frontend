import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import PublicNavbar from './PublicNavbar';
import PublicFooter from './PublicFooter';

const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-top: 70px;
  background: ${(props) => props.theme.background};
`;

const Content = styled.main`
  flex: 1;
`;

const PublicLayout = () => {
  return (
    <Wrapper>
      <PublicNavbar />
      <Content>
        <Outlet />
      </Content>
      <PublicFooter />
    </Wrapper>
  );
};

export default PublicLayout;