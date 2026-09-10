import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import api from '../../services/api';
import { format, parseISO, addDays, subDays, isToday } from 'date-fns';
import toast from 'react-hot-toast';
import { 
  FiChevronLeft, 
  FiChevronRight, 
  FiCheckCircle, 
  FiXCircle, 
  FiClock,
  FiBook,
  FiBookOpen,
  FiTarget,
  FiCalendar,
  FiMoon
} from 'react-icons/fi';

const Container = styled.div`
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 15px;

  h1 {
    font-size: 2rem;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const DateNavigator = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    justify-content: center;
  }
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

const DateLabel = styled.span`
  font-weight: 600;
  min-width: 200px;
  text-align: center;
`;

const TodayButton = styled.button`
  background: ${props => props.theme.primary};
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.primaryDark};
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadowHover};
  }
`;

const Section = styled.div`
  background: ${props => props.theme.surface};
  border-radius: 12px;
  border: 1px solid ${props => props.theme.border};
  padding: 20px;
  margin-bottom: 20px;
`;

const SectionTitle = styled.h3`
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: ${props => props.theme.text};

  .count {
    font-size: 0.85rem;
    font-weight: normal;
    color: ${props => props.theme.textSecondary};
  }
`;

const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: ${props => props.theme.surface2};
  border-radius: 8px;
  border-left: 4px solid ${props => {
    if (props.status === 'complete') return props.theme.success;
    if (props.status === 'missed') return props.theme.danger;
    return props.theme.warning;
  }};
  transition: all 0.2s;
  flex-wrap: wrap;
  gap: 10px;

  &:hover {
    transform: translateX(4px);
  }

  .left {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
    min-width: 150px;
  }

  .right {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }
`;

const StatusBadge = styled.span`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${props => {
    if (props.status === 'complete') return props.theme.success + '33';
    if (props.status === 'missed') return props.theme.danger + '33';
    return props.theme.warning + '33';
  }};
  color: ${props => {
    if (props.status === 'complete') return props.theme.success;
    if (props.status === 'missed') return props.theme.danger;
    return props.theme.warning;
  }};
`;

const StatusButton = styled.button`
  background: transparent;
  border: 2px solid ${props => {
    if (props.status === 'complete') return props.theme.success;
    if (props.status === 'missed') return props.theme.danger;
    return props.theme.border;
  }};
  color: ${props => {
    if (props.status === 'complete') return props.theme.success;
    if (props.status === 'missed') return props.theme.danger;
    return props.theme.textSecondary;
  }};
  padding: 4px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.primary};
    color: white;
    border-color: ${props => props.theme.primary};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const PrayerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 10px;
`;

const PrayerCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  background: ${props => props.theme.surface2};
  border-radius: 8px;
  border: 2px solid ${props => {
    if (props.status === 'complete') return props.theme.success;
    if (props.status === 'missed') return props.theme.danger;
    return props.theme.border;
  }};

  .prayer-name {
    font-weight: 600;
    margin-bottom: 5px;
    text-transform: capitalize;
  }

  .prayer-status {
    font-size: 0.8rem;
    color: ${props => props.theme.textSecondary};
    margin-bottom: 10px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: ${props => props.theme.textSecondary};

  svg {
    font-size: 3rem;
    margin-bottom: 10px;
    opacity: 0.5;
  }

  h4 {
    color: ${props => props.theme.text};
    margin-bottom: 5px;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  color: ${props => props.theme.textSecondary};
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: ${props => props.theme.danger};

  h4 {
    margin-bottom: 10px;
  }

  button {
    margin-top: 15px;
    padding: 10px 20px;
    background: ${props => props.theme.primary};
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;

    &:hover {
      background: ${props => props.theme.primaryDark};
    }
  }
`;

const DailyView = () => {
  const { date } = useParams();
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(date ? parseISO(date) : new Date());
  const [dailyData, setDailyData] = useState(null);
  const [prayerData, setPrayerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchDailyData();
  }, [currentDate]);

  const fetchDailyData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      
      // Fetch daily tasks
      const dailyResponse = await api.get(`/reviews/daily/${dateStr}`);
      setDailyData(dailyResponse.data.dailyView);

      // Fetch prayers - handle 404 gracefully
      try {
        const prayerResponse = await api.get(`/prayers/date/${dateStr}`);
        setPrayerData(prayerResponse.data.prayer);
      } catch (prayerErr) {
        if (prayerErr.response?.status === 404) {
          // No prayers for this date yet, that's fine
          setPrayerData(null);
        } else {
          console.error('Error fetching prayers:', prayerErr);
        }
      }
    } catch (error) {
      console.error('Error fetching daily data:', error);
      setError('Failed to load daily data. Please try again.');
      toast.error('Failed to load daily data');
    } finally {
      setLoading(false);
    }
  };

  const changeDate = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + direction);
    setCurrentDate(newDate);
    navigate(`/daily/${format(newDate, 'yyyy-MM-dd')}`);
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    navigate(`/daily/${format(today, 'yyyy-MM-dd')}`);
  };

  const updateItemStatus = async (type, id, currentStatus) => {
    if (updating) return;
    setUpdating(true);

    const newStatus = currentStatus === 'complete' ? 'pending' : 'complete';
    
    try {
      let endpoint;
      if (type === 'topic') {
        endpoint = `/courses/topics/${id}`;
      } else if (type === 'session') {
        endpoint = `/books/reading-sessions/${id}`;
      } else if (type === 'task') {
        endpoint = `/goals/tasks/${id}`;
      } else {
        setUpdating(false);
        return;
      }
      
      await api.put(endpoint, { status: newStatus });
      toast.success(`Updated to ${newStatus}`);
      await fetchDailyData(); // Refresh data
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const updatePrayerStatus = async (prayerName, currentStatus) => {
    if (updating) return;
    setUpdating(true);

    const newStatus = currentStatus === 'complete' ? 'pending' : 'complete';
    
    try {
      await api.put('/prayers/complete', {
        date: format(currentDate, 'yyyy-MM-dd'),
        prayerName: prayerName,
      });
      toast.success(`${prayerName} ${newStatus === 'complete' ? 'completed' : 'marked as pending'}`);
      await fetchDailyData();
    } catch (error) {
      console.error('Error updating prayer:', error);
      toast.error('Failed to update prayer');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <LoadingSpinner>Loading your daily tasks...</LoadingSpinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorMessage>
          <h4>⚠️ {error}</h4>
          <button onClick={() => fetchDailyData()}>Try Again</button>
        </ErrorMessage>
      </Container>
    );
  }

  const dateStr = format(currentDate, 'EEEE, MMMM d, yyyy');
  const isTodayDate = isToday(currentDate);

  // Check if there's any content
  const hasContent = dailyData && dailyData.areas && dailyData.areas.some(area => 
    (area.topics && area.topics.length > 0) || 
    (area.sessions && area.sessions.length > 0) || 
    (area.tasks && area.tasks.length > 0)
  );

  return (
    <Container>
      <Header>
        <h1>📅 Daily View</h1>
        <DateNavigator>
          <NavButton onClick={() => changeDate(-1)}>
            <FiChevronLeft />
          </NavButton>
          <DateLabel>{dateStr}</DateLabel>
          <NavButton onClick={() => changeDate(1)}>
            <FiChevronRight />
          </NavButton>
          {!isTodayDate && (
            <TodayButton onClick={goToToday}>Today</TodayButton>
          )}
        </DateNavigator>
      </Header>

      {/* Prayers Section */}
      {prayerData && prayerData.prayers && prayerData.prayers.length > 0 && (
        <Section>
          <SectionTitle>
            🕌 Prayers
            <span className="count">
              ({prayerData.prayers.filter(p => p.status === 'complete').length}/{prayerData.prayers.length})
            </span>
          </SectionTitle>
          <PrayerGrid>
            {prayerData.prayers.map((prayer, idx) => (
              <PrayerCard key={idx} status={prayer.status}>
                <div className="prayer-name">{prayer.name}</div>
                <div className="prayer-status">
                  {prayer.status === 'complete' ? '✅ Completed' :
                   prayer.status === 'missed' ? '❌ Missed' : '⏳ Pending'}
                </div>
                <StatusButton
                  status={prayer.status}
                  onClick={() => updatePrayerStatus(prayer.name, prayer.status)}
                  disabled={prayer.status === 'missed' || updating}
                  style={{ width: '100%' }}
                >
                  {prayer.status === 'complete' ? 'Undo' : 'Complete'}
                </StatusButton>
              </PrayerCard>
            ))}
          </PrayerGrid>
        </Section>
      )}

      {/* Areas Section */}
      {!hasContent && !prayerData ? (
        <EmptyState>
          <FiCalendar />
          <h4>No tasks for this day</h4>
          <p>Enjoy a break or plan some activities!</p>
        </EmptyState>
      ) : (
        dailyData && dailyData.areas && dailyData.areas.map((area, areaIndex) => {
          const hasContent = (area.topics && area.topics.length > 0) || 
                            (area.sessions && area.sessions.length > 0) || 
                            (area.tasks && area.tasks.length > 0);
          if (!hasContent) return null;

          return (
            <Section key={areaIndex}>
              <SectionTitle>
                {area.areaTitle}
                <span className="count">
                  ({ (area.topics?.length || 0) + (area.sessions?.length || 0) + (area.tasks?.length || 0) } items)
                </span>
              </SectionTitle>

              <ItemList>
                {/* Topics */}
                {area.topics && area.topics.map((topic, idx) => (
                  <Item key={`topic-${idx}`} status={topic.status}>
                    <div className="left">
                      <FiBookOpen />
                      <span>{topic.name}</span>
                      <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Course</span>
                    </div>
                    <div className="right">
                      <StatusBadge status={topic.status}>{topic.status}</StatusBadge>
                      <StatusButton 
                        status={topic.status}
                        onClick={() => updateItemStatus('topic', topic._id, topic.status)}
                        disabled={topic.status === 'missed' || updating}
                      >
                        {topic.status === 'complete' ? 'Undo' : 'Complete'}
                      </StatusButton>
                    </div>
                  </Item>
                ))}

                {/* Reading Sessions */}
                {area.sessions && area.sessions.map((session, idx) => (
                  <Item key={`session-${idx}`} status={session.status}>
                    <div className="left">
                      <FiBook />
                      <span>Pages {session.pageStart}-{session.pageEnd}</span>
                      <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Reading</span>
                    </div>
                    <div className="right">
                      <StatusBadge status={session.status}>{session.status}</StatusBadge>
                      <StatusButton 
                        status={session.status}
                        onClick={() => updateItemStatus('session', session._id, session.status)}
                        disabled={session.status === 'missed' || updating}
                      >
                        {session.status === 'complete' ? 'Undo' : 'Complete'}
                      </StatusButton>
                    </div>
                  </Item>
                ))}

                {/* Tasks */}
                {area.tasks && area.tasks.map((task, idx) => (
                  <Item key={`task-${idx}`} status={task.status}>
                    <div className="left">
                      <FiTarget />
                      <span>{task.name}</span>
                      <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Task</span>
                    </div>
                    <div className="right">
                      <StatusBadge status={task.status}>{task.status}</StatusBadge>
                      <StatusButton 
                        status={task.status}
                        onClick={() => updateItemStatus('task', task._id, task.status)}
                        disabled={task.status === 'missed' || updating}
                      >
                        {task.status === 'complete' ? 'Undo' : 'Complete'}
                      </StatusButton>
                    </div>
                  </Item>
                ))}
              </ItemList>
            </Section>
          );
        })
      )}
    </Container>
  );
};

export default DailyView;