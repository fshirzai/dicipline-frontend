import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { format, addDays, startOfWeek } from 'date-fns';
import { FiCheck, FiClock, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Container = styled.div`
  padding: 20px;
  max-width: 1100px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;

  h1 {
    font-size: 2rem;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
  }
`;

const WeekNavigator = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const NavButton = styled.button`
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  color: ${props => props.theme.text};
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.primary};
    color: white;
  }
`;

const WeekLabel = styled.span`
  font-weight: 600;
  min-width: 220px;
  text-align: center;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr repeat(7, 1fr);
  gap: 8px;
  background: ${props => props.theme.surface};
  border-radius: 12px;
  padding: 20px;
  border: 1px solid ${props => props.theme.border};
  overflow-x: auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr repeat(7, 0.8fr);
    padding: 12px;
    gap: 4px;
  }
`;

const GridHeader = styled.div`
  font-weight: 600;
  color: ${props => props.theme.textSecondary};
  padding: 8px;
  text-align: center;
  font-size: 0.85rem;

  .day-name {
    font-weight: 700;
  }

  .day-date {
    font-size: 0.75rem;
    font-weight: normal;
    opacity: 0.7;
  }

  @media (max-width: 768px) {
    font-size: 0.7rem;
    padding: 4px;
  }
`;

const PrayerName = styled.div`
  font-weight: 600;
  color: ${props => props.theme.text};
  padding: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .prayer-label {
    font-size: 0.9rem;
  }

  .prayer-time {
    font-size: 0.7rem;
    color: ${props => props.theme.textSecondary};
    font-weight: normal;
  }

  @media (max-width: 768px) {
    .prayer-label {
      font-size: 0.7rem;
    }
    .prayer-time {
      font-size: 0.6rem;
    }
  }
`;

const PrayerCell = styled.div`
  padding: 8px;
  text-align: center;

  @media (max-width: 768px) {
    padding: 4px;
  }
`;

const PrayerButton = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 2px solid ${props => {
    if (props.status === 'complete') return props.theme.success;
    if (props.status === 'missed') return props.theme.danger;
    return props.theme.border;
  }};
  background: ${props => {
    if (props.status === 'complete') return props.theme.success + '33';
    if (props.status === 'missed') return props.theme.danger + '33';
    return props.theme.surface2;
  }};
  color: ${props => {
    if (props.status === 'complete') return props.theme.success;
    if (props.status === 'missed') return props.theme.danger;
    return props.theme.textSecondary;
  }};
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  margin: 0 auto;

  &:hover {
    transform: scale(1.1);
    box-shadow: ${props => props.theme.shadowHover};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
    transform: none;
  }

  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
    font-size: 0.9rem;
  }
`;

const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin: 4px auto 0;
  background: ${props => {
    if (props.status === 'complete') return props.theme.success;
    if (props.status === 'missed') return props.theme.danger;
    return props.theme.warning;
  }};
`;

const PrayerNameDisplay = styled.span`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  background: ${props => props.theme.primary}22;
  color: ${props => props.theme.primary};
  margin-top: 4px;
`;

const SpecialBadge = styled.span`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.6rem;
  font-weight: 600;
  background: ${props => (props.isFriday ? '#f59e0b33' : '#4f46e533')};
  color: ${props => (props.isFriday ? '#f59e0b' : '#4f46e5')};
  margin-top: 2px;
`;

const Legend = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-top: 20px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 12px;
  }
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: ${props => props.theme.textSecondary};

  .dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: ${props => props.color};
  }

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const StatsSummary = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
`;

const StatCard = styled.div`
  background: ${props => props.theme.surface};
  padding: 15px;
  border-radius: 10px;
  border: 1px solid ${props => props.theme.border};
  text-align: center;

  .value {
    font-size: 1.5rem;
    font-weight: 700;
    color: ${props => props.theme.text};
  }

  .label {
    font-size: 0.8rem;
    color: ${props => props.theme.textSecondary};
    margin-top: 2px;
  }
`;

const PrayerColors = {
  fajer: '#fcd34d',
  duher: '#f59e0b',
  aser: '#f97316',
  maghrib: '#ef4444',
  isha: '#8b5cf6',
};

const PrayerTimes = {
  fajer: 'Dawn',
  duher: 'Midday',
  aser: 'Afternoon',
  maghrib: 'Sunset',
  isha: 'Night',
};

// Islamic week order: Saturday, Sunday, Monday, Tuesday, Wednesday, Thursday, Friday
// JS getDay(): 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
const ISLAMIC_WEEK_ORDER = [6, 0, 1, 2, 3, 4, 5];

const PrayerTracker = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [prayerData, setPrayerData] = useState({});
  const [stats, setStats] = useState({ completed: 0, missed: 0, pending: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  const prayerNames = ['fajer', 'duher', 'aser', 'maghrib', 'isha'];
  const prayerLabels = {
    fajer: 'Fajer',
    duher: 'Duher',
    aser: 'Aser',
    maghrib: 'Maghrib',
    isha: 'Isha',
  };

  // Build a week starting from the most recent Saturday (start of Islamic week)
  // We anchor to Saturday of the current week.
  const getIslamicWeekDays = (referenceDate) => {
    // Find the Saturday of this week (Saturday is start of Islamic week)
    const day = referenceDate.getDay(); // 0=Sun ... 6=Sat
    // How many days back to reach Saturday? If today is Saturday (6), 0. Otherwise (day+1)%7 days back to Saturday
    const daysSinceSaturday = (day + 1) % 7;
    const saturday = new Date(referenceDate);
    saturday.setDate(saturday.getDate() - daysSinceSaturday);
    saturday.setHours(0, 0, 0, 0);
    return Array.from({ length: 7 }, (_, i) => addDays(saturday, i));
  };

  const weekDays = getIslamicWeekDays(currentWeek);

  // Islamic day names (Arabic)
  const islamicDayNames = {
    Monday: 'الاثنين',
    Tuesday: 'الثلاثاء',
    Wednesday: 'الأربعاء',
    Thursday: 'الخميس',
    Friday: 'الجمعة',
    Saturday: 'السبت',
    Sunday: 'الأحد',
  };

  useEffect(() => {
    fetchWeekPrayers();
  }, [currentWeek]);

  const fetchWeekPrayers = async () => {
    try {
      const startDate = format(weekDays[0], 'yyyy-MM-dd');
      const endDate = format(weekDays[6], 'yyyy-MM-dd');

      const response = await api.get(
        `/prayers/range?startDate=${startDate}&endDate=${endDate}`
      );

      const data = {};
      let completed = 0;
      let missed = 0;
      let pending = 0;
      let total = 0;

      // Initialize all days with empty prayers
      weekDays.forEach((day) => {
        const dateKey = format(day, 'yyyy-MM-dd');
        data[dateKey] = null;
      });

      // Fill in prayer data
      response.data.prayers.forEach((prayer) => {
        const dateKey = format(new Date(prayer.date), 'yyyy-MM-dd');
        data[dateKey] = prayer.prayers;

        prayer.prayers.forEach((p) => {
          total++;
          if (p.status === 'complete') completed++;
          else if (p.status === 'missed') missed++;
          else pending++;
        });
      });

      setPrayerData(data);
      setStats({ completed, missed, pending, total });
    } catch (error) {
      console.error('Error fetching prayers:', error);
      toast.error('Failed to load prayers');
    } finally {
      setLoading(false);
    }
  };

  const handlePrayerToggle = async (date, prayerName, currentStatus) => {
    const newStatus = currentStatus === 'complete' ? 'pending' : 'complete';

    try {
      await api.put('/prayers/complete', {
        date: date,
        prayerName: prayerName,
      });

      // Update local state
      const dateKey = format(new Date(date), 'yyyy-MM-dd');
      setPrayerData((prev) => {
        const updated = { ...prev };
        if (!updated[dateKey]) {
          updated[dateKey] = prayerNames.map((name) => ({
            name: name,
            status: name === prayerName ? newStatus : 'pending',
          }));
        } else {
          updated[dateKey] = updated[dateKey].map((prayer) =>
            prayer.name === prayerName ? { ...prayer, status: newStatus } : prayer
          );
        }
        return updated;
      });

      // Update stats
      setStats((prev) => {
        const newStats = { ...prev };
        if (newStatus === 'complete') {
          newStats.completed++;
          newStats.pending--;
        } else {
          newStats.completed--;
          newStats.pending++;
        }
        return newStats;
      });

      toast.success(
        `${prayerLabels[prayerName]} ${
          newStatus === 'complete' ? 'completed! 🙏' : 'marked as pending'
        }`
      );
    } catch (error) {
      toast.error('Failed to update prayer');
    }
  };

  const getPrayerStatus = (date, prayerName) => {
    const dateKey = format(new Date(date), 'yyyy-MM-dd');
    const prayers = prayerData[dateKey];
    if (!prayers) return 'pending';
    const prayer = prayers.find((p) => p.name === prayerName);
    return prayer ? prayer.status : 'pending';
  };

  const getStatusIcon = (status) => {
    if (status === 'complete') return <FiCheck />;
    if (status === 'missed') return <FiX />;
    return <FiClock />;
  };

  const changeWeek = (direction) => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(newWeek.getDate() + direction * 7);
    setCurrentWeek(newWeek);
  };

  const goToToday = () => {
    setCurrentWeek(new Date());
  };

  const isToday = (date) => {
    return format(new Date(), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
  };

  const isFriday = (date) => {
    return date.getDay() === 5;
  };

  const getCompletionRate = () => {
    if (stats.total === 0) return 0;
    return Math.round((stats.completed / stats.total) * 100);
  };

  const getDayName = (date) => {
    const dayNames = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    return dayNames[date.getDay()];
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Header>
        <h1>🕌 Prayer Tracker</h1>
        <WeekNavigator>
          <NavButton onClick={() => changeWeek(-1)}>
            <FiChevronLeft />
          </NavButton>
          <WeekLabel>
            {format(weekDays[0], 'MMM d')} - {format(weekDays[6], 'MMM d, yyyy')}
          </WeekLabel>
          <NavButton onClick={() => changeWeek(1)}>
            <FiChevronRight />
          </NavButton>
          <NavButton onClick={goToToday} style={{ background: '#4f46e5', color: 'white' }}>
            Today
          </NavButton>
        </WeekNavigator>
      </Header>

      <StatsSummary>
        <StatCard>
          <div className="value">{getCompletionRate()}%</div>
          <div className="label">Completion Rate</div>
        </StatCard>
        <StatCard>
          <div className="value" style={{ color: '#10b981' }}>
            {stats.completed}
          </div>
          <div className="label">✅ Completed</div>
        </StatCard>
        <StatCard>
          <div className="value" style={{ color: '#f59e0b' }}>
            {stats.pending}
          </div>
          <div className="label">⏳ Pending</div>
        </StatCard>
        <StatCard>
          <div className="value" style={{ color: '#ef4444' }}>
            {stats.missed}
          </div>
          <div className="label">❌ Missed</div>
        </StatCard>
      </StatsSummary>

      <Grid>
        <GridHeader>Prayer</GridHeader>
        {weekDays.map((day, index) => {
          const isFridayDay = isFriday(day);
          const isTodayDay = isToday(day);
          const dayName = getDayName(day);
          const arabicName = islamicDayNames[dayName] || dayName;

          return (
            <GridHeader
              key={index}
              style={{
                background: isTodayDay
                  ? '#4f46e533'
                  : isFridayDay
                  ? '#f59e0b22'
                  : 'transparent',
                borderRadius: '8px',
                padding: '8px',
                position: 'relative',
                border: isFridayDay ? '1px solid #f59e0b44' : 'none',
              }}
            >
              <div
                className="day-name"
                style={{
                  color: isFridayDay ? '#f59e0b' : isTodayDay ? '#4f46e5' : 'inherit',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <span>{dayName}</span>
                <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>{arabicName}</span>
              </div>
              <div className="day-date">{format(day, 'MMM d')}</div>
              {isFridayDay && <SpecialBadge isFriday={true}>🕌 Jummah</SpecialBadge>}
              {isTodayDay && !isFridayDay && (
                <SpecialBadge isFriday={false}>Today</SpecialBadge>
              )}
            </GridHeader>
          );
        })}

        {prayerNames.map((prayerName) => (
          <React.Fragment key={prayerName}>
            <PrayerName>
              <span className="prayer-label">{prayerLabels[prayerName]}</span>
              <span className="prayer-time">{PrayerTimes[prayerName]}</span>
              <PrayerNameDisplay
                style={{
                  background: PrayerColors[prayerName] + '33',
                  color: PrayerColors[prayerName],
                }}
              >
                {prayerName}
              </PrayerNameDisplay>
            </PrayerName>
            {weekDays.map((day, index) => {
              const status = getPrayerStatus(day, prayerName);
              const dateStr = format(day, 'yyyy-MM-dd');
              const isTodayDay = isToday(day);
              const isFridayDay = isFriday(day);

              return (
                <PrayerCell key={index}>
                  <PrayerButton
                    status={status}
                    onClick={() => handlePrayerToggle(dateStr, prayerName, status)}
                    disabled={status === 'missed'}
                    style={{
                      borderColor:
                        status === 'complete'
                          ? '#10b981'
                          : status === 'missed'
                          ? '#ef4444'
                          : isTodayDay
                          ? PrayerColors[prayerName]
                          : isFridayDay
                          ? '#f59e0b'
                          : '#2a3a5a',
                      background:
                        status === 'complete'
                          ? '#10b98133'
                          : status === 'missed'
                          ? '#ef444433'
                          : isTodayDay
                          ? PrayerColors[prayerName] + '22'
                          : isFridayDay
                          ? '#f59e0b22'
                          : 'transparent',
                    }}
                  >
                    {getStatusIcon(status)}
                  </PrayerButton>
                  <StatusDot status={status} />
                </PrayerCell>
              );
            })}
          </React.Fragment>
        ))}
      </Grid>

      <Legend>
        <LegendItem color="#10b981">
          <span className="dot" /> Complete
        </LegendItem>
        <LegendItem color="#f59e0b">
          <span className="dot" /> Pending
        </LegendItem>
        <LegendItem color="#ef4444">
          <span className="dot" /> Missed
        </LegendItem>
        <LegendItem color="#4f46e5">
          <span
            className="dot"
            style={{ border: '2px solid #4f46e5', background: 'transparent' }}
          />{' '}
          Today
        </LegendItem>
        <LegendItem color="#f59e0b">
          <span
            className="dot"
            style={{ border: '2px solid #f59e0b', background: 'transparent' }}
          />{' '}
          🕌 Jummah (Friday)
        </LegendItem>
      </Legend>
    </Container>
  );
};

export default PrayerTracker;