import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTheme } from '../../context/ThemeContext';
import api from '../../services/api';
import { format } from 'date-fns';
import {
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiChevronLeft,
  FiChevronRight,
  FiBook,
  FiBookOpen,
  FiTarget,
  FiMoon,
} from 'react-icons/fi';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const Container = styled.div`
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 12px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 12px;

  h1 {
    font-size: 2rem;
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 1.4rem;
    }
  }
`;

const WeekNavigator = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const NavButton = styled.button`
  background: ${(props) => props.theme.surface};
  border: 1px solid ${(props) => props.theme.border};
  color: ${(props) => props.theme.text};
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${(props) => props.theme.primary};
    color: white;
  }
`;

const WeekLabel = styled.span`
  font-weight: 600;
  min-width: 200px;
  text-align: center;
  font-size: 0.95rem;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 14px;
  margin-bottom: 24px;
`;

const SummaryCard = styled.div`
  background: ${(props) => props.theme.surface};
  padding: 18px;
  border-radius: 12px;
  border: 1px solid ${(props) => props.theme.border};
  text-align: center;

  h3 {
    color: ${(props) => props.theme.textSecondary};
    font-size: 0.85rem;
    margin-bottom: 6px;
  }

  .value {
    font-size: 1.8rem;
    font-weight: 700;
    color: ${(props) => props.theme.text};
  }

  .sub {
    color: ${(props) => props.theme.textSecondary};
    font-size: 0.75rem;
    margin-top: 4px;
  }
`;

const ChartsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 28px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background: ${(props) => props.theme.surface};
  padding: 20px;
  border-radius: 12px;
  border: 1px solid ${(props) => props.theme.border};

  h3 {
    margin-bottom: 12px;
    color: ${(props) => props.theme.text};
    font-size: 1rem;
  }
`;

const ChartAndTasks = styled.div`
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 16px;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const TaskMiniList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 280px;
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

const TaskMiniItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  background: ${(props) => props.theme.surface2};
  border-radius: 6px;
  font-size: 0.8rem;

  .icon {
    color: ${(props) => {
      if (props.type === 'topic') return '#4f46e5';
      if (props.type === 'session') return '#10b981';
      if (props.type === 'task') return '#f59e0b';
      if (props.type === 'prayer') return '#8b5cf6';
      return props.theme.textSecondary;
    }};
    flex-shrink: 0;
  }

  .name {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: ${(props) => props.theme.text};
  }

  .count {
    font-weight: 700;
    color: ${(props) => props.theme.primary};
    font-size: 0.75rem;
    flex-shrink: 0;
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
  z-index: 1000;

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
  gap: 8px;
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
    background: ${(props) => props.color};
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

const DayCard = styled.div`
  background: ${(props) => props.theme.surface};
  padding: 18px;
  border-radius: 12px;
  border: 1px solid ${(props) => props.theme.border};
  margin-bottom: 14px;

  .day-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    padding-bottom: 10px;
    border-bottom: 1px solid ${(props) => props.theme.border};

    h4 {
      color: ${(props) => props.theme.text};
      font-size: 0.95rem;
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .completion-badge {
      padding: 3px 10px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      background: ${(props) => {
        const rate = props.completionRate;
        if (rate >= 80) return props.theme.success + '33';
        if (rate >= 50) return props.theme.warning + '33';
        return props.theme.danger + '33';
      }};
      color: ${(props) => {
        const rate = props.completionRate;
        if (rate >= 80) return props.theme.success;
        if (rate >= 50) return props.theme.warning;
        return props.theme.danger;
      }};
    }
  }

  .day-items {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 10px;
  }
`;

const DayItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 11px;
  background: ${(props) => props.theme.surface2};
  border-radius: 8px;

  .icon {
    color: ${(props) =>
      props.status === 'complete'
        ? props.theme.success
        : props.status === 'missed'
        ? props.theme.danger
        : props.theme.warning};
    flex-shrink: 0;
  }

  .name {
    flex: 1;
    font-size: 0.85rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: ${(props) => props.theme.text};
  }

  .status {
    font-size: 0.7rem;
    padding: 2px 8px;
    border-radius: 12px;
    flex-shrink: 0;
    background: ${(props) =>
      props.status === 'complete'
        ? props.theme.success + '33'
        : props.status === 'missed'
        ? props.theme.danger + '33'
        : props.theme.warning + '33'};
    color: ${(props) =>
      props.status === 'complete'
        ? props.theme.success
        : props.status === 'missed'
        ? props.theme.danger
        : props.theme.warning};
  }
`;

// ============================================
// CUSTOM TOOLTIPS
// ============================================
const AreaChartTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;

  const dayLabel = payload[0]?.payload?.day;
  const dateLabel = payload[0]?.payload?.date;

  return (
    <TooltipBox>
      <div className="label">
        {dayLabel} · {dateLabel}
      </div>
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

const WeeklyReview = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [reviewData, setReviewData] = useState(null);
  const [loading, setLoading] = useState(true);


const [isDark, setIsDark] = useState(true);

useEffect(() => {
  const update = () => {
    const saved = localStorage.getItem('discipline-theme') || 'light';
    setIsDark(saved === 'dark');
  };
  update();
  const interval = setInterval(update, 300);
  return () => clearInterval(interval);
}, []);

const axisColor = isDark ? '#e5e7eb' : '#374151';
const gridColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

  useEffect(() => {
    fetchWeeklyReview();
  }, [currentWeek]);

  const fetchWeeklyReview = async () => {
    try {
      setLoading(true);
      const day = currentWeek.getDay();
      const daysSinceSaturday = (day + 1) % 7;
      const saturday = new Date(currentWeek);
      saturday.setDate(saturday.getDate() - daysSinceSaturday);
      saturday.setHours(0, 0, 0, 0);

      const response = await api.get(
        `/reviews/weekly?weekStart=${format(saturday, 'yyyy-MM-dd')}`
      );
      setReviewData(response.data.review);
    } catch (error) {
      console.error('Error fetching weekly review:', error);
    } finally {
      setLoading(false);
    }
  };

  const changeWeek = (direction) => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(newWeek.getDate() + direction * 7);
    setCurrentWeek(newWeek);
  };

  if (loading) return <div>Loading...</div>;
  if (!reviewData) return <div>No data available</div>;

  const { summary, dailyData } = reviewData;

  const orderedDays = [...dailyData].sort((a, b) => {
    const da = new Date(a.date).getDay();
    const db = new Date(b.date).getDay();
    const order = { 6: 0, 0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 5: 6 };
    return order[da] - order[db];
  });

  const dailyChartData = orderedDays.map((day) => ({
    day: format(new Date(day.date), 'EEE'),
    date: format(new Date(day.date), 'MMM d'),
    completed:
      day.topics.completed + day.sessions.completed + day.tasks.completed,
    total: day.topics.total + day.sessions.total + day.tasks.total,
  }));

  const pieData = [
    { name: 'Completed', value: summary.overall.completed || 0, color: '#4f46e5' },
    { name: 'Pending', value: summary.overall.pending || 0, color: '#f59e0b' },
    { name: 'Missed', value: summary.overall.missed || 0, color: '#ef4444' },
  ].filter((d) => d.value > 0);

  const pieTotal = pieData.reduce((s, p) => s + p.value, 0);

  const taskBreakdown = [
    {
      type: 'topic',
      name: 'Topics',
      count: summary.topics.total,
      completed: summary.topics.completed,
      icon: <FiBookOpen className="icon" />,
    },
    {
      type: 'session',
      name: 'Reading',
      count: summary.reading.total,
      completed: summary.reading.completed,
      icon: <FiBook className="icon" />,
    },
    {
      type: 'task',
      name: 'Tasks',
      count: summary.tasks.total,
      completed: summary.tasks.completed,
      icon: <FiTarget className="icon" />,
    },
    {
      type: 'prayer',
      name: 'Prayers',
      count: summary.prayers.total,
      completed: summary.prayers.completed,
      icon: <FiMoon className="icon" />,
    },
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
            {format(new Date(reviewData.weekStart), 'MMM d')} -{' '}
            {format(new Date(reviewData.weekEnd), 'MMM d, yyyy')}
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
          <div className="sub">
            {summary.overall.completed} of {summary.overall.total} total
          </div>
        </SummaryCard>
        <SummaryCard>
          <h3>📚 Reading</h3>
          <div className="value">{summary.reading.completionRate}%</div>
          <div className="sub">
            {summary.reading.completed} of {summary.reading.total}
          </div>
        </SummaryCard>
        <SummaryCard>
          <h3>🎓 Courses</h3>
          <div className="value">{summary.topics.completionRate}%</div>
          <div className="sub">
            {summary.topics.completed} of {summary.topics.total}
          </div>
        </SummaryCard>
        <SummaryCard>
          <h3>✅ Tasks</h3>
          <div className="value">{summary.tasks.completionRate}%</div>
          <div className="sub">
            {summary.tasks.completed} of {summary.tasks.total}
          </div>
        </SummaryCard>
        <SummaryCard>
          <h3>🕌 Prayers</h3>
          <div className="value">{summary.prayers.completionRate}%</div>
          <div className="sub">
            {summary.prayers.completed} of {summary.prayers.total}
          </div>
        </SummaryCard>
      </SummaryGrid>

      <ChartsContainer>
        <ChartCard>
          <h3>Daily Progress</h3>
          <ChartAndTasks>
            <div>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart
                  data={dailyChartData}
                  margin={{ top: 20, right: 15, left: 15, bottom: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis
                    dataKey="day"
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
                    content={<AreaChartTooltip />}
                    cursor={{ fill: 'transparent' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="completed"
                    stackId="1"
                    stroke="#4f46e5"
                    fill="#4f46e5"
                    fillOpacity={0.6}
                    name="Completed"
                  />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stackId="2"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.3}
                    name="Total"
                  />
                </AreaChart>
              </ResponsiveContainer>

              {/* Axis captions OUTSIDE the SVG — guaranteed to render */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '8px',
                  fontSize: '0.75rem',
                  color: axisColor,
                  paddingLeft: '15px',
                  paddingRight: '15px',
                }}
              >
                <span>
                  <strong>Vertical:</strong> Number of tasks
                </span>
                <span>
                  <strong>Horizontal:</strong> Day of week
                </span>
              </div>
            </div>

            <TaskMiniList>
              {taskBreakdown.map((item, i) => (
                <TaskMiniItem key={i} type={item.type}>
                  {item.icon}
                  <span className="name">{item.name}</span>
                  <span className="count">
                    {item.completed}/{item.count}
                  </span>
                </TaskMiniItem>
              ))}
            </TaskMiniList>
          </ChartAndTasks>
        </ChartCard>

        <ChartCard>
          <h3>Overall Distribution</h3>

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
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
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
                    <PieLegendItem key={i} color={item.color}>
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

      <h2 style={{ marginBottom: '14px', fontSize: '1.2rem' }}>
        Daily Breakdown
      </h2>
      {orderedDays.map((day, index) => {
        const totalItems =
          day.topics.total + day.sessions.total + day.tasks.total;
        const completedItems =
          day.topics.completed + day.sessions.completed + day.tasks.completed;
        const completionRate =
          totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

        return (
          <DayCard key={index} completionRate={completionRate}>
            <div className="day-header">
              <h4>
                {format(new Date(day.date), 'EEEE, MMMM d, yyyy')}
                {new Date(day.date).getDay() === 5 && (
                  <span
                    style={{
                      fontSize: '0.7rem',
                      background: '#f59e0b33',
                      color: '#f59e0b',
                      padding: '2px 8px',
                      borderRadius: '10px',
                    }}
                  >
                    🕌 Jummah
                  </span>
                )}
              </h4>
              <span className="completion-badge">
                {completionRate}% Complete
              </span>
            </div>
            <div className="day-items">
              {day.topics.items.length > 0 && (
                <div>
                  <div
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      marginBottom: '5px',
                      color: '#4f46e5',
                    }}
                  >
                    📚 Topics ({day.topics.completed}/{day.topics.total})
                  </div>
                  {day.topics.items.map((topic, idx) => (
                    <DayItem key={idx} status={topic.status}>
                      <span className="icon">
                        {topic.status === 'complete' ? (
                          <FiCheckCircle />
                        ) : topic.status === 'missed' ? (
                          <FiXCircle />
                        ) : (
                          <FiClock />
                        )}
                      </span>
                      <span className="name">{topic.name}</span>
                      <span className="status">{topic.status}</span>
                    </DayItem>
                  ))}
                </div>
              )}

              {day.sessions.items.length > 0 && (
                <div>
                  <div
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      marginBottom: '5px',
                      color: '#10b981',
                    }}
                  >
                    📖 Reading ({day.sessions.completed}/{day.sessions.total})
                  </div>
                  {day.sessions.items.map((session, idx) => (
                    <DayItem key={idx} status={session.status}>
                      <span className="icon">
                        {session.status === 'complete' ? (
                          <FiCheckCircle />
                        ) : session.status === 'missed' ? (
                          <FiXCircle />
                        ) : (
                          <FiClock />
                        )}
                      </span>
                      <span className="name">
                        Pages {session.pageStart}-{session.pageEnd}
                      </span>
                      <span className="status">{session.status}</span>
                    </DayItem>
                  ))}
                </div>
              )}

              {day.tasks.items.length > 0 && (
                <div>
                  <div
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      marginBottom: '5px',
                      color: '#f59e0b',
                    }}
                  >
                    ✅ Tasks ({day.tasks.completed}/{day.tasks.total})
                  </div>
                  {day.tasks.items.map((task, idx) => (
                    <DayItem key={idx} status={task.status}>
                      <span className="icon">
                        {task.status === 'complete' ? (
                          <FiCheckCircle />
                        ) : task.status === 'missed' ? (
                          <FiXCircle />
                        ) : (
                          <FiClock />
                        )}
                      </span>
                      <span className="name">{task.name}</span>
                      <span className="status">{task.status}</span>
                    </DayItem>
                  ))}
                </div>
              )}

              {day.prayers && (
                <div>
                  <div
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      marginBottom: '5px',
                      color: '#8b5cf6',
                    }}
                  >
                    🕌 Prayers ({day.prayers.completed}/{day.prayers.total})
                  </div>
                  {day.prayers.items.map((prayer, idx) => (
                    <DayItem key={idx} status={prayer.status}>
                      <span className="icon">
                        {prayer.status === 'complete' ? (
                          <FiCheckCircle />
                        ) : prayer.status === 'missed' ? (
                          <FiXCircle />
                        ) : (
                          <FiClock />
                        )}
                      </span>
                      <span
                        className="name"
                        style={{ textTransform: 'capitalize' }}
                      >
                        {prayer.name}
                      </span>
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