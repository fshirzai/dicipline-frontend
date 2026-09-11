import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import {
  FiBookOpen,
  FiBook,
  FiTarget,
  FiMoon,
  FiTrendingUp,
  FiCheckCircle,
  FiArrowRight,
  FiStar,
  FiShield,
  FiZap,
} from 'react-icons/fi';

const Wrapper = styled.div`
  overflow-x: hidden;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const Hero = styled.section`
  padding: 100px 0 80px;
  text-align: center;
  position: relative;

  @media (max-width: 768px) {
    padding: 60px 0 50px;
  }

  &::before {
    content: '';
    position: absolute;
    top: 10%;
    left: 50%;
    transform: translateX(-50%);
    width: 600px;
    height: 600px;
    max-width: 90vw;
    background: radial-gradient(
      circle,
      ${(props) => props.theme.primary}22 0%,
      transparent 70%
    );
    pointer-events: none;
    z-index: 0;
  }
`;

const HeroInner = styled.div`
  position: relative;
  z-index: 1;
`;

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 18px;
  border-radius: 30px;
  background: ${(props) => props.theme.primary}15;
  border: 1px solid ${(props) => props.theme.primary}44;
  color: ${(props) => props.theme.primary};
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 24px;

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${(props) => props.theme.primary};
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.5;
      transform: scale(1.3);
    }
  }
`;

const Title = styled.h1`
  font-size: 4rem;
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -1.5px;
  margin-bottom: 24px;
  color: ${(props) => props.theme.text};

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
    font-size: 2.4rem;
    letter-spacing: -0.8px;
  }

  @media (max-width: 400px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: ${(props) => props.theme.textSecondary};
  max-width: 640px;
  margin: 0 auto 40px;
  line-height: 1.7;

  @media (max-width: 768px) {
    font-size: 1.05rem;
    margin-bottom: 32px;
  }
`;

const CTAButtons = styled.div`
  display: flex;
  gap: 14px;
  justify-content: center;
  flex-wrap: wrap;
`;

const PrimaryButton = styled(Link)`
  padding: 16px 34px;
  background: ${(props) => props.theme.primary};
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  transition: all 0.25s;
  box-shadow: 0 8px 24px ${(props) => props.theme.primary}44;

  &:hover {
    background: ${(props) => props.theme.primaryDark};
    transform: translateY(-3px);
    box-shadow: 0 14px 32px ${(props) => props.theme.primary}55;
  }

  @media (max-width: 500px) {
    padding: 14px 26px;
    font-size: 0.95rem;
  }
`;

const SecondaryButton = styled(Link)`
  padding: 16px 34px;
  background: ${(props) => props.theme.surface};
  color: ${(props) => props.theme.text};
  border: 1px solid ${(props) => props.theme.border};
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  transition: all 0.25s;

  &:hover {
    border-color: ${(props) => props.theme.primary};
    color: ${(props) => props.theme.primary};
    transform: translateY(-3px);
  }

  @media (max-width: 500px) {
    padding: 14px 26px;
    font-size: 0.95rem;
  }
`;

const StatsBar = styled.div`
  margin-top: 80px;
  padding: 32px 20px;
  background: ${(props) => props.theme.surface};
  border: 1px solid ${(props) => props.theme.border};
  border-radius: 20px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    margin-top: 50px;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
    padding: 26px 18px;
  }
`;

const StatItem = styled.div`
  text-align: center;

  .value {
    font-size: 1.8rem;
    font-weight: 800;
    color: ${(props) => props.theme.primary};
    margin-bottom: 4px;
    letter-spacing: -0.5px;

    @media (max-width: 500px) {
      font-size: 1.4rem;
    }
  }

  .label {
    font-size: 0.8rem;
    color: ${(props) => props.theme.textSecondary};
    font-weight: 500;
  }
`;

const Section = styled.section`
  padding: 90px 0;

  @media (max-width: 768px) {
    padding: 60px 0;
  }
`;

const SectionTag = styled.div`
  text-align: center;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: ${(props) => props.theme.primary};
  margin-bottom: 14px;
`;

const SectionTitle = styled.h2`
  font-size: 2.6rem;
  text-align: center;
  margin-bottom: 16px;
  color: ${(props) => props.theme.text};
  font-weight: 800;
  letter-spacing: -1px;

  @media (max-width: 768px) {
    font-size: 1.9rem;
  }
`;

const SectionSubtitle = styled.p`
  text-align: center;
  color: ${(props) => props.theme.textSecondary};
  font-size: 1.05rem;
  max-width: 600px;
  margin: 0 auto 60px;
  line-height: 1.7;

  @media (max-width: 768px) {
    font-size: 0.95rem;
    margin-bottom: 40px;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const FeatureCard = styled.div`
  background: ${(props) => props.theme.surface};
  padding: 32px 26px;
  border-radius: 18px;
  border: 1px solid ${(props) => props.theme.border};
  transition: all 0.3s;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${(props) => props.color};
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.4s;
  }

  &:hover::before {
    transform: scaleX(1);
  }

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    border-color: ${(props) => props.color}66;
  }

  .icon-wrap {
    width: 56px;
    height: 56px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${(props) => props.color}1f;
    color: ${(props) => props.color};
    font-size: 1.5rem;
    margin-bottom: 20px;
    transition: all 0.3s;
  }

  &:hover .icon-wrap {
    background: ${(props) => props.color};
    color: white;
    transform: rotate(-6deg) scale(1.05);
  }

  h3 {
    font-size: 1.2rem;
    margin-bottom: 10px;
    color: ${(props) => props.theme.text};
    font-weight: 700;
  }

  p {
    color: ${(props) => props.theme.textSecondary};
    font-size: 0.92rem;
    line-height: 1.65;
  }
`;

const HowItWorks = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 32px;
  max-width: 1000px;
  margin: 0 auto;

  @media (max-width: 500px) {
    gap: 24px;
  }
`;

const Step = styled.div`
  text-align: center;
  position: relative;

  .number {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(
      135deg,
      ${(props) => props.theme.primary},
      ${(props) => props.theme.secondary || '#7c3aed'}
    );
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.4rem;
    font-weight: 800;
    margin: 0 auto 20px;
    box-shadow: 0 10px 24px ${(props) => props.theme.primary}44;
  }

  h4 {
    font-size: 1.1rem;
    margin-bottom: 10px;
    color: ${(props) => props.theme.text};
    font-weight: 700;
  }

  p {
    color: ${(props) => props.theme.textSecondary};
    font-size: 0.9rem;
    line-height: 1.65;
  }
`;

const CTASection = styled.section`
  margin: 40px 0 60px;
  padding: 70px 40px;
  border-radius: 24px;
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.primary},
    ${(props) => props.theme.secondary || '#7c3aed'}
  );
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -10%;
    width: 400px;
    height: 400px;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 50%;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -50%;
    left: -10%;
    width: 300px;
    height: 300px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 50%;
  }

  @media (max-width: 768px) {
    padding: 50px 24px;
    margin: 30px 0 40px;
  }
`;

const CTAInner = styled.div`
  position: relative;
  z-index: 1;

  h2 {
    font-size: 2.4rem;
    margin-bottom: 14px;
    color: white;
    font-weight: 800;
    letter-spacing: -0.8px;

    @media (max-width: 768px) {
      font-size: 1.7rem;
    }
  }

  p {
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 32px;
    font-size: 1.08rem;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
    line-height: 1.6;
  }
`;

const CTAButton = styled(Link)`
  padding: 16px 36px;
  background: white;
  color: ${(props) => props.theme.primary};
  text-decoration: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1rem;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  transition: all 0.25s;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.3);
  }
`;

const Home = () => {
  const features = [
    {
      icon: <FiBookOpen />,
      color: '#4f46e5',
      title: 'Smart Courses',
      desc: 'Add a course with topics — we automatically assign each topic to a day so you always know what to study.',
    },
    {
      icon: <FiBook />,
      color: '#10b981',
      title: 'Reading Tracker',
      desc: 'Add a book with pages, and we divide the reading across the days. Just show up and read what\'s planned.',
    },
    {
      icon: <FiTarget />,
      color: '#f59e0b',
      title: 'Goals & Tasks',
      desc: 'Break big goals into small daily tasks. Complete them one by one and watch your progress grow.',
    },
    {
      icon: <FiMoon />,
      color: '#8b5cf6',
      title: 'Daily Prayers',
      desc: 'Track all five prayers — Fajer, Duher, Aser, Maghrib, and Isha — with a clean weekly view.',
    },
    {
      icon: <FiTrendingUp />,
      color: '#ec4899',
      title: 'Weekly Reviews',
      desc: 'See your weekly completion rate with beautiful charts. Understand exactly where you shine.',
    },
    {
      icon: <FiCheckCircle />,
      color: '#06b6d4',
      title: 'Daily Dashboard',
      desc: 'Every morning, see everything on your plate — tasks, reading, prayers — all in one focused view.',
    },
  ];

  return (
    <Wrapper>
      <Container>
        <Hero>
          <HeroInner>
            <Badge>
              <span className="dot" />
              Now live — start building your discipline
            </Badge>
            <Title>
              Build <span>Discipline</span>,
              <br />
              One Day at a Time
            </Title>
            <Subtitle>
              Track courses, books, goals, and daily prayers in one
              beautifully-designed app. Stay consistent. See your progress.
              Grow every single day.
            </Subtitle>
            <CTAButtons>
              <PrimaryButton to="/register">
                Get Started Free <FiArrowRight />
              </PrimaryButton>
              <SecondaryButton to="/about">
                Learn More
              </SecondaryButton>
            </CTAButtons>

            <StatsBar>
              <StatItem>
                <div className="value">6</div>
                <div className="label">Powerful Features</div>
              </StatItem>
              <StatItem>
                <div className="value">5</div>
                <div className="label">Daily Prayers</div>
              </StatItem>
              <StatItem>
                <div className="value">100%</div>
                <div className="label">Free to Use</div>
              </StatItem>
              <StatItem>
                <div className="value">∞</div>
                <div className="label">Possibilities</div>
              </StatItem>
            </StatsBar>
          </HeroInner>
        </Hero>

        <Section>
          <SectionTag>Features</SectionTag>
          <SectionTitle>Everything you need to stay consistent</SectionTitle>
          <SectionSubtitle>
            Six powerful features designed to help you build lasting habits
            and achieve your personal goals.
          </SectionSubtitle>
          <FeaturesGrid>
            {features.map((f, i) => (
              <FeatureCard key={i} color={f.color}>
                <div className="icon-wrap">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </FeatureCard>
            ))}
          </FeaturesGrid>
        </Section>

        <Section>
          <SectionTag>How it works</SectionTag>
          <SectionTitle>Three steps to build discipline</SectionTitle>
          <SectionSubtitle>
            Getting started takes less than a minute. Then it just works.
          </SectionSubtitle>
          <HowItWorks>
            <Step>
              <div className="number">1</div>
              <h4>Create an Area</h4>
              <p>
                Start with a focus area — like "Islamic Studies" or "Health" —
                to organize everything.
              </p>
            </Step>
            <Step>
              <div className="number">2</div>
              <h4>Add Courses, Books, Goals</h4>
              <p>
                Add content you want to work on. The system automatically
                distributes it across the days you choose.
              </p>
            </Step>
            <Step>
              <div className="number">3</div>
              <h4>Show Up Daily</h4>
              <p>
                Open the dashboard each day to see your tasks. Complete them,
                track prayers, and watch your progress grow.
              </p>
            </Step>
          </HowItWorks>
        </Section>

        <CTASection>
          <CTAInner>
            <h2>Start your journey today</h2>
            <p>
              Join and take the first step toward a more disciplined,
              focused, and fulfilling life.
            </p>
            <CTAButton to="/register">
              Create Free Account <FiArrowRight />
            </CTAButton>
          </CTAInner>
        </CTASection>
      </Container>
    </Wrapper>
  );
};

export default Home;