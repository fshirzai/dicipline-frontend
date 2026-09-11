import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import {
  FiArrowRight,
  FiTarget,
  FiHeart,
  FiShield,
  FiZap,
  FiGithub,
  FiLinkedin,
  FiMail,
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
  padding: 90px 0 60px;
  text-align: center;
  position: relative;

  @media (max-width: 768px) {
    padding: 60px 0 40px;
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
  font-size: 3.4rem;
  font-weight: 800;
  letter-spacing: -1.5px;
  margin-bottom: 20px;
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
    font-size: 2.2rem;
    letter-spacing: -0.8px;
  }
`;

const Lead = styled.p`
  font-size: 1.2rem;
  color: ${(props) => props.theme.textSecondary};
  line-height: 1.7;
  max-width: 700px;
  margin: 0 auto;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    font-size: 1.05rem;
  }
`;

const Section = styled.section`
  padding: 60px 0;

  @media (max-width: 768px) {
    padding: 40px 0;
  }
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 24px;
  color: ${(props) => props.theme.text};
  font-weight: 800;
  letter-spacing: -0.8px;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const SectionSubtitle = styled.p`
  color: ${(props) => props.theme.textSecondary};
  font-size: 1rem;
  line-height: 1.7;
  max-width: 640px;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    font-size: 0.95rem;
    margin-bottom: 30px;
  }
`;

const Paragraph = styled.p`
  color: ${(props) => props.theme.textSecondary};
  line-height: 1.85;
  margin-bottom: 18px;
  font-size: 1.02rem;

  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
`;

const Card = styled.div`
  background: ${(props) => props.theme.surface};
  border: 1px solid ${(props) => props.theme.border};
  border-radius: 20px;
  padding: 40px;
  margin: 30px 0;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(
      180deg,
      ${(props) => props.theme.primary},
      ${(props) => props.theme.secondary || '#7c3aed'}
    );
  }

  @media (max-width: 500px) {
    padding: 26px 22px;
  }
`;

const Quote = styled.blockquote`
  font-size: 1.25rem;
  font-style: italic;
  color: ${(props) => props.theme.text};
  line-height: 1.7;
  margin: 0 0 16px;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 1.08rem;
  }
`;

const QuoteAuthor = styled.div`
  font-size: 0.9rem;
  color: ${(props) => props.theme.textSecondary};
  font-weight: 600;
`;

const ValuesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 22px;
  margin-top: 32px;

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const ValueCard = styled.div`
  background: ${(props) => props.theme.surface};
  padding: 28px 24px;
  border-radius: 16px;
  border: 1px solid ${(props) => props.theme.border};
  transition: all 0.3s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 16px 32px rgba(0, 0, 0, 0.12);
    border-color: ${(props) => props.color}66;
  }

  .icon-wrap {
    width: 50px;
    height: 50px;
    border-radius: 12px;
    background: ${(props) => props.color}1f;
    color: ${(props) => props.color};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.3rem;
    margin-bottom: 16px;
    transition: all 0.3s;
  }

  &:hover .icon-wrap {
    background: ${(props) => props.color};
    color: white;
    transform: rotate(-6deg);
  }

  h4 {
    font-size: 1.1rem;
    margin-bottom: 8px;
    color: ${(props) => props.theme.text};
    font-weight: 700;
  }

  p {
    font-size: 0.9rem;
    color: ${(props) => props.theme.textSecondary};
    line-height: 1.65;
    margin: 0;
  }
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 20px;
  margin-top: 32px;

  @media (max-width: 500px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
  }
`;

const MetricCard = styled.div`
  background: ${(props) => props.theme.surface};
  padding: 26px 20px;
  border-radius: 16px;
  border: 1px solid ${(props) => props.theme.border};
  text-align: center;

  .value {
    font-size: 2rem;
    font-weight: 800;
    color: ${(props) => props.theme.primary};
    letter-spacing: -0.5px;
    margin-bottom: 4px;

    @media (max-width: 500px) {
      font-size: 1.5rem;
    }
  }

  .label {
    font-size: 0.8rem;
    color: ${(props) => props.theme.textSecondary};
    font-weight: 500;
  }
`;

// ============================================
// TEAM SECTION
// ============================================
const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 28px;
  margin-top: 32px;

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const TeamCard = styled.div`
  background: ${(props) => props.theme.surface};
  border: 1px solid ${(props) => props.theme.border};
  border-radius: 20px;
  padding: 32px 24px;
  text-align: center;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
    border-color: ${(props) => props.theme.primary}66;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 90px;
    background: linear-gradient(
      135deg,
      ${(props) => props.theme.primary}22,
      ${(props) => props.theme.secondary || props.theme.primaryDark}22
    );
    z-index: 0;
  }
`;

const TeamPhoto = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin: 0 auto 18px;
  position: relative;
  z-index: 1;
  border: 4px solid ${(props) => props.theme.surface};
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  background: ${(props) => props.theme.surface2};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
  }

  .fallback {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.5rem;
    font-weight: 800;
    color: white;
    background: linear-gradient(
      135deg,
      ${(props) => props.theme.primary},
      ${(props) => props.theme.secondary || props.theme.primaryDark}
    );
  }
`;

const TeamName = styled.h3`
  font-size: 1.15rem;
  color: ${(props) => props.theme.text};
  font-weight: 700;
  margin-bottom: 4px;
  position: relative;
  z-index: 1;
`;

const TeamRole = styled.div`
  font-size: 0.85rem;
  color: ${(props) => props.theme.primary};
  font-weight: 600;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: relative;
  z-index: 1;
`;

const TeamBio = styled.p`
  font-size: 0.88rem;
  color: ${(props) => props.theme.textSecondary};
  line-height: 1.6;
  margin-bottom: 18px;
  position: relative;
  z-index: 1;
`;

const TeamSocials = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  position: relative;
  z-index: 1;

  a {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${(props) => props.theme.surface2};
    color: ${(props) => props.theme.textSecondary};
    transition: all 0.2s;
    font-size: 0.9rem;
    border: 1px solid ${(props) => props.theme.border};

    &:hover {
      background: ${(props) => props.theme.primary};
      color: white;
      transform: translateY(-3px);
      border-color: ${(props) => props.theme.primary};
    }
  }
`;

const CTASection = styled.section`
  margin: 60px 0;
  padding: 60px 40px;
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
    width: 350px;
    height: 350px;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 50%;
  }

  @media (max-width: 768px) {
    padding: 44px 24px;
    margin: 40px 0;
  }
`;

const CTAInner = styled.div`
  position: relative;
  z-index: 1;

  h2 {
    font-size: 2rem;
    color: white;
    margin-bottom: 14px;
    font-weight: 800;
    letter-spacing: -0.8px;

    @media (max-width: 768px) {
      font-size: 1.5rem;
    }
  }

  p {
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 28px;
    font-size: 1rem;
    line-height: 1.6;
  }
`;

const CTAButton = styled(Link)`
  padding: 14px 32px;
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

const About = () => {
  // ============================================
  // EDIT THIS TO ADD YOUR TEAM MEMBERS
  // ============================================
  const team = [
    {
      name: 'Fiazullah Shirzai',
      role: 'Founder & Developer',
      photo: '/team/fiazullah.jpg',
      bio: 'Full-stack developer passionate about building tools that help people grow. Creator of Discipline.',
      email: 'fiazullahshirzai2003@gmail.com',
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
    },
    // Add more members like this:
    // {
    //   name: 'Team Member Name',
    //   role: 'Designer',
    //   photo: '/team/member2.jpg',
    //   bio: 'Short bio about them.',
    //   email: 'their@email.com',
    //   github: 'https://github.com/username',
    //   linkedin: 'https://linkedin.com/in/username',
    // },
  ];

  const values = [
    {
      icon: <FiTarget />,
      color: '#4f46e5',
      title: 'Built for Consistency',
      desc: 'Everything auto-assigns to days so you always know exactly what to do — no decision fatigue.',
    },
    {
      icon: <FiHeart />,
      color: '#ec4899',
      title: 'Whole-Person Focus',
      desc: 'Courses, books, goals, and prayers. Real discipline is about more than just productivity.',
    },
    {
      icon: <FiShield />,
      color: '#10b981',
      title: 'Your Data is Yours',
      desc: 'No ads. No tracking. No selling your info. Just a fast, private space to work on yourself.',
    },
    {
      icon: <FiZap />,
      color: '#f59e0b',
      title: 'Simple, Not Bloated',
      desc: 'No feature overload. Only the essentials, done beautifully, so you actually stick with it.',
    },
  ];

  // Get initials from name for photo fallback
  const getInitials = (name) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  return (
    <Wrapper>
      <Container>
        <HeroSection>
          <Tag>Our Story</Tag>
          <Title>
            About <span>Discipline</span>
          </Title>
          <Lead>
            A personal development platform built for people who want to grow
            every single day — holistically, peacefully, and with intention.
          </Lead>
        </HeroSection>

        <Section>
          <SectionTitle>Why we built this</SectionTitle>
          <Paragraph>
            Most productivity apps focus on one thing: tasks, or habits, or
            notes, or reading. But real growth is holistic — it includes
            learning, reflection, spiritual practice, and physical discipline.
          </Paragraph>
          <Paragraph>
            We built Discipline to bring all of these into one calm, focused
            space. Whether you're studying a course, reading a book, working
            toward a goal, or tracking your five daily prayers — this is your
            home.
          </Paragraph>

          <Card>
            <Quote>
              "The most successful people aren't the ones with the most
              willpower. They're the ones with the best systems."
            </Quote>
            <QuoteAuthor>— Our philosophy</QuoteAuthor>
          </Card>
        </Section>

        <Section>
          <SectionTitle>What makes us different</SectionTitle>
          <Paragraph>
            We're not trying to be everything to everyone. We focus on four
            principles that make the app simple, useful, and sustainable.
          </Paragraph>
          <ValuesGrid>
            {values.map((v, i) => (
              <ValueCard key={i} color={v.color}>
                <div className="icon-wrap">{v.icon}</div>
                <h4>{v.title}</h4>
                <p>{v.desc}</p>
              </ValueCard>
            ))}
          </ValuesGrid>
        </Section>

        {/* ============================================
            TEAM SECTION
            ============================================ */}
        <Section>
          <Tag
            style={{
              textAlign: 'center',
              display: 'block',
              marginBottom: '10px',
            }}
          >
            Our Team
          </Tag>
          <SectionTitle style={{ textAlign: 'center' }}>
            The people behind Discipline
          </SectionTitle>
          <SectionSubtitle
            style={{ textAlign: 'center', margin: '0 auto 40px' }}
          >
            A small team dedicated to helping you build a better, more
            disciplined life.
          </SectionSubtitle>

          <TeamGrid>
            {team.map((member, i) => (
              <TeamCard key={i}>
                <TeamPhoto>
                  {member.photo ? (
                    <img
                      src={member.photo}
                      alt={member.name}
                      onError={(e) => {
                        // Fallback to initials if image fails to load
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = `<div class="fallback">${getInitials(
                          member.name
                        )}</div>`;
                      }}
                    />
                  ) : (
                    <div className="fallback">{getInitials(member.name)}</div>
                  )}
                </TeamPhoto>
                <TeamName>{member.name}</TeamName>
                <TeamRole>{member.role}</TeamRole>
                <TeamBio>{member.bio}</TeamBio>
                <TeamSocials>
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      title="Email"
                      aria-label="Email"
                    >
                      <FiMail />
                    </a>
                  )}
                  {member.github && (
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="GitHub"
                      aria-label="GitHub"
                    >
                      <FiGithub />
                    </a>
                  )}
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="LinkedIn"
                      aria-label="LinkedIn"
                    >
                      <FiLinkedin />
                    </a>
                  )}
                </TeamSocials>
              </TeamCard>
            ))}
          </TeamGrid>
        </Section>

        <Section>
          <SectionTitle>By the numbers</SectionTitle>
          <Paragraph>
            Simple metrics that reflect what matters most to us.
          </Paragraph>
          <MetricsGrid>
            <MetricCard>
              <div className="value">100%</div>
              <div className="label">Free Forever</div>
            </MetricCard>
            <MetricCard>
              <div className="value">6</div>
              <div className="label">Core Features</div>
            </MetricCard>
            <MetricCard>
              <div className="value">5</div>
              <div className="label">Daily Prayers</div>
            </MetricCard>
            <MetricCard>
              <div className="value">0</div>
              <div className="label">Ads & Trackers</div>
            </MetricCard>
          </MetricsGrid>
        </Section>

        <Section>
          <SectionTitle>Our promise to you</SectionTitle>
          <Paragraph>
            We'll keep Discipline fast, private, and focused. Your data is
            yours — always. No ads, no tracking, no noise. Just you, your
            goals, and the tools to reach them.
          </Paragraph>
          <Paragraph>
            If you ever have ideas to make it better, or need help, we're one
            message away. This is built for you, and we want to hear from you.
          </Paragraph>
        </Section>

        <CTASection>
          <CTAInner>
            <h2>Ready to begin?</h2>
            <p>
              Create your free account and start building your discipline
              today — one day at a time.
            </p>
            <CTAButton to="/register">
              Get Started <FiArrowRight />
            </CTAButton>
          </CTAInner>
        </CTASection>
      </Container>
    </Wrapper>
  );
};

export default About;