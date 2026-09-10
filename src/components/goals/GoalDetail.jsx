import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiCheckCircle, FiClock, FiXCircle, FiTrash2, FiCalendar } from 'react-icons/fi';
import { format } from 'date-fns';

const Container = styled.div`
  padding: 20px;
  max-width: 900px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  h1 {
    font-size: 2rem;
    margin-bottom: 4px;
  }

  .subtitle {
    color: ${props => props.theme.textSecondary};
  }
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

const DeleteButton = styled.button`
  padding: 8px 16px;
  background: ${props => props.theme.danger};
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.danger}dd;
    transform: translateY(-2px);
  }
`;

const ProgressSection = styled.div`
  background: ${props => props.theme.surface};
  padding: 20px;
  border-radius: 12px;
  border: 1px solid ${props => props.theme.border};
  margin-bottom: 24px;
`;

const ProgressBar = styled.div`
  height: 8px;
  background: ${props => props.theme.border};
  border-radius: 4px;
  overflow: hidden;
  margin: 8px 0;

  .bar {
    height: 100%;
    background: ${props => props.theme.primary};
    border-radius: 4px;
    transition: width 0.5s ease;
  }
`;

const ProgressInfo = styled.div`
  display: flex;
  justify-content: space-between;
  color: ${props => props.theme.textSecondary};
  font-size: 0.9rem;
`;

const TasksList = styled.div`
  background: ${props => props.theme.surface};
  border-radius: 12px;
  border: 1px solid ${props => props.theme.border};
  overflow: hidden;
`;

const TaskItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid ${props => props.theme.border};
  transition: all 0.2s;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${props => props.theme.surface2};
  }

  .left {
    flex: 1;
  }

  .name {
    font-weight: 600;
    margin-bottom: 2px;
  }

  .description {
    font-size: 0.9rem;
    color: ${props => props.theme.textSecondary};
  }

  .date {
    font-size: 0.85rem;
    color: ${props => props.theme.textSecondary};
    margin-top: 4px;
  }

  .right {
    display: flex;
    align-items: center;
    gap: 12px;
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
  padding: 4px 12px;
  border: 2px solid ${props => {
    if (props.status === 'complete') return props.theme.success;
    if (props.status === 'missed') return props.theme.danger;
    return props.theme.border;
  }};
  background: transparent;
  border-radius: 6px;
  color: ${props => {
    if (props.status === 'complete') return props.theme.success;
    if (props.status === 'missed') return props.theme.danger;
    return props.theme.textSecondary;
  }};
  cursor: pointer;
  font-weight: 600;
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

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: ${props => props.theme.textSecondary};
`;

const GoalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGoal();
  }, [id]);

  const fetchGoal = async () => {
    try {
      const response = await api.get(`/goals/${id}`);
      setGoal(response.data.goal);
    } catch (error) {
      console.error('Error fetching goal:', error);
      toast.error('Failed to load goal');
      navigate('/goals');
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId, currentStatus) => {
    const newStatus = currentStatus === 'complete' ? 'pending' : 'complete';
    
    try {
      await api.put(`/goals/tasks/${taskId}`, { status: newStatus });
      toast.success(`Task marked as ${newStatus}`);
      fetchGoal();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const deleteGoal = async () => {
    if (!window.confirm('Are you sure you want to delete this goal? All tasks will be lost.')) {
      return;
    }

    try {
      await api.delete(`/goals/${id}`);
      toast.success('Goal deleted successfully');
      navigate('/goals');
    } catch (error) {
      toast.error('Failed to delete goal');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!goal) {
    return <div>Goal not found</div>;
  }

  const totalTasks = goal.tasks?.length || 0;
  const completedTasks = goal.tasks?.filter(t => t.status === 'complete').length || 0;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <BackButton onClick={() => navigate('/goals')}>
            <FiArrowLeft />
          </BackButton>
          <div>
            <h1>{goal.title}</h1>
            <div className="subtitle">{goal.description}</div>
            <div className="subtitle" style={{ fontSize: '0.85rem', marginTop: '4px' }}>
              <FiCalendar size={14} style={{ display: 'inline', marginRight: '4px' }} />
              {format(new Date(goal.startDate), 'MMM d, yyyy')} - {format(new Date(goal.endDate), 'MMM d, yyyy')}
            </div>
          </div>
        </HeaderLeft>
        <DeleteButton onClick={deleteGoal}>
          <FiTrash2 /> Delete
        </DeleteButton>
      </Header>

      <ProgressSection>
        <ProgressInfo>
          <span>Progress: {completedTasks}/{totalTasks} tasks completed</span>
          <span>{progress}%</span>
        </ProgressInfo>
        <ProgressBar>
          <div className="bar" style={{ width: `${progress}%` }} />
        </ProgressBar>
      </ProgressSection>

      <h3 style={{ marginBottom: '16px' }}>Tasks</h3>
      {totalTasks === 0 ? (
        <EmptyState>No tasks in this goal yet.</EmptyState>
      ) : (
        <TasksList>
          {goal.tasks.map((task) => (
            <TaskItem key={task._id}>
              <div className="left">
                <div className="name">{task.name}</div>
                {task.description && (
                  <div className="description">{task.description}</div>
                )}
                <div className="date">
                  📅 {format(new Date(task.dateToDo), 'EEEE, MMM d, yyyy')}
                </div>
              </div>
              <div className="right">
                <StatusBadge status={task.status}>
                  {task.status === 'complete' ? <FiCheckCircle /> : 
                   task.status === 'missed' ? <FiXCircle /> : <FiClock />}
                  {' '}{task.status}
                </StatusBadge>
                <StatusButton
                  status={task.status}
                  onClick={() => updateTaskStatus(task._id, task.status)}
                  disabled={task.status === 'missed'}
                >
                  {task.status === 'complete' ? 'Undo' : 'Complete'}
                </StatusButton>
              </div>
            </TaskItem>
          ))}
        </TasksList>
      )}
    </Container>
  );
};

export default GoalDetail;