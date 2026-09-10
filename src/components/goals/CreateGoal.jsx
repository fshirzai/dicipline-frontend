import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiSave, FiPlus, FiTrash2 } from 'react-icons/fi';

const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 30px;

  h1 {
    font-size: 2rem;
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

const Form = styled.form`
  background: ${props => props.theme.surface};
  padding: 30px;
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
    font-size: 0.85rem;
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

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  background: ${props => props.theme.inputBg};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  color: ${props => props.theme.text};
  font-size: 1rem;
  min-height: 80px;
  resize: vertical;
  transition: all 0.2s;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.primary}33;
  }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const TasksSection = styled.div`
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid ${props => props.theme.border};
`;

const TasksHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  h3 {
    font-size: 1.1rem;
  }
`;

const AddTaskButton = styled.button`
  padding: 8px 16px;
  background: ${props => props.theme.primary};
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
    background: ${props => props.theme.primaryDark};
    transform: translateY(-2px);
  }
`;

const TaskItem = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 12px;
  padding: 12px;
  background: ${props => props.theme.surface2};
  border-radius: 8px;
  margin-bottom: 12px;
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
  margin-top: 24px;

  &:hover {
    background: ${props => props.theme.primaryDark};
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadowHover};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const InfoBox = styled.div`
  background: ${props => props.theme.primary}11;
  border: 1px solid ${props => props.theme.primary}33;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
  color: ${props => props.theme.textSecondary};
  font-size: 0.9rem;

  strong {
    color: ${props => props.theme.primary};
  }
`;

const CreateGoal = () => {
  const { areaId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
  });
  const [tasks, setTasks] = useState([{ name: '', description: '' }]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleTaskChange = (index, field, value) => {
    const updated = [...tasks];
    updated[index][field] = value;
    setTasks(updated);
  };

  const addTask = () => {
    setTasks([...tasks, { name: '', description: '' }]);
  };

  const removeTask = (index) => {
    if (tasks.length === 1) {
      toast.error('You need at least one task');
      return;
    }
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate tasks
    const validTasks = tasks.filter(t => t.name.trim());
    if (validTasks.length === 0) {
      toast.error('Please add at least one task with a name');
      setLoading(false);
      return;
    }

    const data = {
      ...formData,
      areaId,
      tasks: validTasks,
    };

    try {
      await api.post('/goals', data);
      toast.success('Goal created successfully! 🎯');
      navigate(`/areas/${areaId}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create goal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate(`/areas/${areaId}`)}>
          <FiArrowLeft />
        </BackButton>
        <h1>Create New Goal</h1>
      </Header>

      <Form onSubmit={handleSubmit}>
        <InfoBox>
          💡 <strong>Tip:</strong> Tasks will be automatically assigned to days between start and end date.
        </InfoBox>

        <FormGroup>
          <label>Goal Title *</label>
          <Input
            type="text"
            name="title"
            placeholder="e.g., 'Memorize 30 Hadith'"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <label>Description *</label>
          <TextArea
            name="description"
            placeholder="Describe your goal"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <Row>
          <FormGroup>
            <label>Start Date *</label>
            <Input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <label>End Date *</label>
            <Input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
            />
          </FormGroup>
        </Row>

        <TasksSection>
          <TasksHeader>
            <h3>✅ Tasks</h3>
            <AddTaskButton type="button" onClick={addTask}>
              <FiPlus /> Add Task
            </AddTaskButton>
          </TasksHeader>

          {tasks.map((task, index) => (
            <TaskItem key={index}>
              <Input
                placeholder="Task name"
                value={task.name}
                onChange={(e) => handleTaskChange(index, 'name', e.target.value)}
                required
              />
              <Input
                placeholder="Task description (optional)"
                value={task.description}
                onChange={(e) => handleTaskChange(index, 'description', e.target.value)}
              />
              <RemoveButton type="button" onClick={() => removeTask(index)}>
                <FiTrash2 />
              </RemoveButton>
            </TaskItem>
          ))}

          <div className="hint" style={{ marginTop: '8px', color: '#9ca3af', fontSize: '0.85rem' }}>
            Tasks will be distributed across the available days.
          </div>
        </TasksSection>

        <SubmitButton type="submit" disabled={loading}>
          <FiSave />
          {loading ? 'Creating...' : 'Create Goal'}
        </SubmitButton>
      </Form>
    </Container>
  );
};

export default CreateGoal;