import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../hooks/useAuth';
import { FiMail, FiLock, FiUser } from 'react-icons/fi';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.theme.background};
  padding: 20px;
`;

const FormCard = styled.div`
  background: ${props => props.theme.surface};
  padding: 40px 35px;
  border-radius: 16px;
  width: 100%;
  max-width: 420px;
  box-shadow: ${props => props.theme.shadow};
  border: 1px solid ${props => props.theme.border};
  animation: fadeIn 0.5s ease;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: ${props => props.theme.text};
  margin-bottom: 8px;
  text-align: center;
`;

const Subtitle = styled.p`
  color: ${props => props.theme.textSecondary};
  text-align: center;
  margin-bottom: 30px;
  font-size: 0.95rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const InputGroup = styled.div`
  position: relative;
`;

const InputIcon = styled.span`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.textSecondary};
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 12px 12px 42px;
  background: ${props => props.theme.inputBg};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  color: ${props => props.theme.text};
  font-size: 1rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.primary}33;
  }
`;

const Button = styled.button`
  padding: 12px;
  background: ${props => props.theme.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.primaryDark};
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadowHover};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const Footer = styled.div`
  text-align: center;
  margin-top: 20px;
  color: ${props => props.theme.textSecondary};

  a {
    color: ${props => props.theme.primary};
    text-decoration: none;
    font-weight: 600;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const ErrorMessage = styled.div`
  background: ${props => props.theme.danger}22;
  color: ${props => props.theme.danger};
  padding: 12px;
  border-radius: 8px;
  font-size: 0.9rem;
  text-align: center;
  border-left: 4px solid ${props => props.theme.danger};
`;

const ValidationErrors = styled.ul`
  margin: 8px 0 0 0;
  padding-left: 20px;
  font-size: 0.85rem;
  color: ${props => props.theme.danger};

  li {
    margin-bottom: 4px;
  }
`;

const PasswordHint = styled.p`
  color: ${props => props.theme.textSecondary};
  font-size: 0.8rem;
  margin-top: -8px;
`;

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState([]);
  const { register } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = [];

    // Username validation
    if (!username || username.trim().length < 3) {
      errors.push('Username must be at least 3 characters');
    } else if (username.length > 30) {
      errors.push('Username cannot exceed 30 characters');
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      errors.push('Username can only contain letters, numbers, and underscores');
    }

    // Email validation
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!email || !emailRegex.test(email)) {
      errors.push('Please enter a valid email address');
    }

    // Password validation
    if (!password || password.length < 6) {
      errors.push('Password must be at least 6 characters');
    } else if (!/^(?=.*[A-Za-z])(?=.*\d)/.test(password)) {
      errors.push('Password must contain at least one letter and one number');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setValidationErrors([]);

    // Client-side validation first
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const result = await register(username.trim(), email.trim().toLowerCase(), password);
      
      if (result.success) {
        navigate('/dashboard');
      } else {
        // Check if backend returned validation errors
        if (result.errors && Array.isArray(result.errors)) {
          setValidationErrors(result.errors.map(err => 
            typeof err === 'string' ? err : err.message
          ));
        } else {
          setError(result.error || 'Registration failed. Please try again.');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <FormCard>
        <Title>Create Account</Title>
        <Subtitle>Start your discipline journey today</Subtitle>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <InputIcon><FiUser /></InputIcon>
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
              maxLength={30}
              autoComplete="username"
            />
          </InputGroup>

          <InputGroup>
            <InputIcon><FiMail /></InputIcon>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </InputGroup>

          <InputGroup>
            <InputIcon><FiLock /></InputIcon>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </InputGroup>

          <PasswordHint>
            Must be at least 6 characters with at least one letter and one number
          </PasswordHint>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          {validationErrors.length > 0 && (
            <ErrorMessage>
              <strong>Please fix the following:</strong>
              <ValidationErrors>
                {validationErrors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ValidationErrors>
            </ErrorMessage>
          )}

          <Button type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </Form>

        <Footer>
          Already have an account? <Link to="/login">Sign In</Link>
        </Footer>
      </FormCard>
    </Container>
  );
};

export default Register;