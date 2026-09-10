import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  FiBook, 
  FiBookOpen, 
  FiTarget, 
  FiCalendar, 
  FiTrendingUp,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiChevronRight,
  FiCheck,
  FiMoon
} from 'react-icons/fi';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import { format, startOfWeek, addDays } from 'date-fns';

const Container = styled.div`
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 30px;

  h1 {
    font-size: 2rem;
    margin-bottom: 5px;
  }

  p {
    color: ${props => props.theme.textSecondary};
  }
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background: ${props => props.theme.surface};
  padding: 18px;
  border-radius: 12px;
  border: 1px solid ${props => props.theme.border};
  box-shadow: ${props => props.theme.shadow};
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadowHover};
  }
`;

const StatIcon = styled.div`
  color: ${props => props.color || props.theme.primary};
  font-size: 1.3rem;
  margin-bottom: 6px;
`;

const StatValue = styled.div`
  font-size: 1.6rem;
  font-weight: 700;
  color: ${props => props.theme.text};
`;

const StatLabel = styled.div`
  color: ${props => props.theme.textSecondary};
  font-size: 0.85rem;
  margin-top: 2px;
`;

const Section = styled.div`
  background: ${props => props.theme.surface};
  border-radius: 12px;
  border: 1px solid ${props => props.theme.border};
  padding: 20px;
  margin-bottom: 20px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;

  h3 {
    font-size: 1.05rem;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .view-all {
    color: ${props => props.theme.primary};
    text-decoration: none;
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    gap: 4px;

    &:hover {
      text-decoration: underline;
    }
  }

  .task-count {
    font-size: 0.75rem;
    font-weight: normal;
    color: ${props => props.theme.textSecondary};
  }
`;

const TaskList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 600px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme.surface2};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.primary};
    border-radius: 3px;
  }
`;

const TaskItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: ${props => props.theme.surface2};
  border-radius: 8px;
  border-left: 4px solid ${props => {
    if (props.status === 'complete') return props.theme.success;
    if (props.status === 'missed') return props.theme.danger;
    return props.theme.warning;
  }};
  transition: all 0.2s;

  &:hover {
    transform: translateX(4px);
  }

  .task-info {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
  }

  .task-icon {
    font-size: 1.1rem;
    flex-shrink: 0;
    color: ${props => {
      if (props.type === 'topic') return '#4f46e5';
      if (props.type === 'session') return '#10b981';
      if (props.type === 'task') return '#f59e0b';
      if (props.type === 'prayer') return '#8b5cf6';
      return '#6b7280';
    }};
  }

  .task-details {
    flex: 1;
    min-width: 0;

    .task-title {
      font-weight: 500;
      font-size: 0.9rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .task-meta {
      font-size: 0.75rem;
      color: ${props => props.theme.textSecondary};
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;

      .task-type {
        padding: 1px 8px;
        border-radius: 12px;
        background: ${props => props.theme.primary}22;
        color: ${props => props.theme.primary};
        font-size: 0.65rem;
      }
    }
  }

  .task-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
    margin-left: 8px;
  }
`;

const StatusBadge = styled.span`
  padding: 2px 10px;
  border-radius: 20px;
  font-size: 0.65rem;
  font-weight: 600;
  white-space: nowrap;
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

const CompleteButton = styled.button`
  padding: 3px 10px;
  border: 2px solid ${props => {
    if (props.status === 'complete') return props.theme.success;
    return props.theme.border;
  }};
  background: ${props => {
    if (props.status === 'complete') return props.theme.success + '33';
    return 'transparent';
  }};
  color: ${props => {
    if (props.status === 'complete') return props.theme.success;
    return props.theme.textSecondary;
  }};
  border-radius: 6px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-weight: 600;
  font-size: 0.7rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 3px;
  white-space: nowrap;
  opacity: ${props => props.disabled ? 0.5 : 1};

  &:hover {
    background: ${props => {
      if (props.disabled) return 'transparent';
      if (props.status === 'complete') return props.theme.success;
      return props.theme.primary;
    }};
    color: ${props => {
      if (props.disabled) return props.theme.textSecondary;
      return 'white';
    }};
    border-color: ${props => {
      if (props.disabled) return props.theme.border;
      if (props.status === 'complete') return props.theme.success;
      return props.theme.primary;
    }};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 30px 20px;
  color: ${props => props.theme.textSecondary};

  svg {
    font-size: 2.5rem;
    margin-bottom: 8px;
    opacity: 0.5;
  }

  p {
    font-size: 0.9rem;
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
  box-shadow: ${props => props.theme.shadow};

  h3 {
    margin-bottom: 15px;
    color: ${props => props.theme.text};
    font-size: 1rem;
  }
`;

const QuickActions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 10px;
  margin-top: 12px;
`;

const ActionCard = styled(Link)`
  background: ${props => props.theme.surface2};
  padding: 14px;
  border-radius: 10px;
  border: 1px solid ${props => props.theme.border};
  text-decoration: none;
  color: ${props => props.theme.text};
  transition: all 0.3s;
  text-align: center;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadowHover};
    border-color: ${props => props.theme.primary};
  }

  svg {
    font-size: 1.3rem;
    color: ${props => props.theme.primary};
    margin-bottom: 4px;
  }

  h4 {
    font-size: 0.85rem;
    margin-bottom: 2px;
  }

  p {
    color: ${props => props.theme.textSecondary};
    font-size: 0.7rem;
  }
`;

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

const PrayerColors = {
  fajer: '#fcd34d',
  duher: '#f59e0b',
  aser: '#f97316',
  maghrib: '#ef4444',
  isha: '#8b5cf6',
};

const PrayerLabels = {
  fajer: 'Fajer',
  duher: 'Duher',
  aser: 'Aser',
  maghrib: 'Maghrib',
  isha: 'Isha',
};

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [dailyTasks, setDailyTasks] = useState([]);
  const [dailyProgress, setDailyProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const today = new Date();
      const todayStr = format(today, 'yyyy-MM-dd');
      
      // Fetch weekly review for stats
      const statsRes = await api.get('/reviews/weekly');
      const weeklyData = statsRes.data.review;

      // Fetch daily tasks
      const dailyRes = await api.get(`/reviews/daily/${todayStr}`);
      const dailyData = dailyRes.data.dailyView;

      // Fetch prayers for today
      const prayerRes = await api.get(`/prayers/date/${todayStr}`);
      
      // Process daily tasks
      const tasks = [];
      
      // Add topics
      if (dailyData && dailyData.areas) {
        dailyData.areas.forEach(area => {
          area.topics.forEach(topic => {
            tasks.push({
              id: topic._id,
              title: topic.name,
              type: 'topic',
              status: topic.status,
              areaTitle: area.areaTitle,
              date: topic.dateToStudy,
              typeLabel: 'Course Topic',
              icon: <FiBookOpen />
            });
          });

          // Add reading sessions
          area.sessions.forEach(session => {
            tasks.push({
              id: session._id,
              title: `Pages ${session.pageStart}-${session.pageEnd}`,
              type: 'session',
              status: session.status,
              areaTitle: area.areaTitle,
              date: session.date,
              typeLabel: 'Reading Session',
              icon: <FiBook />
            });
          });

          // Add tasks
          area.tasks.forEach(task => {
            tasks.push({
              id: task._id,
              title: task.name,
              type: 'task',
              status: task.status,
              areaTitle: area.areaTitle,
              date: task.dateToDo,
              typeLabel: 'Goal Task',
              icon: <FiTarget />
            });
          });
        });
      }

      // Add prayers
      if (prayerRes.data && prayerRes.data.prayer) {
        const prayers = prayerRes.data.prayer.prayers;
        prayers.forEach(prayer => {
          tasks.push({
            id: `${prayer.name}-${todayStr}`,
            title: `${PrayerLabels[prayer.name]} Prayer`,
            type: 'prayer',
            status: prayer.status,
            areaTitle: '🕌 Daily Prayers',
            date: today,
            typeLabel: 'Prayer',
            icon: <FiMoon />,
            prayerName: prayer.name,
            isPrayer: true
          });
        });
      }

      // Sort tasks: pending first, then complete, then missed
      const sortedTasks = tasks.sort((a, b) => {
        const statusOrder = { pending: 0, complete: 1, missed: 2 };
        return statusOrder[a.status] - statusOrder[b.status];
      });

      setDailyTasks(sortedTasks);

      // Prepare chart data
      const progressData = weeklyData.dailyData.map(day => ({
        date: format(new Date(day.date), 'EEE'),
        completed: day.topics.completed + day.sessions.completed + day.tasks.completed,
        total: day.topics.total + day.sessions.total + day.tasks.total,
      }));

      setDailyProgress(progressData);

      // Set stats
      setStats({
        totalAreas: weeklyData.areas?.length || 0,
        weeklyCompletion: weeklyData.summary.overall.completionRate,
        totalCompleted: weeklyData.summary.overall.completed,
        totalMissed: weeklyData.summary.overall.missed,
        totalPending: weeklyData.summary.overall.pending,
        topicsProgress: weeklyData.summary.topics.completionRate,
        readingProgress: weeklyData.summary.reading.completionRate,
        tasksProgress: weeklyData.summary.tasks.completionRate,
        prayersProgress: weeklyData.summary.prayers.completionRate,
      });
    } catch (error) {
      // If no prayer found for today, that's okay - just skip prayers
      if (error.response?.status !== 404) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId, type, currentStatus, isPrayer, prayerName) => {
    if (updating) return;
    setUpdating(true);

    const newStatus = currentStatus === 'complete' ? 'pending' : 'complete';
    
    try {
      if (isPrayer) {
        // Handle prayer update
        const today = format(new Date(), 'yyyy-MM-dd');
        await api.put('/prayers/complete', {
          date: today,
          prayerName: prayerName,
        });
      } else {
        // Handle regular task update
        let endpoint;
        if (type === 'topic') {
          endpoint = `/courses/topics/${taskId}`;
        } else if (type === 'session') {
          endpoint = `/books/reading-sessions/${taskId}`;
        } else if (type === 'task') {
          endpoint = `/goals/tasks/${taskId}`;
        }
        await api.put(endpoint, { status: newStatus });
      }
      
      // Update local state
      setDailyTasks(prev => 
        prev.map(task => 
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );

      // Refresh stats
      try {
        const statsRes = await api.get('/reviews/weekly');
        const weeklyData = statsRes.data.review;
        setStats(prev => ({
          ...prev,
          weeklyCompletion: weeklyData.summary.overall.completionRate,
          totalCompleted: weeklyData.summary.overall.completed,
          totalMissed: weeklyData.summary.overall.missed,
          totalPending: weeklyData.summary.overall.pending,
        }));
      } catch (e) {
        // Ignore stats refresh errors
      }

      toast.success(`${isPrayer ? 'Prayer' : 'Task'} ${newStatus === 'complete' ? 'completed! ✅' : 'marked as pending'}`);
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusText = (status) => {
    if (status === 'complete') return '✅ Complete';
    if (status === 'missed') return '❌ Missed';
    return '⏳ Pending';
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const pieData = stats ? [
    { name: 'Completed', value: stats.totalCompleted || 0 },
    { name: 'Pending', value: stats.totalPending || 0 },
    { name: 'Missed', value: stats.totalMissed || 0 },
  ] : [];

  const completedCount = dailyTasks.filter(t => t.status === 'complete').length;
  const totalCount = dailyTasks.length;

  return (
    <Container>
      <Header>
        <h1>Welcome back, {user?.username}! 👋</h1>
        <p>Here's your progress overview and today's tasks</p>
      </Header>

      <StatsGrid>
        <StatCard>
          <StatIcon><FiBook /></StatIcon>
          <StatValue>{stats?.totalAreas || 0}</StatValue>
          <StatLabel>Active Areas</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon color="#4f46e5"><FiTrendingUp /></StatIcon>
          <StatValue>{stats?.weeklyCompletion || 0}%</StatValue>
          <StatLabel>Weekly Completion</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon color="#10b981"><FiCheckCircle /></StatIcon>
          <StatValue>{stats?.totalCompleted || 0}</StatValue>
          <StatLabel>Tasks Completed</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon color="#f59e0b"><FiClock /></StatIcon>
          <StatValue>{stats?.totalPending || 0}</StatValue>
          <StatLabel>Pending Tasks</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon color="#ef4444"><FiXCircle /></StatIcon>
          <StatValue>{stats?.totalMissed || 0}</StatValue>
          <StatLabel>Missed Tasks</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon color="#8b5cf6"><FiMoon /></StatIcon>
          <StatValue>{completedCount}/{totalCount}</StatValue>
          <StatLabel>Today's Progress</StatLabel>
        </StatCard>
      </StatsGrid>

      <MainGrid>
        {/* Left Column - Daily Tasks */}
        <div>
          <Section>
            <SectionHeader>
              <h3>
                <FiCalendar /> Today's Tasks
                <span className="task-count">
                  ({completedCount}/{totalCount} completed)
                </span>
              </h3>
              <Link to="/daily" className="view-all">
                View All <FiChevronRight size={14} />
              </Link>
            </SectionHeader>

            {dailyTasks.length === 0 ? (
              <EmptyState>
                <FiCheckCircle />
                <p>No tasks for today! 🎉</p>
                <p style={{ fontSize: '0.8rem' }}>Enjoy your day or plan something new</p>
              </EmptyState>
            ) : (
              <TaskList>
                {dailyTasks.map((task) => (
                  <TaskItem key={task.id} status={task.status} type={task.type}>
                    <div className="task-info">
                      <span className="task-icon">{task.icon || task.type === 'prayer' ? <FiMoon /> : <FiBookOpen />}</span>
                      <div className="task-details">
                        <div className="task-title">{task.title}</div>
                        <div className="task-meta">
                          <span className="task-type">{task.typeLabel}</span>
                          {task.areaTitle && (
                            <>
                              <span>•</span>
                              <span>{task.areaTitle}</span>
                            </>
                          )}
                          {task.prayerName && (
                            <span style={{ 
                              display: 'inline-block',
                              width: '10px',
                              height: '10px',
                              borderRadius: '50%',
                              background: PrayerColors[task.prayerName],
                              marginLeft: '4px'
                            }} />
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="task-actions">
                      <StatusBadge status={task.status}>
                        {getStatusText(task.status)}
                      </StatusBadge>
                      <CompleteButton
                        status={task.status}
                        disabled={task.status === 'missed' || updating}
                        onClick={() => updateTaskStatus(
                          task.id, 
                          task.type, 
                          task.status, 
                          task.isPrayer || false,
                          task.prayerName
                        )}
                      >
                        {task.status === 'complete' ? (
                          <><FiCheck size={12} /> Undo</>
                        ) : (
                          <><FiCheck size={12} /> Complete</>
                        )}
                      </CompleteButton>
                    </div>
                  </TaskItem>
                ))}
              </TaskList>
            )}
          </Section>
        </div>

        {/* Right Column - Quick Actions & Stats */}
        <div>
          <Section>
            <SectionHeader>
              <h3>⚡ Quick Actions</h3>
            </SectionHeader>
            <QuickActions>
              <ActionCard to="/areas/create">
                <FiBookOpen />
                <h4>New Area</h4>
                <p>Create a new area</p>
              </ActionCard>
              <ActionCard to="/prayers">
                <FiMoon />
                <h4>Track Prayers</h4>
                <p>Log daily prayers</p>
              </ActionCard>
              <ActionCard to="/weekly">
                <FiTrendingUp />
                <h4>Weekly Review</h4>
                <p>View progress</p>
              </ActionCard>
              <ActionCard to="/daily">
                <FiTarget />
                <h4>Today's Tasks</h4>
                <p>Complete tasks</p>
              </ActionCard>
            </QuickActions>
          </Section>

          <Section>
            <SectionHeader>
              <h3>📊 Quick Stats</h3>
            </SectionHeader>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ 
                background: '#4f46e511', 
                padding: '12px', 
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#4f46e5' }}>
                  {stats?.topicsProgress || 0}%
                </div>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>📚 Topics</div>
              </div>
              <div style={{ 
                background: '#10b98111', 
                padding: '12px', 
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#10b981' }}>
                  {stats?.readingProgress || 0}%
                </div>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>📖 Reading</div>
              </div>
              <div style={{ 
                background: '#f59e0b11', 
                padding: '12px', 
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#f59e0b' }}>
                  {stats?.tasksProgress || 0}%
                </div>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>✅ Tasks</div>
              </div>
              <div style={{ 
                background: '#8b5cf611', 
                padding: '12px', 
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#8b5cf6' }}>
                  {stats?.prayersProgress || 0}%
                </div>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>🕌 Prayers</div>
              </div>
            </div>
          </Section>

          <Section>
            <SectionHeader>
              <h3>🕌 Today's Prayer Status</h3>
            </SectionHeader>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              {dailyTasks.filter(t => t.type === 'prayer').map(prayer => (
                <div key={prayer.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  background: prayer.status === 'complete' ? '#10b98122' : 
                               prayer.status === 'missed' ? '#ef444422' : 
                               '#f59e0b22',
                  borderRadius: '6px',
                  border: `2px solid ${prayer.status === 'complete' ? '#10b981' : 
                                     prayer.status === 'missed' ? '#ef4444' : 
                                     '#f59e0b'}`,
                }}>
                  <span style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.85rem',
                    fontWeight: '500'
                  }}>
                    <span style={{
                      display: 'inline-block',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: PrayerColors[prayer.prayerName],
                    }} />
                    {PrayerLabels[prayer.prayerName]}
                  </span>
                  <span style={{ 
                    fontSize: '0.7rem',
                    fontWeight: '600',
                    color: prayer.status === 'complete' ? '#10b981' : 
                           prayer.status === 'missed' ? '#ef4444' : 
                           '#f59e0b'
                  }}>
                    {prayer.status === 'complete' ? '✅' : 
                     prayer.status === 'missed' ? '❌' : 
                     '⏳'}
                  </span>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </MainGrid>

      <ChartsContainer>
        <ChartCard>
          <h3>📈 Weekly Progress</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={dailyProgress}>
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
              <Line 
                type="monotone" 
                dataKey="completed" 
                stroke="#4f46e5" 
                strokeWidth={2}
                dot={{ fill: '#4f46e5' }}
                name="Completed"
              />
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ fill: '#10b981' }}
                name="Total"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard>
          <h3>📊 Overall Distribution</h3>
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
    </Container>
  );
};

export default Dashboard;