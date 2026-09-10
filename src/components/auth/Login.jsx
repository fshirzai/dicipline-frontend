import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../hooks/useAuth';
import { FiMail, FiLock } from 'react-icons/fi';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => props.theme.background};
  padding: 20px;
`;

const FormCard = styled.div`
  background: ${(props) => props.theme.surface};
  padding: 50px 40px;
  border-radius: 16px;
  width: 100%;
  max-width: 420px;
  box-shadow: ${(props) => props.theme.shadow};
  border: 1px solid ${(props) => props.theme.border};
  animation: fadeIn 0.5s ease;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: ${(props) => props.theme.text};
  margin-bottom: 8px;
  text-align: center;
`;

const Subtitle = styled.p`
  color: ${(props) => props.theme.textSecondary};
  text-align: center;
  margin-bottom: 30px;
  font-size: 0.95rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  position: relative;
`;

const InputIcon = styled.span`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${(props) => props.theme.textSecondary};
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 12px 12px 42px;
  background: ${(props) => props.theme.inputBg};
  border: 1px solid ${(props) => props.theme.border};
  border-radius: 8px;
  color: ${(props) => props.theme.text};
  font-size: 1rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.primary};
    box-shadow: 0 0 0 3px ${(props) => props.theme.primary}33;
  }
`;

const Button = styled.button`
  padding: 12px;
  background: ${(props) => props.theme.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${(props) => props.theme.primaryDark};
    transform: translateY(-2px);
    box-shadow: ${(props) => props.theme.shadowHover};
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
  color: ${(props) => props.theme.textSecondary};

  a {
    color: ${(props) => props.theme.primary};
    text-decoration: none;
    font-weight: 600;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const ErrorMessage = styled.div`
  background: ${(props) => props.theme.danger}22;
  color: ${(props) => props.theme.danger};
  padding: 10px;
  border-radius: 8px;
  font-size: 0.9rem;
  text-align: center;
  border-left: 4px solid ${(props) => props.theme.danger};
`;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email.trim().toLowerCase(), password);

      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Login failed');
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
        <Title>Welcome Back</Title>
        <Subtitle>Sign in to your Discipline account</Subtitle>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <InputIcon>
              <FiMail />
            </InputIcon>
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
            <InputIcon>
              <FiLock />
            </InputIcon>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </InputGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <Button type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </Form>

        <Footer>
          Don't have an account? <Link to="/register">Sign Up</Link>
        </Footer>
      </FormCard>
    </Container>
  );
};

export default Login;