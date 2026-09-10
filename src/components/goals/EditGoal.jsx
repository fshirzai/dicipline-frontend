import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import { format } from 'date-fns';

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
  margin-top: 8px;

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

const ErrorMessage = styled.div`
  background: ${props => props.theme.danger}22;
  color: ${props => props.theme.danger};
  padding: 10px;
  border-radius: 8px;
  font-size: 0.9rem;
  margin-bottom: 16px;
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 40px;
  color: ${props => props.theme.textSecondary};
`;

const EditGoal = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    fetchGoal();
  }, [id]);

  const fetchGoal = async () => {
    try {
      const response = await api.get(`/goals/${id}`);
      const goal = response.data.goal;
      setFormData({
        title: goal.title,
        description: goal.description,
        startDate: format(new Date(goal.startDate), 'yyyy-MM-dd'),
        endDate: format(new Date(goal.endDate), 'yyyy-MM-dd'),
      });
    } catch (error) {
      console.error('Error fetching goal:', error);
      setError('Failed to load goal');
      toast.error('Failed to load goal');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      await api.put(`/goals/${id}`, formData);
      toast.success('Goal updated successfully! ✅');
      navigate(`/goals/${id}`);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update goal');
      toast.error('Failed to update goal');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <LoadingSpinner>Loading goal details...</LoadingSpinner>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate(`/goals/${id}`)}>
          <FiArrowLeft />
        </BackButton>
        <h1>Edit Goal</h1>
      </Header>

      <Form onSubmit={handleSubmit}>
        {error && <ErrorMessage>{error}</ErrorMessage>}

        <FormGroup>
          <label>Goal Title *</label>
          <Input
            type="text"
            name="title"
            placeholder="Enter goal title"
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

        <SubmitButton type="submit" disabled={saving}>
          <FiSave />
          {saving ? 'Saving...' : 'Save Changes'}
        </SubmitButton>
      </Form>
    </Container>
  );
};

export default EditGoal;