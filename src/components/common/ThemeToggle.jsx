import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../../context/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi';

const ToggleButton = styled.button`
  background: ${props => props.theme.surface2};
  border: 1px solid ${props => props.theme.border};
  color: ${props => props.theme.text};
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.primary};
    color: white;
    transform: rotate(30deg);
  }
`;

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <ToggleButton onClick={toggleTheme} title="Toggle theme">
      {theme === 'light' ? <FiMoon /> : <FiSun />}
    </ToggleButton>
  );
};

export default ThemeToggle;