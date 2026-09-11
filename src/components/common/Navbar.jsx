import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../../hooks/useAuth";
import {
  FiHome,
  FiBook,
  FiBookOpen,
  FiTarget,
  FiLogOut,
  FiUser,
  FiCalendar,
  FiPieChart,
  FiUsers,
  FiGrid,
} from "react-icons/fi";
import ThemeToggle from "./ThemeToggle";

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: ${(props) => props.theme.navbarBg};
  border-bottom: 1px solid ${(props) => props.theme.border};
  padding: 0 20px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.3s ease;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${(props) => props.theme.primary};
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 10px;

  img {
    height: 36px;
    width: 36px;
    object-fit: contain;
    border-radius: 8px;
  }

  span {
    color: ${(props) => props.theme.navbarText};
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: ${(props) => props.theme.navbarText};
  text-decoration: none;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    background: ${(props) => props.theme.primary};
    color: white;
  }

  &.active {
    background: ${(props) => props.theme.primary};
    color: white;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const UserInfo = styled.div`
  color: ${(props) => props.theme.navbarText};
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const LogoutButton = styled.button`
  background: transparent;
  border: none;
  color: ${(props) => props.theme.navbarText};
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s;
  display: flex;
  align-items: center;

  &:hover {
    background: ${(props) => props.theme.danger};
    color: white;
  }
`;

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Hide the navbar entirely on login/register pages
  const authPages = ["/login", "/register"];
  if (authPages.includes(location.pathname)) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Nav>
      <Logo to="/dashboard">
        <img src="/favicon.svg" alt="Discipline Logo" />
        <span>Discipline</span>
      </Logo>

      <NavLinks>
        <NavLink to="/dashboard">
          <FiHome /> Dashboard
        </NavLink>
        <NavLink to="/areas">
          <FiGrid /> Areas
        </NavLink>
        <NavLink to="/courses">
          <FiBookOpen /> Courses
        </NavLink>
        <NavLink to="/books">
          <FiBook /> Books
        </NavLink>
        <NavLink to="/goals">
          <FiTarget /> Goals
        </NavLink>
        <NavLink to="/prayers">
          <FiCalendar /> Prayers
        </NavLink>
        <NavLink to="/weekly">
          <FiPieChart /> Weekly
        </NavLink>
        {user?.role === "admin" && (
          <NavLink to="/admin">
            <FiUsers /> Admin
          </NavLink>
        )}
      </NavLinks>

      <RightSection>
        <UserInfo>
          <FiUser />
          {user?.username}
        </UserInfo>

        <ThemeToggle />

        <LogoutButton onClick={handleLogout} title="Logout">
          <FiLogOut />
        </LogoutButton>
      </RightSection>
    </Nav>
  );
};

export default Navbar;