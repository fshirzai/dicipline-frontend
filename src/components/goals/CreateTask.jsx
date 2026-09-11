import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiSave, FiPlus, FiTrash2 } from 'react-icons/fi';

const Container = styled.div`
  padding: 20px;
  max-width: 700px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 30px;

  h1 {
    font-size: 1.8rem;
  }

  .subtitle {
    font-size: 0.9rem;
    color: ${props => props.theme.textSecondary};
    margin-top: 4px;
  }
`;

const BackButton = styled(Link)`
  background: transparent;
  border: none;
  color: ${props => props.theme.text};
  font-size: 1.5rem;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  text-decoration: none;

  &:hover {
    background: ${props => props.theme.surface2};
  }
`;

const Form = styled.form`
  background: ${props => props.theme.surface};
  padding: 24px;
  border-radius: 12px;
  border: 1px solid ${props => props.theme.border};
`;

const FormGroup = styled.div`
  margin-bottom: 20px;

  label {
    display: block;
    margin-bottom: 6px;
    font-weight: 600;
    color: ${props => props.theme.text};
  }

  .hint {
    font-size: 0.8rem;
    color: ${props => props.theme.textSecondary};
    margin-top: 4px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  background: ${props => props.theme.inputBg};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  color: ${props => props.theme.text};
  font-size: 1rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.primary}33;
  }
`;

const TaskRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 10px;
  padding: 12px;
  background: ${props => props.theme.surface2};
  border-radius: 8px;
  margin-bottom: 10px;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const RemoveButton = styled.button`
  background: transparent;
  border: none;
  color: ${props => props.theme.danger};
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.danger}22;
  }
`;

const AddButton = styled.button`
  padding: 8px 16px;
  background: ${props => props.theme.surface2};
  color: ${props => props.theme.text};
  border: 1px dashed ${props => props.theme.border};
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  transition: all 0.2s;

  &:hover {
    border-color: ${props => props.theme.primary};
    color: ${props => props.theme.primary};
  }
`;

const InfoBox = styled.div`
  background: ${props => props.theme.primary}11;
  border-left: 4px solid ${props => props.theme.primary};
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 0.9rem;
  color: ${props => props.theme.textSecondary};

  strong {
    color: ${props => props.theme.primary};
  }
`;

const SubmitButton = styled.button`
  padding: 12px 24px;
  background: ${props => props.theme.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  justify-content: center;
  margin-top: 12px;

  &:hover {
    background: ${props => props.theme.primaryDark};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 60px;
  color: ${props => props.theme.textSecondary};
`;

const CreateTask = () => {
  const { id: goalId } = useParams();
  const navigate = useNavigate();
  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [tasks, setTasks] = useState([{ name: '', description: '' }]);
  const [day, setDay] = useState('');

  useEffect(() => {
    fetchGoal();
  }, [goalId]);

  const fetchGoal = async () => {
    try {
      const res = await api.get(`/goals/${goalId}`);
      setGoal(res.data.goal);

      const tasks = res.data.goal.tasks || [];
      if (tasks.length > 0) {
        const maxDate = new Date(
          Math.max(...tasks.map((t) => new Date(t.dateToDo).getTime()))
        );
        maxDate.setDate(maxDate.getDate() + 1);
        setDay(maxDate.toISOString().split('T')[0]);
      } else {
        setDay(new Date(res.data.goal.startDate).toISOString().split('T')[0]);
      }
    } catch (error) {
      toast.error('Failed to load goal');
      navigate(`/goals/${goalId}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskChange = (index, field, value) => {
    const updated = [...tasks];
    updated[index][field] = value;
    setTasks(updated);
  };

  const addTaskRow = () => {
    setTasks([...tasks, { name: '', description: '' }]);
  };

  const removeTaskRow = (index) => {
    if (tasks.length === 1) {
      toast.error('At least one task is required');
      return;
    }
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const validTasks = tasks.filter((t) => t.name.trim());
    if (validTasks.length === 0) {
      toast.error('Please add at least one task with a name');
      setSaving(false);
      return;
    }

    if (!day) {
      toast.error('Please select a day');
      setSaving(false);
      return;
    }

    try {
      await api.post(`/goals/${goalId}/tasks`, {
        tasks: validTasks,
        day,
      });
      toast.success('Tasks added successfully! ✅');
      navigate(`/goals/${goalId}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add tasks');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner>Loading goal...</LoadingSpinner>;
  if (!goal) return <div>Goal not found</div>;

  const existingTasks = goal.tasks || [];

  return (
    <Container>
      <Header>
        <BackButton to={`/goals/${goalId}`}>
          <FiArrowLeft />
        </BackButton>
        <div>
          <h1>Add Tasks</h1>
          <div className="subtitle">to "{goal.title}"</div>
        </div>
      </Header>

      <Form onSubmit={handleSubmit}>
        <InfoBox>
          <strong>📋 Goal:</strong> {goal.title}
          <br />
          <strong>Existing tasks:</strong> {existingTasks.length}
          <br />
          <strong>Period:</strong>{' '}
          {new Date(goal.startDate).toLocaleDateString()} -{' '}
          {new Date(goal.endDate).toLocaleDateString()}
        </InfoBox>

        <FormGroup>
          <label>Day to Do *</label>
          <Input
            type="date"
            value={day}
            onChange={(e) => setDay(e.target.value)}
            required
          />
          <div className="hint">
            Choose the day these tasks will be assigned to.
          </div>
        </FormGroup>

        <FormGroup>
          <label>Tasks to Add ({tasks.length})</label>
          {tasks.map((task, index) => (
            <TaskRow key={index}>
              <Input
                placeholder="Task name"
                value={task.name}
                onChange={(e) => handleTaskChange(index, 'name', e.target.value)}
                required
              />
              <Input
                placeholder="Description (optional)"
                value={task.description}
                onChange={(e) =>
                  handleTaskChange(index, 'description', e.target.value)
                }
              />
              <RemoveButton
                type="button"
                onClick={() => removeTaskRow(index)}
                title="Remove"
              >
                <FiTrash2 />
              </RemoveButton>
            </TaskRow>
          ))}
          <AddButton type="button" onClick={addTaskRow} style={{ marginTop: '10px' }}>
            <FiPlus /> Add Another Task
          </AddButton>
        </FormGroup>

        <SubmitButton type="submit" disabled={saving}>
          <FiSave />
          {saving ? 'Saving...' : 'Add Tasks'}
        </SubmitButton>
      </Form>
    </Container>
  );
};

export default CreateTask;