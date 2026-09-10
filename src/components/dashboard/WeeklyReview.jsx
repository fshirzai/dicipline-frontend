import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../../services/api';
import { format, startOfWeek, addDays, subDays } from 'date-fns';
import { 
  FiTrendingUp, 
  FiCheckCircle, 
  FiXCircle, 
  FiClock,
  FiChevronLeft,
  FiChevronRight,
  FiBook,
  FiBookOpen,
  FiTarget,
  FiCalendar
} from 'react-icons/fi';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';

const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
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
  min-width: 200px;
  text-align: center;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const SummaryCard = styled.div`
  background: ${props => props.theme.surface};
  padding: 20px;
  border-radius: 12px;
  border: 1px solid ${props => props.theme.border};
  text-align: center;

  h3 {
    color: ${props => props.theme.textSecondary};
    font-size: 0.9rem;
    margin-bottom: 8px;
  }

  .value {
    font-size: 2rem;
    font-weight: 700;
    color: ${props => props.theme.text};
  }

  .sub {
    color: ${props => props.theme.textSecondary};
    font-size: 0.8rem;
    margin-top: 4px;
  }
`;

const ChartsContainer = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background: ${props => props.theme.surface};
  padding: 20px;
  border-radius: 12px;
  border: 1px solid ${props => props.theme.border};

  h3 {
    margin-bottom: 15px;
    color: ${props => props.theme.text};
  }
`;

const DayCard = styled.div`
  background: ${props => props.theme.surface};
  padding: 20px;
  border-radius: 12px;
  border: 1px solid ${props => props.theme.border};
  margin-bottom: 15px;

  .day-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid ${props => props.theme.border};

    h4 {
      color: ${props => props.theme.text};
    }

    .completion-badge {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
      background: ${props => {
        const rate = props.completionRate;
        if (rate >= 80) return props.theme.success + '33';
        if (rate >= 50) return props.theme.warning + '33';
        return props.theme.danger + '33';
      }};
      color: ${props => {
        const rate = props.completionRate;
        if (rate >= 80) return props.theme.success;
        if (rate >= 50) return props.theme.warning;
        return props.theme.danger;
      }};
    }
  }

  .day-items {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 10px;
  }
`;

const DayItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: ${props => props.theme.surface2};
  border-radius: 8px;

  .icon {
    color: ${props => props.status === 'complete' ? props.theme.success : 
                   props.status === 'missed' ? props.theme.danger : 
                   props.theme.warning};
  }

  .name {
    flex: 1;
    font-size: 0.9rem;
  }

  .status {
    font-size: 0.75rem;
    padding: 2px 8px;
    border-radius: 12px;
    background: ${props => props.status === 'complete' ? props.theme.success + '33' : 
                     props.status === 'missed' ? props.theme.danger + '33' : 
                     props.theme.warning + '33'};
    color: ${props => props.status === 'complete' ? props.theme.success : 
                     props.status === 'missed' ? props.theme.danger : 
                     props.theme.warning};
  }
`;

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

const WeeklyReview = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [reviewData, setReviewData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeeklyReview();
  }, [currentWeek]);

  const fetchWeeklyReview = async () => {
    try {
      const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
      const response = await api.get(`/reviews/weekly?weekStart=${format(weekStart, 'yyyy-MM-dd')}`);
      setReviewData(response.data.review);
    } catch (error) {
      console.error('Error fetching weekly review:', error);
    } finally {
      setLoading(false);
    }
  };

  const changeWeek = (direction) => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(newWeek.getDate() + (direction * 7));
    setCurrentWeek(newWeek);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!reviewData) {
    return <div>No data available</div>;
  }

  const { summary, dailyData } = reviewData;

  // Prepare chart data
  const dailyChartData = dailyData.map(day => ({
    date: format(new Date(day.date), 'EEE'),
    completed: day.topics.completed + day.sessions.completed + day.tasks.completed,
    total: day.topics.total + day.sessions.total + day.tasks.total,
  }));

  const pieData = [
    { name: 'Completed', value: summary.overall.completed || 0 },
    { name: 'Pending', value: summary.overall.pending || 0 },
    { name: 'Missed', value: summary.overall.missed || 0 },
  ];

  return (
    <Container>
      <Header>
        <h1>📊 Weekly Review</h1>
        <WeekNavigator>
          <NavButton onClick={() => changeWeek(-1)}>
            <FiChevronLeft />
          </NavButton>
          <WeekLabel>
            {format(new Date(reviewData.weekStart), 'MMM d')} - {format(new Date(reviewData.weekEnd), 'MMM d, yyyy')}
          </WeekLabel>
          <NavButton onClick={() => changeWeek(1)}>
            <FiChevronRight />
          </NavButton>
        </WeekNavigator>
      </Header>

      <SummaryGrid>
        <SummaryCard>
          <h3>Overall Completion</h3>
          <div className="value">{summary.overall.completionRate}%</div>
          <div className="sub">{summary.overall.completed} completed of {summary.overall.total} total</div>
        </SummaryCard>
        <SummaryCard>
          <h3>📚 Reading</h3>
          <div className="value">{summary.reading.completionRate}%</div>
          <div className="sub">{summary.reading.completed} of {summary.reading.total} sessions</div>
        </SummaryCard>
        <SummaryCard>
          <h3>🎓 Courses</h3>
          <div className="value">{summary.topics.completionRate}%</div>
          <div className="sub">{summary.topics.completed} of {summary.topics.total} topics</div>
        </SummaryCard>
        <SummaryCard>
          <h3>✅ Tasks</h3>
          <div className="value">{summary.tasks.completionRate}%</div>
          <div className="sub">{summary.tasks.completed} of {summary.tasks.total} tasks</div>
        </SummaryCard>
        <SummaryCard>
          <h3>🕌 Prayers</h3>
          <div className="value">{summary.prayers.completionRate}%</div>
          <div className="sub">{summary.prayers.completed} of {summary.prayers.total} prayers</div>
        </SummaryCard>
      </SummaryGrid>

      <ChartsContainer>
        <ChartCard>
          <h3>Daily Progress</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={dailyChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a3a5a" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  background: '#141b2b', 
                  border: '1px solid #2a3a5a',
                  borderRadius: '8px'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="completed" 
                stackId="1"
                stroke="#4f46e5" 
                fill="#4f46e5" 
                fillOpacity={0.6}
              />
              <Area 
                type="monotone" 
                dataKey="total" 
                stackId="2"
                stroke="#10b981" 
                fill="#10b981" 
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard>
          <h3>Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  background: '#141b2b', 
                  border: '1px solid #2a3a5a',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </ChartsContainer>

      <h2 style={{ marginBottom: '20px' }}>Daily Breakdown</h2>
      {dailyData.map((day, index) => {
        const totalItems = day.topics.total + day.sessions.total + day.tasks.total;
        const completedItems = day.topics.completed + day.sessions.completed + day.tasks.completed;
        const completionRate = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

        return (
          <DayCard key={index} completionRate={completionRate}>
            <div className="day-header">
              <h4>{format(new Date(day.date), 'EEEE, MMMM d, yyyy')}</h4>
              <span className="completion-badge">{completionRate}% Complete</span>
            </div>
            <div className="day-items">
              {day.topics.items.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '5px', color: '#4f46e5' }}>
                    📚 Topics ({day.topics.completed}/{day.topics.total})
                  </div>
                  {day.topics.items.map((topic, idx) => (
                    <DayItem key={idx} status={topic.status}>
                      <span className="icon">
                        {topic.status === 'complete' ? <FiCheckCircle /> :
                         topic.status === 'missed' ? <FiXCircle /> : <FiClock />}
                      </span>
                      <span className="name">{topic.name}</span>
                      <span className="status">{topic.status}</span>
                    </DayItem>
                  ))}
                </div>
              )}
              
              {day.sessions.items.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '5px', color: '#10b981' }}>
                    📖 Reading ({day.sessions.completed}/{day.sessions.total})
                  </div>
                  {day.sessions.items.map((session, idx) => (
                    <DayItem key={idx} status={session.status}>
                      <span className="icon">
                        {session.status === 'complete' ? <FiCheckCircle /> :
                         session.status === 'missed' ? <FiXCircle /> : <FiClock />}
                      </span>
                      <span className="name">Pages {session.pageStart}-{session.pageEnd}</span>
                      <span className="status">{session.status}</span>
                    </DayItem>
                  ))}
                </div>
              )}
              
              {day.tasks.items.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '5px', color: '#f59e0b' }}>
                    ✅ Tasks ({day.tasks.completed}/{day.tasks.total})
                  </div>
                  {day.tasks.items.map((task, idx) => (
                    <DayItem key={idx} status={task.status}>
                      <span className="icon">
                        {task.status === 'complete' ? <FiCheckCircle /> :
                         task.status === 'missed' ? <FiXCircle /> : <FiClock />}
                      </span>
                      <span className="name">{task.name}</span>
                      <span className="status">{task.status}</span>
                    </DayItem>
                  ))}
                </div>
              )}
              
              {day.prayers && (
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '5px', color: '#8b5cf6' }}>
                    🕌 Prayers ({day.prayers.completed}/{day.prayers.total})
                  </div>
                  {day.prayers.items.map((prayer, idx) => (
                    <DayItem key={idx} status={prayer.status}>
                      <span className="icon">
                        {prayer.status === 'complete' ? <FiCheckCircle /> :
                         prayer.status === 'missed' ? <FiXCircle /> : <FiClock />}
                      </span>
                      <span className="name" style={{ textTransform: 'capitalize' }}>{prayer.name}</span>
                      <span className="status">{prayer.status}</span>
                    </DayItem>
                  ))}
                </div>
              )}
            </div>
          </DayCard>
        );
      })}
    </Container>
  );
};

export default WeeklyReview;