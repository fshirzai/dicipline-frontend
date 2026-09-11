import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FiMenu, FiX, FiBook } from 'react-icons/fi';
import ThemeToggle from '../common/ThemeToggle';

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: ${(props) => props.theme.navbarBg};
  border-bottom: 1px solid ${(props) => props.theme.border};
  padding: 0 24px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

const Logo = styled(Link)`
  font-size: 1.4rem;
  font-weight: 800;
  color: ${(props) => props.theme.primary};
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 10px;
  letter-spacing: -0.5px;

  .logo-icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: linear-gradient(
      135deg,
      ${(props) => props.theme.primary},
      ${(props) => props.theme.secondary || props.theme.primaryDark}
    );
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.1rem;
    box-shadow: 0 4px 12px ${(props) => props.theme.primary}44;
  }

  span {
    color: ${(props) => props.theme.navbarText};
  }

  @media (max-width: 400px) {
    span {
      display: none;
    }
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 900px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: ${(props) => props.theme.navbarText};
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background: ${(props) => props.theme.primary};
    color: white;
  }

  &.active {
    background: ${(props) => props.theme.primary}22;
    color: ${(props) => props.theme.primary};
    font-weight: 600;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const LoginButton = styled(Link)`
  padding: 9px 20px;
  background: ${(props) => props.theme.primary};
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s;

  &:hover {
    background: ${(props) => props.theme.primaryDark};
    transform: translateY(-2px);
    box-shadow: 0 8px 16px ${(props) => props.theme.primary}44;
  }

  @media (max-width: 500px) {
    display: none;
  }
`;

const MobileMenuButton = styled.button`
  background: transparent;
  border: none;
  color: ${(props) => props.theme.navbarText};
  font-size: 1.5rem;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  display: none;
  align-items: center;
  transition: all 0.2s;

  &:hover {
    background: ${(props) => props.theme.surface2};
  }

  @media (max-width: 900px) {
    display: flex;
  }
`;

const MobileMenu = styled.div`
  position: fixed;
  top: 70px;
  right: 0;
  width: 260px;
  max-width: 85vw;
  background: ${(props) => props.theme.navbarBg};
  border-left: 1px solid ${(props) => props.theme.border};
  border-bottom: 1px solid ${(props) => props.theme.border};
  z-index: 999;
  display: flex;
  flex-direction: column;
  padding: 12px 0;
  transform: translateX(${(props) => (props.$show ? '0' : '100%')});
  transition: transform 0.3s ease;
  box-shadow: ${(props) =>
    props.$show ? '-10px 10px 30px rgba(0,0,0,0.15)' : 'none'};

  @media (min-width: 901px) {
    display: none;
  }
`;

const MobileNavLink = styled(Link)`
  color: ${(props) => props.theme.navbarText};
  text-decoration: none;
  padding: 14px 22px;
  font-size: 0.95rem;
  transition: all 0.2s;
  border-left: 3px solid transparent;
  font-weight: 500;

  &:hover {
    background: ${(props) => props.theme.surface2};
  }

  &.active {
    background: ${(props) => props.theme.primary}22;
    border-left-color: ${(props) => props.theme.primary};
    color: ${(props) => props.theme.primary};
    font-weight: 600;
  }
`;

const MobileLoginLink = styled(Link)`
  margin: 10px 16px;
  padding: 12px;
  background: ${(props) => props.theme.primary};
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  text-align: center;
  transition: all 0.2s;

  &:hover {
    background: ${(props) => props.theme.primaryDark};
  }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  top: 70px;
  background: rgba(0, 0, 0, 0.4);
  z-index: 998;
  opacity: ${(props) => (props.$show ? 1 : 0)};
  visibility: ${(props) => (props.$show ? 'visible' : 'hidden')};
  transition: all 0.3s;
`;

const PublicNavbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const links = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <Nav>
        <Logo to="/">
          <div className="logo-icon">
           <img src="/favicon.svg" alt="" />
          </div>
          <span>Discipline</span>
        </Logo>

        <NavLinks>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={location.pathname === link.to ? 'active' : ''}
            >
              {link.label}
            </NavLink>
          ))}
        </NavLinks>

        <RightSection>
          <ThemeToggle />
          <LoginButton to="/login">Sign In</LoginButton>
          <MobileMenuButton
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <FiX /> : <FiMenu />}
          </MobileMenuButton>
        </RightSection>
      </Nav>

      <Overlay $show={mobileOpen} onClick={() => setMobileOpen(false)} />

      <MobileMenu $show={mobileOpen}>
        {links.map((link) => (
          <MobileNavLink
            key={link.to}
            to={link.to}
            className={location.pathname === link.to ? 'active' : ''}
          >
            {link.label}
          </MobileNavLink>
        ))}
        <MobileLoginLink to="/login">Sign In</MobileLoginLink>
      </MobileMenu>
    </>
  );
};

export default PublicNavbar;