import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import NotificationBell from "../notifications/NotificationBell";
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
  FiMenu,
  FiX,
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

  @media (max-width: 768px) {
    padding: 0 12px;
  }
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${(props) => props.theme.primary};
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;

  img {
    height: 36px;
    width: 36px;
    object-fit: contain;
    border-radius: 8px;
  }

  span {
    color: ${(props) => props.theme.navbarText};
  }

  @media (max-width: 768px) {
    font-size: 1.2rem;

    img {
      height: 30px;
      width: 30px;
    }
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
  gap: 5px;

  @media (max-width: 1024px) {
    gap: 2px;
  }

  @media (max-width: 900px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: ${(props) => props.theme.navbarText};
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 0.88rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;

  &:hover {
    background: ${(props) => props.theme.primary};
    color: white;
  }

  &.active {
    background: ${(props) => props.theme.primary};
    color: white;
  }

  @media (max-width: 1100px) {
    padding: 8px 8px;
    font-size: 0.82rem;

    svg {
      display: none;
    }
  }

  @media (min-width: 1101px) {
    svg {
      display: block;
    }
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    gap: 6px;
  }
`;

const UserInfo = styled.div`
  color: ${(props) => props.theme.navbarText};
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;

  @media (max-width: 1024px) {
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

  @media (max-width: 768px) {
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

/* ============================================
   MOBILE MENU (Slide-in drawer)
   ============================================ */
const MobileOverlay = styled.div`
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 998;
  opacity: ${(props) => (props.show ? 1 : 0)};
  visibility: ${(props) => (props.show ? "visible" : "hidden")};
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);
`;

const MobileMenu = styled.div`
  position: fixed;
  top: 70px;
  right: 0;
  width: 280px;
  max-width: 85vw;
  height: calc(100vh - 70px);
  background: ${(props) => props.theme.navbarBg};
  border-left: 1px solid ${(props) => props.theme.border};
  z-index: 999;
  display: flex;
  flex-direction: column;
  padding: 20px 0;
  transform: translateX(${(props) => (props.show ? "0" : "100%")});
  transition: transform 0.3s ease;
  overflow-y: auto;

  @media (min-width: 901px) {
    display: none;
  }
`;

const MobileUserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 20px;
  margin-bottom: 12px;
  border-bottom: 1px solid ${(props) => props.theme.border};
  color: ${(props) => props.theme.navbarText};
  font-size: 0.95rem;
  font-weight: 600;

  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: ${(props) => props.theme.primary};
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.1rem;
  }
`;

const MobileNavLink = styled(Link)`
  color: ${(props) => props.theme.navbarText};
  text-decoration: none;
  padding: 14px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1rem;
  transition: all 0.2s;
  border-left: 3px solid transparent;

  &:hover {
    background: ${(props) => props.theme.surface2};
  }

  &.active {
    background: ${(props) => props.theme.primary}22;
    border-left-color: ${(props) => props.theme.primary};
    color: ${(props) => props.theme.primary};
    font-weight: 600;
  }

  svg {
    flex-shrink: 0;
  }
`;

const MobileDivider = styled.div`
  height: 1px;
  background: ${(props) => props.theme.border};
  margin: 10px 0;
`;

const MobileLogoutButton = styled.button`
  color: ${(props) => props.theme.danger};
  background: transparent;
  border: none;
  padding: 14px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1rem;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
  width: 100%;

  &:hover {
    background: ${(props) => props.theme.danger}22;
  }
`;

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Hide navbar on login/register
  const authPages = ["/login", "/register"];
  const hideNav = authPages.includes(location.pathname);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  if (hideNav) return null;

  const handleLogout = () => {
    setMobileOpen(false);
    logout();
    navigate("/login");
  };

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: <FiHome /> },
    { to: "/areas", label: "Areas", icon: <FiGrid /> },
    { to: "/courses", label: "Courses", icon: <FiBookOpen /> },
    { to: "/books", label: "Books", icon: <FiBook /> },
    { to: "/goals", label: "Goals", icon: <FiTarget /> },
    { to: "/prayers", label: "Prayers", icon: <FiCalendar /> },
    { to: "/weekly", label: "Weekly", icon: <FiPieChart /> },
  ];

  if (user?.role === "admin") {
    navItems.push({ to: "/admin", label: "Admin", icon: <FiUsers /> });
  }

  return (
    <>
      <Nav>
        <Logo to="/dashboard">
          <img src="/favicon.svg" alt="Discipline Logo" />
          <span>Discipline</span>
        </Logo>

        {/* Desktop nav links */}
        <NavLinks>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={location.pathname === item.to ? "active" : ""}
            >
              {item.icon} {item.label}
            </NavLink>
          ))}
        </NavLinks>

        <RightSection>
          <UserInfo>
            <FiUser />
            {user?.username}
          </UserInfo>

          <NotificationBell />

          <ThemeToggle />

          <LogoutButton onClick={handleLogout} title="Logout">
            <FiLogOut />
          </LogoutButton>

          <MobileMenuButton
            onClick={() => setMobileOpen(!mobileOpen)}
            title="Menu"
          >
            {mobileOpen ? <FiX /> : <FiMenu />}
          </MobileMenuButton>
        </RightSection>
      </Nav>

      {/* Mobile overlay */}
      <MobileOverlay
        show={mobileOpen}
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile drawer */}
      <MobileMenu show={mobileOpen}>
        <MobileUserInfo>
          <div className="avatar">
            <FiUser />
          </div>
          <div>
            <div>{user?.username}</div>
            <div style={{ fontSize: "0.75rem", opacity: 0.7, fontWeight: 400 }}>
              {user?.role === "admin" ? "Administrator" : "User"}
            </div>
          </div>
        </MobileUserInfo>

        {navItems.map((item) => (
          <MobileNavLink
            key={item.to}
            to={item.to}
            className={location.pathname === item.to ? "active" : ""}
          >
            {item.icon} {item.label}
          </MobileNavLink>
        ))}

        <MobileDivider />

        <MobileLogoutButton onClick={handleLogout}>
          <FiLogOut /> Logout
        </MobileLogoutButton>
      </MobileMenu>
    </>
  );
};

export default Navbar;