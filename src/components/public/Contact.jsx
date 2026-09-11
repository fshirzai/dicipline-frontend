import React, { useState } from 'react';
import styled from 'styled-components';
import toast from 'react-hot-toast';
import {
  FiMail,
  FiSend,
  FiUser,
  FiMessageSquare,
  FiCheckCircle,
  FiClock,
  FiMapPin,
} from 'react-icons/fi';

const Wrapper = styled.div`
  overflow-x: hidden;
`;

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px;
`;

const HeroSection = styled.section`
  padding: 80px 0 40px;
  text-align: center;
  position: relative;

  @media (max-width: 768px) {
    padding: 50px 0 30px;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 500px;
    height: 500px;
    max-width: 90vw;
    background: radial-gradient(
      circle,
      ${(props) => props.theme.primary}22 0%,
      transparent 70%
    );
    pointer-events: none;
  }
`;

const Tag = styled.div`
  display: inline-block;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: ${(props) => props.theme.primary};
  margin-bottom: 16px;
  position: relative;
  z-index: 1;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  letter-spacing: -1.2px;
  margin-bottom: 18px;
  color: ${(props) => props.theme.text};
  position: relative;
  z-index: 1;

  span {
    background: linear-gradient(
      135deg,
      ${(props) => props.theme.primary},
      ${(props) => props.theme.secondary || '#7c3aed'}
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  color: ${(props) => props.theme.textSecondary};
  font-size: 1.1rem;
  line-height: 1.7;
  max-width: 600px;
  margin: 0 auto;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    font-size: 0.98rem;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 40px;
  margin: 60px 0;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 30px;
    margin: 40px 0;
  }
`;

const InfoColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InfoCard = styled.div`
  background: ${(props) => props.theme.surface};
  padding: 24px;
  border-radius: 16px;
  border: 1px solid ${(props) => props.theme.border};
  transition: all 0.3s;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
    border-color: ${(props) => props.theme.primary}66;
  }

  .icon-wrap {
    width: 46px;
    height: 46px;
    border-radius: 12px;
    background: ${(props) => props.theme.primary}1f;
    color: ${(props) => props.theme.primary};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    margin-bottom: 14px;
  }

  h4 {
    font-size: 1rem;
    margin-bottom: 6px;
    color: ${(props) => props.theme.text};
    font-weight: 700;
  }

  p,
  a {
    font-size: 0.9rem;
    color: ${(props) => props.theme.textSecondary};
    line-height: 1.55;
    text-decoration: none;
    word-break: break-word;
  }

  a {
    color: ${(props) => props.theme.primary};
    font-weight: 600;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const FormCard = styled.div`
  background: ${(props) => props.theme.surface};
  padding: 40px;
  border-radius: 20px;
  border: 1px solid ${(props) => props.theme.border};
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.06);

  @media (max-width: 500px) {
    padding: 26px 22px;
  }
`;

const FormTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 8px;
  color: ${(props) => props.theme.text};
  font-weight: 800;

  @media (max-width: 500px) {
    font-size: 1.25rem;
  }
`;

const FormDesc = styled.p`
  color: ${(props) => props.theme.textSecondary};
  font-size: 0.9rem;
  margin-bottom: 24px;
  line-height: 1.6;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-weight: 600;
    font-size: 0.85rem;
    color: ${(props) => props.theme.text};
    display: flex;
    align-items: center;
    gap: 6px;

    svg {
      color: ${(props) => props.theme.primary};
    }
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 13px 16px;
  background: ${(props) => props.theme.inputBg};
  border: 1px solid ${(props) => props.theme.border};
  border-radius: 10px;
  color: ${(props) => props.theme.text};
  font-size: 0.95rem;
  transition: all 0.2s;

  &::placeholder {
    color: ${(props) => props.theme.textSecondary};
    opacity: 0.6;
  }

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.primary};
    box-shadow: 0 0 0 4px ${(props) => props.theme.primary}22;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 13px 16px;
  background: ${(props) => props.theme.inputBg};
  border: 1px solid ${(props) => props.theme.border};
  border-radius: 10px;
  color: ${(props) => props.theme.text};
  font-size: 0.95rem;
  min-height: 140px;
  resize: vertical;
  font-family: inherit;
  transition: all 0.2s;

  &::placeholder {
    color: ${(props) => props.theme.textSecondary};
    opacity: 0.6;
  }

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.primary};
    box-shadow: 0 0 0 4px ${(props) => props.theme.primary}22;
  }
`;

const SubmitButton = styled.button`
  padding: 14px 24px;
  background: ${(props) => props.theme.primary};
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 8px;
  transition: all 0.25s;

  &:hover:not(:disabled) {
    background: ${(props) => props.theme.primaryDark};
    transform: translateY(-2px);
    box-shadow: 0 10px 24px ${(props) => props.theme.primary}44;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const SuccessMessage = styled.div`
  text-align: center;
  padding: 40px 20px;

  .icon {
    font-size: 3rem;
    color: ${(props) => props.theme.success};
    margin-bottom: 16px;
  }

  h3 {
    font-size: 1.4rem;
    margin-bottom: 10px;
    color: ${(props) => props.theme.text};
  }

  p {
    color: ${(props) => props.theme.textSecondary};
    font-size: 0.95rem;
    line-height: 1.6;
    margin-bottom: 20px;
  }
`;

const ResetButton = styled.button`
  padding: 10px 22px;
  background: transparent;
  border: 1px solid ${(props) => props.theme.border};
  color: ${(props) => props.theme.text};
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;

  &:hover {
    border-color: ${(props) => props.theme.primary};
    color: ${(props) => props.theme.primary};
  }
`;

// ============================================
// Replace with your Web3Forms access key
// ============================================
const WEB3FORMS_ACCESS_KEY = 'YOUR_WEB3FORMS_ACCESS_KEY';

const Contact = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill all required fields');
      return;
    }

    setSending(true);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          name: form.name,
          email: form.email,
          subject: form.subject || `New message from ${form.name}`,
          message: form.message,
          to: 'fiazullahshirzai2003@gmail.com',
          from_name: 'Discipline Contact Form',
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSent(true);
        toast.success('Message sent successfully! 🎉');
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        toast.error(result.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      toast.error('Network error — please try again');
    } finally {
      setSending(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <Wrapper>
      <Container>
        <HeroSection>
          <Tag>Get in Touch</Tag>
          <Title>
            Let's <span>Talk</span>
          </Title>
          <Subtitle>
            Have a question, feature idea, or just want to say hello? We'd love
            to hear from you — and we usually reply within 24 hours.
          </Subtitle>
        </HeroSection>

        <Grid>
          <InfoColumn>
            <InfoCard>
              <div className="icon-wrap">
                <FiMail />
              </div>
              <h4>Email Us</h4>
              <p>
                <a href="mailto:fiazullahshirzai2003@gmail.com">
                  fiazullahshirzai2003@gmail.com
                </a>
              </p>
            </InfoCard>

            <InfoCard>
              <div className="icon-wrap">
                <FiClock />
              </div>
              <h4>Response Time</h4>
              <p>Usually within 24 hours on weekdays.</p>
            </InfoCard>

            <InfoCard>
              <div className="icon-wrap">
                <FiMapPin />
              </div>
              <h4>Location</h4>
              <p>Remote-first. Serving users worldwide. 🌍</p>
            </InfoCard>
          </InfoColumn>

          <FormCard>
            {sent ? (
              <SuccessMessage>
                <div className="icon">
                  <FiCheckCircle />
                </div>
                <h3>Message Sent!</h3>
                <p>
                  Thanks for reaching out. We've received your message and will
                  get back to you as soon as possible.
                </p>
                <ResetButton onClick={() => setSent(false)}>
                  Send Another Message
                </ResetButton>
              </SuccessMessage>
            ) : (
              <>
                <FormTitle>Send us a message</FormTitle>
                <FormDesc>
                  Fill out the form below and we'll get back to you quickly.
                </FormDesc>

                <Form onSubmit={handleSubmit}>
                  <FormGroup>
                    <label>
                      <FiUser size={14} /> Your Name *
                    </label>
                    <Input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                    />
                  </FormGroup>

                  <FormGroup>
                    <label>
                      <FiMail size={14} /> Your Email *
                    </label>
                    <Input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      required
                    />
                  </FormGroup>

                  <FormGroup>
                    <label>
                      <FiMessageSquare size={14} /> Subject
                    </label>
                    <Input
                      type="text"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      placeholder="How can we help?"
                    />
                  </FormGroup>

                  <FormGroup>
                    <label>
                      <FiMessageSquare size={14} /> Message *
                    </label>
                    <TextArea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us what's on your mind..."
                      required
                    />
                  </FormGroup>

                  <SubmitButton type="submit" disabled={sending}>
                    <FiSend />
                    {sending ? 'Sending...' : 'Send Message'}
                  </SubmitButton>
                </Form>
              </>
            )}
          </FormCard>
        </Grid>
      </Container>
    </Wrapper>
  );
};

export default Contact;