import React, { useState } from 'react';
import styled from 'styled-components';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FiSend, FiUsers, FiMail, FiMessageSquare } from 'react-icons/fi';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Card = styled.div`
  background: ${(props) => props.theme.surface};
  padding: 30px;
  border-radius: 12px;
  border: 1px solid ${(props) => props.theme.border};
`;

const Header = styled.div`
  margin-bottom: 24px;

  h2 {
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 6px;
  }

  p {
    color: ${(props) => props.theme.textSecondary};
    font-size: 0.9rem;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;

  label {
    display: block;
    margin-bottom: 6px;
    font-weight: 600;
    color: ${(props) => props.theme.text};
    font-size: 0.95rem;
    display: flex;
    align-items: center;
    gap: 6px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  background: ${(props) => props.theme.inputBg};
  border: 1px solid ${(props) => props.theme.border};
  border-radius: 8px;
  color: ${(props) => props.theme.text};
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.primary};
    box-shadow: 0 0 0 3px ${(props) => props.theme.primary}33;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  background: ${(props) => props.theme.inputBg};
  border: 1px solid ${(props) => props.theme.border};
  border-radius: 8px;
  color: ${(props) => props.theme.text};
  font-size: 1rem;
  min-height: 200px;
  resize: vertical;
  font-family: inherit;
  line-height: 1.6;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.primary};
    box-shadow: 0 0 0 3px ${(props) => props.theme.primary}33;
  }
`;

const CheckboxRow = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: ${(props) => props.theme.surface2};
  border-radius: 8px;
  cursor: pointer;
  border: 1px solid ${(props) => props.theme.border};

  input[type='checkbox'] {
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: ${(props) => props.theme.primary};
  }

  .text {
    flex: 1;

    .title {
      font-weight: 600;
      font-size: 0.9rem;
    }

    .hint {
      font-size: 0.8rem;
      color: ${(props) => props.theme.textSecondary};
      margin-top: 2px;
    }
  }
`;

const SubmitButton = styled.button`
  padding: 14px 24px;
  background: ${(props) => props.theme.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
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

const InfoBox = styled.div`
  background: ${(props) => props.theme.primary}11;
  border-left: 4px solid ${(props) => props.theme.primary};
  padding: 14px 18px;
  border-radius: 8px;
  margin-bottom: 24px;
  font-size: 0.9rem;
  color: ${(props) => props.theme.textSecondary};
  line-height: 1.6;

  strong {
    color: ${(props) => props.theme.primary};
  }
`;

const SuccessBox = styled.div`
  background: ${(props) => props.theme.success}22;
  border-left: 4px solid ${(props) => props.theme.success};
  padding: 14px 18px;
  border-radius: 8px;
  margin-top: 16px;
  font-size: 0.9rem;
  color: ${(props) => props.theme.success};
  line-height: 1.6;
`;

const AdminBroadcast = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [sendEmail, setSendEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      toast.error('Please fill in both title and message');
      return;
    }

    if (
      !window.confirm(
        sendEmail
          ? 'This will send an in-app notification AND an email to all active users. Continue?'
          : 'This will send an in-app notification to all users. Continue?'
      )
    ) {
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await api.post('/notifications/broadcast', {
        title: title.trim(),
        message: message.trim(),
        sendEmail,
      });

      toast.success('Broadcast sent successfully! 📢');
      setResult(res.data);
      setTitle('');
      setMessage('');
      setSendEmail(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send broadcast');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Card>
        <Header>
          <h2>
            <FiSend /> Send Broadcast Message
          </h2>
          <p>Send an update to all active users — shows in-app and optionally via email.</p>
        </Header>

        <InfoBox>
          <strong>📢 How it works:</strong> Your message will appear in every user's
          notification bell instantly. If you enable email, each user will also
          receive a styled email in their inbox.
        </InfoBox>

        <form onSubmit={handleSubmit}>
          <FormGroup>
            <label>
              <FiMessageSquare size={16} /> Title
            </label>
            <Input
              type="text"
              placeholder="e.g., 'New feature: Track your prayers daily'"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              required
            />
          </FormGroup>

          <FormGroup>
            <label>
              <FiMessageSquare size={16} /> Message
            </label>
            <TextArea
              placeholder="Write your message to users here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={2000}
              required
            />
            <div
              style={{
                textAlign: 'right',
                fontSize: '0.75rem',
                color: '#9ca3af',
                marginTop: '4px',
              }}
            >
              {message.length} / 2000
            </div>
          </FormGroup>

          <FormGroup>
            <CheckboxRow>
              <input
                type="checkbox"
                checked={sendEmail}
                onChange={(e) => setSendEmail(e.target.checked)}
              />
              <div className="text">
                <div className="title">
                  <FiMail
                    size={14}
                    style={{ display: 'inline', marginRight: '4px' }}
                  />
                  Also send via email
                </div>
                <div className="hint">
                  Send a styled email to every active user's inbox
                </div>
              </div>
            </CheckboxRow>
          </FormGroup>

          <SubmitButton type="submit" disabled={loading}>
            <FiSend />
            {loading
              ? sendEmail
                ? 'Sending notifications & emails...'
                : 'Sending...'
              : 'Send Broadcast'}
          </SubmitButton>

          {result && (
            <SuccessBox>
              ✅ Sent to <strong>{result.emailResult?.sent ?? 0}</strong> users
              {sendEmail && (
                <>
                  {' '}
                  via email
                  {result.emailResult?.failed > 0 && (
                    <> ({result.emailResult.failed} failed)</>
                  )}
                </>
              )}
              . The notification appears in every user's bell.
            </SuccessBox>
          )}
        </form>
      </Card>
    </Container>
  );
};

export default AdminBroadcast;