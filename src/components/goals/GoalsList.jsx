import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FiPlus, FiTarget, FiArrowLeft, FiTrash2, FiCalendar, FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi';
import { format } from 'date-fns';

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
    display: flex;
    align-items: center;
    gap: 12px;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const BackButton = styled.button`
  background: transparent;
  border: none;
  color: ${props => props.theme.text};
  font-size: 1.5rem;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.surface2};
  }
`;

const CreateButton = styled(Link)`
  background: ${props => props.theme.primary};
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.primaryDark};
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadowHover};
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
`;

const Card = styled.div`
  background: ${props => props.theme.surface};
  border-radius: 12px;
  border: 1px solid ${props => props.theme.border};
  padding: 24px;
  transition: all 0.3s;
  position: relative;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadowHover};
  }
`;

const CardTitle = styled(Link)`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${props => props.theme.text};
  text-decoration: none;
  display: block;
  margin-bottom: 8px;

  &:hover {
    color: ${props => props.theme.primary};
  }
`;

const CardDescription = styled.p`
  color: ${props => props.theme.textSecondary};
  font-size: 0.9rem;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CardMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid ${props => props.theme.border};
  font-size: 0.85rem;
  color: ${props => props.theme.textSecondary};
`;

const TaskStats = styled.div`
  display: flex;
  gap: 12px;
  margin: 8px 0;
  font-size: 0.85rem;
`;

const StatItem = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${props => {
    if (props.type === 'complete') return props.theme.success;
    if (props.type === 'missed') return props.theme.danger;
    return props.theme.warning;
  }};
`;

const ProgressBar = styled.div`
  height: 6px;
  background: ${props => props.theme.border};
  border-radius: 3px;
  overflow: hidden;
  margin: 8px 0;

  .bar {
    height: 100%;
    background: ${props => {
      const percent = props.percent || 0;
      if (percent >= 80) return props.theme.success;
      if (percent >= 50) return props.theme.warning;
      return props.theme.danger;
    }};
    border-radius: 3px;
    transition: width 0.5s ease;
    width: ${props => props.percent || 0}%;
  }
`;

const FilterBar = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  padding: 6px 16px;
  border-radius: 20px;
  border: 1px solid ${props => props.active ? props.theme.primary : props.theme.border};
  background: ${props => props.active ? props.theme.primary : 'transparent'};
  color: ${props => props.active ? 'white' : props.theme.text};
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.85rem;

  &:hover {
    border-color: ${props => props.theme.primary};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${props => props.theme.textSecondary};

  svg {
    font-size: 4rem;
    margin-bottom: 16px;
    opacity: 0.5;
  }

  h3 {
    color: ${props => props.theme.text};
    margin-bottom: 8px;
  }
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 60px;
  color: ${props => props.theme.textSecondary};
`;

const GoalsList = () => {
  const navigate = useNavigate();
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState('all');
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [areasLoaded, setAreasLoaded] = useState(false);

  useEffect(() => {
    fetchAreas();
  }, []);

  useEffect(() => {
    if (!areasLoaded) return;

    if (selectedArea === 'all') {
      fetchAllGoals();
    } else {
      fetchGoalsByArea(selectedArea);
    }
  }, [selectedArea, areasLoaded]);

  const fetchAreas = async () => {
    try {
      const response = await api.get('/areas');
      setAreas(response.data.areas);
    } catch (error) {
      console.error('Error fetching areas:', error);
      toast.error('Failed to load areas');
      setAreas([]);
    } finally {
      setAreasLoaded(true);
    }
  };

  const fetchAllGoals = async () => {
    try {
      setLoading(true);

      if (areas.length === 0) {
        setGoals([]);
        return;
      }

      const promises = areas.map(area => api.get(`/goals/area/${area._id}`));
      const responses = await Promise.all(promises);
      const allGoals = responses.flatMap(res => res.data.goals);
      setGoals(allGoals);
    } catch (error) {
      console.error('Error fetching goals:', error);
      toast.error('Failed to load goals');
      setGoals([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchGoalsByArea = async (areaId) => {
    try {
      setLoading(true);
      const response = await api.get(`/goals/area/${areaId}`);
      setGoals(response.data.goals);
    } catch (error) {
      console.error('Error fetching goals:', error);
      toast.error('Failed to load goals');
      setGoals([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteGoal = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      await api.delete(`/goals/${id}`);
      toast.success('Goal deleted successfully');
      if (selectedArea === 'all') {
        fetchAllGoals();
      } else {
        fetchGoalsByArea(selectedArea);
      }
    } catch (error) {
      toast.error('Failed to delete goal');
    }
  };

  const getTaskStats = (tasks) => {
    const total = tasks?.length || 0;
    const completed = tasks?.filter(t => t.status === 'complete').length || 0;
    const missed = tasks?.filter(t => t.status === 'missed').length || 0;
    const pending = total - completed - missed;
    return { total, completed, missed, pending };
  };

  if (!areasLoaded) {
    return (
      <Container>
        <LoadingSpinner>Loading areas...</LoadingSpinner>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <BackButton onClick={() => navigate('/areas')}>
            <FiArrowLeft />
          </BackButton>
          <h1>
            <FiTarget /> Goals
          </h1>
        </HeaderLeft>
        {selectedArea !== 'all' && (
          <CreateButton to={`/goals/create/${selectedArea}`}>
            <FiPlus /> New Goal
          </CreateButton>
        )}
      </Header>

      <FilterBar>
        <FilterButton
          active={selectedArea === 'all'}
          onClick={() => setSelectedArea('all')}
        >
          All Areas
        </FilterButton>
        {areas.map(area => (
          <FilterButton
            key={area._id}
            active={selectedArea === area._id}
            onClick={() => setSelectedArea(area._id)}
          >
            {area.title}
          </FilterButton>
        ))}
      </FilterBar>

      {loading ? (
        <LoadingSpinner>Loading goals...</LoadingSpinner>
      ) : goals.length === 0 ? (
        <EmptyState>
          <FiTarget />
          <h3>No goals found</h3>
          <p>
            {selectedArea === 'all'
              ? areas.length === 0
                ? 'Create an area first to start adding goals'
                : 'No goals yet. Create a goal in one of your areas to get started'
              : 'Create your first goal in this area'}
          </p>
          {selectedArea !== 'all' && (
            <CreateButton
              to={`/goals/create/${selectedArea}`}
              style={{ marginTop: '16px', display: 'inline-flex' }}
            >
              <FiPlus /> Create Goal
            </CreateButton>
          )}
        </EmptyState>
      ) : (
        <Grid>
          {goals.map((goal) => {
            const stats = getTaskStats(goal.tasks);
            const progress = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
            const area = areas.find(a => a._id === goal.areaId);

            return (
              <Card key={goal._id}>
                <CardTitle to={`/goals/${goal._id}`}>
                  {goal.title}
                </CardTitle>
                <CardDescription>{goal.description}</CardDescription>

                <div style={{ fontSize: '0.85rem', color: '#9ca3af', marginBottom: '8px' }}>
                  <FiCalendar size={14} style={{ display: 'inline', marginRight: '4px' }} />
                  {format(new Date(goal.startDate), 'MMM d')} - {format(new Date(goal.endDate), 'MMM d, yyyy')}
                  {area && ` • ${area.title}`}
                </div>

                <TaskStats>
                  <StatItem type="complete">
                    <FiCheckCircle size={14} /> {stats.completed} done
                  </StatItem>
                  <StatItem type="pending">
                    <FiClock size={14} /> {stats.pending} pending
                  </StatItem>
                  <StatItem type="missed">
                    <FiXCircle size={14} /> {stats.missed} missed
                  </StatItem>
                </TaskStats>

                <ProgressBar percent={progress}>
                  <div className="bar" />
                </ProgressBar>

                <CardMeta>
                  <span>{stats.total} tasks • {progress}% complete</span>
                  <button
                    onClick={() => deleteGoal(goal._id, goal.title)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#ef4444',
                      cursor: 'pointer',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => (e.target.style.background = '#ef444422')}
                    onMouseLeave={(e) => (e.target.style.background = 'transparent')}
                  >
                    <FiTrash2 />
                  </button>
                </CardMeta>
              </Card>
            );
          })}
        </Grid>
      )}
    </Container>
  );
};

export default GoalsList;