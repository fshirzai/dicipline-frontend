import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import {
  FiBook,
  FiMail,
  FiGithub,
  FiTwitter,
  FiLinkedin,
  FiHeart,
  FiArrowRight,
} from 'react-icons/fi';

const Footer = styled.footer`
  background: ${(props) => props.theme.surface};
  border-top: 1px solid ${(props) => props.theme.border};
  padding: 64px 24px 28px;
  margin-top: auto;
  position: relative;
  overflow: hidden;
  color: ${(props) => props.theme.text};

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60%;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      ${(props) => props.theme.primary},
      transparent
    );
    opacity: 0.6;
  }

  @media (max-width: 768px) {
    padding: 48px 20px 24px;
  }
`;

const Inner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr;
  gap: 48px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr 1fr;
    gap: 40px;
  }

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
    gap: 32px;
    text-align: center;
  }
`;

const Column = styled.div`
  h4 {
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: ${(props) => props.theme.primary};
    margin-bottom: 20px;
    font-weight: 700;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      margin-bottom: 12px;

      a {
        color: ${(props) => props.theme.textSecondary};
        text-decoration: none;
        font-size: 0.9rem;
        transition: all 0.2s;
        display: inline-flex;
        align-items: center;
        gap: 6px;

        &:hover {
          color: ${(props) => props.theme.primary};
          transform: translateX(4px);
        }

        svg {
          font-size: 0.75rem;
          opacity: 0;
          transition: all 0.2s;
        }

        &:hover svg {
          opacity: 1;
        }
      }
    }
  }
`;

const BrandColumn = styled(Column)`
  @media (max-width: 900px) {
    grid-column: 1 / -1;
  }
`;

const LogoRow = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.4rem;
  font-weight: 800;
  color: ${(props) => props.theme.text};
  margin-bottom: 18px;
  text-decoration: none;
  letter-spacing: -0.5px;

  .logo-icon {
    width: 40px;
    height: 40px;
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
    font-size: 1.2rem;
    box-shadow: 0 4px 12px ${(props) => props.theme.primary}44;
  }

  @media (max-width: 500px) {
    justify-content: center;
  }
`;

const Tagline = styled.p`
  color: ${(props) => props.theme.textSecondary};
  font-size: 0.9rem;
  line-height: 1.7;
  margin-bottom: 22px;
  max-width: 340px;

  @media (max-width: 900px) {
    max-width: 100%;
  }
`;

const SocialRow = styled.div`
  display: flex;
  gap: 10px;

  a {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${(props) => props.theme.surface2};
    color: ${(props) => props.theme.text};
    transition: all 0.25s;
    font-size: 1rem;
    border: 1px solid ${(props) => props.theme.border};

    &:hover {
      background: ${(props) => props.theme.primary};
      color: white;
      transform: translateY(-3px);
      border-color: ${(props) => props.theme.primary};
      box-shadow: 0 8px 16px ${(props) => props.theme.primary}44;
    }
  }

  @media (max-width: 500px) {
    justify-content: center;
  }
`;

const NewsletterBox = styled.div`
  @media (max-width: 900px) {
    grid-column: 1 / -1;
  }
`;

const NewsletterDesc = styled.p`
  color: ${(props) => props.theme.textSecondary};
  font-size: 0.85rem;
  line-height: 1.6;
  margin-bottom: 14px;
`;

const NewsletterForm = styled.form`
  display: flex;
  gap: 8px;
  max-width: 340px;

  @media (max-width: 500px) {
    flex-direction: column;
    max-width: 100%;
  }
`;

const NewsletterInput = styled.input`
  flex: 1;
  padding: 10px 14px;
  background: ${(props) => props.theme.inputBg};
  border: 1px solid ${(props) => props.theme.border};
  border-radius: 8px;
  color: ${(props) => props.theme.text};
  font-size: 0.85rem;
  min-width: 0;

  &::placeholder {
    color: ${(props) => props.theme.textSecondary};
    opacity: 0.6;
  }

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.primary};
    box-shadow: 0 0 0 3px ${(props) => props.theme.primary}33;
  }
`;

const NewsletterButton = styled.button`
  padding: 10px 18px;
  background: ${(props) => props.theme.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
  white-space: nowrap;
  justify-content: center;

  &:hover {
    background: ${(props) => props.theme.primaryDark};
    transform: translateY(-2px);
  }
`;

const Bottom = styled.div`
  max-width: 1200px;
  margin: 48px auto 0;
  padding-top: 24px;
  border-top: 1px solid ${(props) => props.theme.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
  font-size: 0.82rem;
  color: ${(props) => props.theme.textSecondary};

  @media (max-width: 500px) {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
`;

const MadeWith = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;

  svg {
    color: ${(props) => props.theme.danger};
    fill: ${(props) => props.theme.danger};
  }
`;

const BottomLinks = styled.div`
  display: flex;
  gap: 20px;

  a {
    color: inherit;
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
      color: ${(props) => props.theme.primary};
    }
  }
`;

const PublicFooter = () => {
  const year = new Date().getFullYear();

  const handleNewsletter = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    window.location.href = `mailto:fiazullahshirzai2003@gmail.com?subject=Newsletter signup&body=Please add me to your list: ${email}`;
  };

  return (
    <Footer>
      <Inner>
        <BrandColumn>
          <LogoRow to="/">
            <div className="logo-icon">
              <FiBook />
            </div>
            <span>Discipline</span>
          </LogoRow>
          <Tagline>
            Build discipline through daily practice. Track courses, books,
            goals, and prayers — all in one focused space.
          </Tagline>
          <SocialRow>
            <a
              href="mailto:fiazullahshirzai2003@gmail.com"
              title="Email"
              aria-label="Email"
            >
              <FiMail />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub"
              aria-label="GitHub"
            >
              <FiGithub />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              title="Twitter"
              aria-label="Twitter"
            >
              <FiTwitter />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              title="LinkedIn"
              aria-label="LinkedIn"
            >
              <FiLinkedin />
            </a>
          </SocialRow>
        </BrandColumn>

        <Column>
          <h4>Product</h4>
          <ul>
            <li>
              <Link to="/">
                Home <FiArrowRight />
              </Link>
            </li>
            <li>
              <Link to="/about">
                About <FiArrowRight />
              </Link>
            </li>
            <li>
              <Link to="/contact">
                Contact <FiArrowRight />
              </Link>
            </li>
            <li>
              <Link to="/register">
                Get Started <FiArrowRight />
              </Link>
            </li>
          </ul>
        </Column>

        <Column>
          <h4>Features</h4>
          <ul>
            <li>
              <Link to="/courses">
                Courses <FiArrowRight />
              </Link>
            </li>
            <li>
              <Link to="/books">
                Reading <FiArrowRight />
              </Link>
            </li>
            <li>
              <Link to="/goals">
                Goals <FiArrowRight />
              </Link>
            </li>
            <li>
              <Link to="/prayers">
                Prayers <FiArrowRight />
              </Link>
            </li>
          </ul>
        </Column>

        <NewsletterBox>
          <h4
            style={{
              fontSize: '0.85rem',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              color: 'inherit',
              marginBottom: '20px',
              fontWeight: 700,
            }}
          >
            Stay Updated
          </h4>
          <NewsletterDesc>
            Get tips, feature updates, and motivation — straight to your inbox.
          </NewsletterDesc>
          <NewsletterForm onSubmit={handleNewsletter}>
            <NewsletterInput
              type="email"
              name="email"
              placeholder="you@example.com"
              required
            />
            <NewsletterButton type="submit">
              Subscribe <FiArrowRight size={14} />
            </NewsletterButton>
          </NewsletterForm>
        </NewsletterBox>
      </Inner>

      <Bottom>
        <div>© {year} Discipline. All rights reserved.</div>
        <MadeWith>
          Made with <FiHeart size={14} /> by Fiazullah Shirzai
        </MadeWith>
        <BottomLinks>
          <Link to="/about">Privacy</Link>
          <Link to="/about">Terms</Link>
          <Link to="/contact">Support</Link>
        </BottomLinks>
      </Bottom>
    </Footer>
  );
};

export default PublicFooter;