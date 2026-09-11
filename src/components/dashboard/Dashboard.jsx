import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
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
  FiMoon,
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
} from 'recharts';
import { format } from 'date-fns';
import { getDailyMotivation } from '../../utils/motivations';

// ============================================
// STYLED COMPONENTS
// ============================================
const Container = styled.div`
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 12px;
  }
`;

const Header = styled.div`
  margin-bottom: 20px;

  h1 {
    font-size: 2rem;
    margin-bottom: 5px;
  }

  p {
    color: ${(props) => props.theme.textSecondary};
    font-size: 0.95rem;
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 1.4rem;
    }
  }
`;

const MotivationBanner = styled.div`
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.primary}22,
    ${(props) => props.theme.primary}08
  );
  border: 1px solid ${(props) => props.theme.primary}44;
  border-left: 4px solid ${(props) => props.theme.primary};
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 14px;

  .icon {
    font-size: 1.6rem;
    flex-shrink: 0;
  }

  .content {
    flex: 1;

    .label {
      font-size: 0.72rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: ${(props) => props.theme.primary};
      font-weight: 700;
      margin-bottom: 4px;
    }

    .sentence {
      font-size: 0.98rem;
      color: ${(props) => props.theme.text};
      font-weight: 500;
      line-height: 1.5;
      font-style: italic;
    }
  }

  @media (max-width: 500px) {
    padding: 14px 16px;

    .icon {
      font-size: 1.3rem;
    }

    .content .sentence {
      font-size: 0.9rem;
    }
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 14px;
  margin-bottom: 24px;

  @media (max-width: 500px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatCard = styled.div`
  background: ${(props) => props.theme.surface};
  padding: 16px;
  border-radius: 12px;
  border: 1px solid ${(props) => props.theme.border};
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${(props) => props.theme.shadowHover};
  }
`;

const StatIcon = styled.div`
  color: ${(props) => props.color || props.theme.primary};
  font-size: 1.2rem;
  margin-bottom: 6px;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${(props) => props.theme.text};
`;

const StatLabel = styled.div`
  color: ${(props) => props.theme.textSecondary};
  font-size: 0.8rem;
  margin-top: 2px;
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 16px;
  margin-bottom: 20px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled.div`
  background: ${(props) => props.theme.surface};
  border-radius: 12px;
  border: 1px solid ${(props) => props.theme.border};
  padding: 18px;
  margin-bottom: 16px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;

  h3 {
    font-size: 1rem;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .view-all {
    color: ${(props) => props.theme.primary};
    text-decoration: none;
    font-size: 0.8rem;
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
    color: ${(props) => props.theme.textSecondary};
  }
`;

const TaskList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 500px;
  overflow-y: auto;
  padding-right: 4px;

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.primary};
    border-radius: 3px;
  }
`;

const TaskItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 9px 12px;
  background: ${(props) => props.theme.surface2};
  border-radius: 8px;
  border-left: 4px solid
    ${(props) => {
      if (props.$status === 'complete') return props.theme.success;
      if (props.$status === 'missed') return props.theme.danger;
      return props.theme.warning;
    }};
  transition: all 0.2s;
  gap: 8px;

  &:hover {
    transform: translateX(3px);
  }

  .task-info {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
  }

  .task-icon {
    font-size: 1rem;
    flex-shrink: 0;
    color: ${(props) => {
      if (props.$type === 'topic') return '#4f46e5';
      if (props.$type === 'session') return '#10b981';
      if (props.$type === 'task') return '#f59e0b';
      if (props.$type === 'prayer') return '#8b5cf6';
      return '#6b7280';
    }};
  }

  .task-details {
    flex: 1;
    min-width: 0;

    .task-title {
      font-weight: 500;
      font-size: 0.88rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: ${(props) => props.theme.text};
    }

    .task-meta {
      font-size: 0.7rem;
      color: ${(props) => props.theme.textSecondary};
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
      margin-top: 2px;

      .task-type {
        padding: 1px 7px;
        border-radius: 10px;
        background: ${(props) => props.theme.primary}22;
        color: ${(props) => props.theme.primary};
        font-size: 0.65rem;
      }
    }
  }

  .task-actions {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
  }

  @media (max-width: 500px) {
    .task-meta {
      display: none;
    }
  }
`;

const StatusBadge = styled.span`
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 0.65rem;
  font-weight: 600;
  white-space: nowrap;
  background: ${(props) => {
    if (props.$status === 'complete') return props.theme.success + '33';
    if (props.$status === 'missed') return props.theme.danger + '33';
    return props.theme.warning + '33';
  }};
  color: ${(props) => {
    if (props.$status === 'complete') return props.theme.success;
    if (props.$status === 'missed') return props.theme.danger;
    return props.theme.warning;
  }};

  @media (max-width: 500px) {
    display: none;
  }
`;

const CompleteButton = styled.button`
  padding: 3px 10px;
  border: 2px solid
    ${(props) =>
      props.$status === 'complete' ? props.theme.success : props.theme.border};
  background: ${(props) =>
    props.$status === 'complete' ? props.theme.success + '33' : 'transparent'};
  color: ${(props) =>
    props.$status === 'complete'
      ? props.theme.success
      : props.theme.textSecondary};
  border-radius: 6px;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  font-weight: 600;
  font-size: 0.7rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 3px;
  white-space: nowrap;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};

  &:hover {
    background: ${(props) => {
      if (props.disabled) return 'transparent';
      if (props.$status === 'complete') return props.theme.success;
      return props.theme.primary;
    }};
    color: ${(props) => (props.disabled ? props.theme.textSecondary : 'white')};
    border-color: ${(props) => {
      if (props.disabled) return props.theme.border;
      if (props.$status === 'complete') return props.theme.success;
      return props.theme.primary;
    }};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 30px 20px;
  color: ${(props) => props.theme.textSecondary};

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
  grid-template-columns: 1.4fr 1fr;
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background: ${(props) => props.theme.surface};
  padding: 18px;
  border-radius: 12px;
  border: 1px solid ${(props) => props.theme.border};

  h3 {
    margin-bottom: 12px;
    color: ${(props) => props.theme.text};
    font-size: 0.95rem;
  }
`;

const QuickActions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 10px;
  margin-top: 8px;
`;

const ActionCard = styled(Link)`
  background: ${(props) => props.theme.surface2};
  padding: 12px;
  border-radius: 10px;
  border: 1px solid ${(props) => props.theme.border};
  text-decoration: none;
  color: ${(props) => props.theme.text};
  transition: all 0.3s;
  text-align: center;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${(props) => props.theme.shadowHover};
    border-color: ${(props) => props.theme.primary};
  }

  svg {
    font-size: 1.2rem;
    color: ${(props) => props.theme.primary};
    margin-bottom: 4px;
  }

  h4 {
    font-size: 0.8rem;
    margin-bottom: 2px;
  }

  p {
    color: ${(props) => props.theme.textSecondary};
    font-size: 0.68rem;
  }
`;

const MiniStatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 8px;
`;

const MiniStat = styled.div`
  background: ${(props) => props.theme.surface2};
  padding: 10px;
  border-radius: 8px;
  text-align: center;

  .value {
    font-size: 1.1rem;
    font-weight: 700;
    color: ${(props) => props.color};
  }

  .label {
    font-size: 0.7rem;
    color: ${(props) => props.theme.textSecondary};
    margin-top: 2px;
  }
`;

const PrayerStatusGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  margin-top: 8px;
`;

const PrayerStatusItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 7px 10px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
  background: ${(props) =>
    props.$status === 'complete'
      ? '#10b98122'
      : props.$status === 'missed'
      ? '#ef444422'
      : '#f59e0b22'};
  border: 2px solid
    ${(props) =>
      props.$status === 'complete'
        ? '#10b981'
        : props.$status === 'missed'
        ? '#ef4444'
        : '#f59e0b'};

  .dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${(props) => props.$color};
    margin-right: 6px;
  }

  .status-icon {
    font-weight: 700;
    color: ${(props) =>
      props.$status === 'complete'
        ? '#10b981'
        : props.$status === 'missed'
        ? '#ef4444'
        : '#f59e0b'};
  }
`;

const TooltipBox = styled.div`
  background: ${(props) => props.theme.surface};
  border: 1px solid ${(props) => props.theme.border};
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 0.85rem;
  color: ${(props) => props.theme.text};
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
  min-width: 120px;

  .label {
    font-weight: 700;
    font-size: 0.9rem;
    margin-bottom: 6px;
    color: ${(props) => props.theme.text};
    border-bottom: 1px solid ${(props) => props.theme.border};
    padding-bottom: 4px;
  }

  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    font-size: 0.82rem;
    margin-top: 4px;
  }

  .row-name {
    display: flex;
    align-items: center;
    gap: 6px;
    color: ${(props) => props.theme.text};
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .value {
    font-weight: 700;
    color: ${(props) => props.theme.text};
  }
`;

const PieLegend = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 14px;
  padding: 0 8px;
`;

const PieLegendItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 8px 12px;
  background: ${(props) => props.theme.surface2};
  border-radius: 8px;
  font-size: 0.85rem;

  .left {
    display: flex;
    align-items: center;
    gap: 8px;
    color: ${(props) => props.theme.text};
    font-weight: 600;
  }

  .dot {
    width: 12px;
    height: 12px;
    border-radius: 3px;
    background: ${(props) => props.$color};
    flex-shrink: 0;
  }

  .right {
    color: ${(props) => props.theme.textSecondary};
    font-size: 0.82rem;
  }

  .value {
    color: ${(props) => props.theme.text};
    font-weight: 700;
    margin-right: 4px;
  }
`;

const AxisCaption = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  padding: 0 12px;
  font-size: 0.72rem;
  color: ${(props) => props.theme.textSecondary};

  strong {
    color: ${(props) => props.theme.text};
  }
`;

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

// ============================================
// CUSTOM TOOLTIPS
// ============================================
const LineChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <TooltipBox>
      <div className="label">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="row">
          <span className="row-name">
            <span className="dot" style={{ background: p.color }} />
            {p.name}
          </span>
          <span className="value">{p.value}</span>
        </div>
      ))}
    </TooltipBox>
  );
};

const PieChartTooltip = ({ active, payload, total }) => {
  if (!active || !payload || !payload.length) return null;

  const item = payload[0];
  const value = item.value;
  const percent = total > 0 ? ((value / total) * 100).toFixed(0) : 0;

  return (
    <TooltipBox>
      <div className="label">{item.name}</div>
      <div className="row">
        <span className="row-name">
          <span className="dot" style={{ background: item.payload?.color }} />
          Tasks
        </span>
        <span className="value">{value}</span>
      </div>
      <div className="row">
        <span className="row-name">Percentage</span>
        <span className="value">{percent}%</span>
      </div>
    </TooltipBox>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
const Dashboard = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [stats, setStats] = useState(null);
  const [dailyTasks, setDailyTasks] = useState([]);
  const [dailyProgress, setDailyProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const isDark = theme === 'dark';
  const axisColor = isDark ? '#e5e7eb' : '#374151';
  const gridColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const today = new Date();
      const todayStr = format(today, 'yyyy-MM-dd');

      const statsRes = await api.get('/reviews/weekly');
      const weeklyData = statsRes.data.review;

      const dailyRes = await api.get(`/reviews/daily/${todayStr}`);
      const dailyData = dailyRes.data.dailyView;

      let prayerRes = { data: { prayer: null } };
      try {
        prayerRes = await api.get(`/prayers/date/${todayStr}`);
      } catch (e) {
        // Ignore 404
      }

      const tasks = [];

      if (dailyData && dailyData.areas) {
        dailyData.areas.forEach((area) => {
          area.topics.forEach((topic) => {
            tasks.push({
              id: topic._id,
              title: topic.name,
              type: 'topic',
              status: topic.status,
              areaTitle: area.areaTitle,
              typeLabel: 'Course Topic',
              icon: <FiBookOpen />,
            });
          });

          area.sessions.forEach((session) => {
            tasks.push({
              id: session._id,
              title: `Pages ${session.pageStart}-${session.pageEnd}`,
              type: 'session',
              status: session.status,
              areaTitle: area.areaTitle,
              typeLabel: 'Reading',
              icon: <FiBook />,
            });
          });

          area.tasks.forEach((task) => {
            tasks.push({
              id: task._id,
              title: task.name,
              type: 'task',
              status: task.status,
              areaTitle: area.areaTitle,
              typeLabel: 'Goal Task',
              icon: <FiTarget />,
            });
          });
        });
      }

      if (prayerRes.data && prayerRes.data.prayer) {
        prayerRes.data.prayer.prayers.forEach((prayer) => {
          tasks.push({
            id: `${prayer.name}-${todayStr}`,
            title: `${PrayerLabels[prayer.name]} Prayer`,
            type: 'prayer',
            status: prayer.status,
            areaTitle: '🕌 Daily Prayers',
            typeLabel: 'Prayer',
            icon: <FiMoon />,
            prayerName: prayer.name,
            isPrayer: true,
          });
        });
      }

      const sortedTasks = tasks.sort((a, b) => {
        const order = { pending: 0, complete: 1, missed: 2 };
        return order[a.status] - order[b.status];
      });

      setDailyTasks(sortedTasks);

      // ============================================
      // REORDER WEEK: Saturday → Friday
      // ============================================
      const orderedDays = [...weeklyData.dailyData].sort((a, b) => {
        const da = new Date(a.date).getDay();
        const db = new Date(b.date).getDay();
        const order = { 6: 0, 0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 5: 6 };
        return order[da] - order[db];
      });

      const progressData = orderedDays.map((day) => ({
        date: format(new Date(day.date), 'EEE'),
        completed:
          day.topics.completed + day.sessions.completed + day.tasks.completed,
        total: day.topics.total + day.sessions.total + day.tasks.total,
      }));

      setDailyProgress(progressData);

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
      if (error.response?.status !== 404) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (
    taskId,
    type,
    currentStatus,
    isPrayer,
    prayerName
  ) => {
    if (updating) return;
    setUpdating(true);
    const newStatus = currentStatus === 'complete' ? 'pending' : 'complete';

    try {
      if (isPrayer) {
        const today = format(new Date(), 'yyyy-MM-dd');
        await api.put('/prayers/complete', { date: today, prayerName });
      } else {
        let endpoint;
        if (type === 'topic') endpoint = `/courses/topics/${taskId}`;
        else if (type === 'session')
          endpoint = `/books/reading-sessions/${taskId}`;
        else if (type === 'task') endpoint = `/goals/tasks/${taskId}`;
        await api.put(endpoint, { status: newStatus });
      }

      setDailyTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
      );

      toast.success(
        `${isPrayer ? 'Prayer' : 'Task'} ${
          newStatus === 'complete' ? 'completed! ✅' : 'marked as pending'
        }`
      );
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  const pieData = stats
    ? [
        {
          name: 'Completed',
          value: stats.totalCompleted || 0,
          color: '#4f46e5',
        },
        { name: 'Pending', value: stats.totalPending || 0, color: '#f59e0b' },
        { name: 'Missed', value: stats.totalMissed || 0, color: '#ef4444' },
      ].filter((d) => d.value > 0)
    : [];

  const pieTotal = pieData.reduce((s, p) => s + p.value, 0);

  const completedCount = dailyTasks.filter(
    (t) => t.status === 'complete'
  ).length;
  const totalCount = dailyTasks.length;

  return (
    <Container>
      <Header>
        <h1>Welcome back, {user?.username}! 👋</h1>
        <p>Here's your progress overview and today's tasks</p>
      </Header>


      <StatsGrid>
        <StatCard>
          <StatIcon>
            <FiBook />
          </StatIcon>
          <StatValue>{stats?.totalAreas || 0}</StatValue>
          <StatLabel>Active Areas</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon color="#4f46e5">
            <FiTrendingUp />
          </StatIcon>
          <StatValue>{stats?.weeklyCompletion || 0}%</StatValue>
          <StatLabel>Weekly Completion</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon color="#10b981">
            <FiCheckCircle />
          </StatIcon>
          <StatValue>{stats?.totalCompleted || 0}</StatValue>
          <StatLabel>Completed</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon color="#f59e0b">
            <FiClock />
          </StatIcon>
          <StatValue>{stats?.totalPending || 0}</StatValue>
          <StatLabel>Pending</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon color="#ef4444">
            <FiXCircle />
          </StatIcon>
          <StatValue>{stats?.totalMissed || 0}</StatValue>
          <StatLabel>Missed</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon color="#8b5cf6">
            <FiMoon />
          </StatIcon>
          <StatValue>
            {completedCount}/{totalCount}
          </StatValue>
          <StatLabel>Today's Progress</StatLabel>
        </StatCard>
      </StatsGrid>

      <MainGrid>
        <div>
          
      {/* Motivation Banner */}
      <MotivationBanner>
        <div className="icon">💡</div>
        <div className="content">
          <div className="label">Today's Motivation</div>
          <div className="sentence">{getDailyMotivation()}</div>
        </div>
      </MotivationBanner>
          <Section>
            <SectionHeader>
              <h3>
                <FiCalendar /> Today's Tasks
                <span className="task-count">
                  ({completedCount}/{totalCount})
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
                <p style={{ fontSize: '0.8rem' }}>
                  Enjoy your day or plan something new
                </p>
              </EmptyState>
            ) : (
              <TaskList>
                {dailyTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    $status={task.status}
                    $type={task.type}
                  >
                    <div className="task-info">
                      <span className="task-icon">{task.icon}</span>
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
                        </div>
                      </div>
                    </div>
                    <div className="task-actions">
                      <StatusBadge $status={task.status}>
                        {task.status === 'complete'
                          ? '✅'
                          : task.status === 'missed'
                          ? '❌'
                          : '⏳'}
                      </StatusBadge>
                      <CompleteButton
                        $status={task.status}
                        disabled={task.status === 'missed' || updating}
                        onClick={() =>
                          updateTaskStatus(
                            task.id,
                            task.type,
                            task.status,
                            task.isPrayer || false,
                            task.prayerName
                          )
                        }
                      >
                        {task.status === 'complete' ? (
                          <>
                            <FiCheck size={12} /> Undo
                          </>
                        ) : (
                          <>
                            <FiCheck size={12} /> Complete
                          </>
                        )}
                      </CompleteButton>
                    </div>
                  </TaskItem>
                ))}
              </TaskList>
            )}
          </Section>
        </div>

        <div>
          <Section>
            <SectionHeader>
              <h3>⚡ Quick Actions</h3>
            </SectionHeader>
            <QuickActions>
              <ActionCard to="/areas/create">
                <FiBookOpen />
                <h4>New Area</h4>
                <p>Create area</p>
              </ActionCard>
              <ActionCard to="/prayers">
                <FiMoon />
                <h4>Prayers</h4>
                <p>Track prayers</p>
              </ActionCard>
              <ActionCard to="/weekly">
                <FiTrendingUp />
                <h4>Weekly</h4>
                <p>View progress</p>
              </ActionCard>
              <ActionCard to="/daily">
                <FiTarget />
                <h4>Tasks</h4>
                <p>Daily tasks</p>
              </ActionCard>
            </QuickActions>
          </Section>

          <Section>
            <SectionHeader>
              <h3>📊 Quick Stats</h3>
            </SectionHeader>
            <MiniStatsGrid>
              <MiniStat color="#4f46e5">
                <div className="value">{stats?.topicsProgress || 0}%</div>
                <div className="label">📚 Topics</div>
              </MiniStat>
              <MiniStat color="#10b981">
                <div className="value">{stats?.readingProgress || 0}%</div>
                <div className="label">📖 Reading</div>
              </MiniStat>
              <MiniStat color="#f59e0b">
                <div className="value">{stats?.tasksProgress || 0}%</div>
                <div className="label">✅ Tasks</div>
              </MiniStat>
              <MiniStat color="#8b5cf6">
                <div className="value">{stats?.prayersProgress || 0}%</div>
                <div className="label">🕌 Prayers</div>
              </MiniStat>
            </MiniStatsGrid>
          </Section>

          <Section>
            <SectionHeader>
              <h3>🕌 Today's Prayers</h3>
            </SectionHeader>
            <PrayerStatusGrid>
              {dailyTasks
                .filter((t) => t.type === 'prayer')
                .map((prayer) => (
                  <PrayerStatusItem
                    key={prayer.id}
                    $status={prayer.status}
                    $color={PrayerColors[prayer.prayerName]}
                  >
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <span
                        className="dot"
                        style={{
                          background: PrayerColors[prayer.prayerName],
                        }}
                      />
                      {PrayerLabels[prayer.prayerName]}
                    </span>
                    <span className="status-icon">
                      {prayer.status === 'complete'
                        ? '✅'
                        : prayer.status === 'missed'
                        ? '❌'
                        : '⏳'}
                    </span>
                  </PrayerStatusItem>
                ))}
            </PrayerStatusGrid>
          </Section>
        </div>
      </MainGrid>

      <ChartsContainer>
        {/* Weekly Progress - Line Chart */}
        <ChartCard>
          <h3>📈 Weekly Progress</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart
              data={dailyProgress}
              margin={{ top: 15, right: 15, left: 5, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis
                dataKey="date"
                tick={{ fill: axisColor, fontSize: 13, fontWeight: 600 }}
                axisLine={{ stroke: axisColor }}
                tickLine={{ stroke: axisColor }}
              />
              <YAxis
                tick={{ fill: axisColor, fontSize: 12, fontWeight: 600 }}
                axisLine={{ stroke: axisColor }}
                tickLine={{ stroke: axisColor }}
              />
              <Tooltip
                content={<LineChartTooltip />}
                cursor={{ stroke: axisColor, strokeOpacity: 0.3 }}
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
          <AxisCaption>
            <span>
              <strong>Vertical:</strong> Number of tasks
            </span>
            <span>
              <strong>Horizontal:</strong> Day of week
            </span>
          </AxisCaption>
        </ChartCard>

        {/* Overall Distribution - Pie */}
        <ChartCard>
          <h3>📊 Overall Distribution</h3>
          {pieData.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '60px 20px',
                opacity: 0.6,
                color: axisColor,
              }}
            >
              No data this week
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                    nameKey="name"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke="transparent"
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<PieChartTooltip total={pieTotal} />} />
                </PieChart>
              </ResponsiveContainer>

              <PieLegend>
                {pieData.map((item, i) => {
                  const percent =
                    pieTotal > 0
                      ? ((item.value / pieTotal) * 100).toFixed(0)
                      : 0;
                  return (
                    <PieLegendItem key={i} $color={item.color}>
                      <span className="left">
                        <span className="dot" />
                        {item.name}
                      </span>
                      <span className="right">
                        <span className="value">{item.value}</span>
                        ({percent}%)
                      </span>
                    </PieLegendItem>
                  );
                })}
              </PieLegend>
            </>
          )}
        </ChartCard>
      </ChartsContainer>
    </Container>
  );
};

export default Dashboard;