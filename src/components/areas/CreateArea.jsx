// pages/areas/CreateArea.jsx - Complete Updated
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiSave } from 'react-icons/fi';

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
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${props => props.theme.surface2};
  }
`;

const Form = styled.form`
  background: ${props => props.theme.surface};
  padding: 30px;
  border-radius: 12px;
  border: 1px solid ${props => props.theme.border};
  box-shadow: ${props => props.theme.shadow};
`;

const FormGroup = styled.div`
  margin-bottom: 20px;

  label {
    display: block;
    margin-bottom: 6px;
    font-weight: 600;
    color: ${props => props.theme.text};
  }

  .help {
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

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  background: ${props => props.theme.inputBg};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  color: ${props => props.theme.text};
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  transition: all 0.2s;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.primary}33;
  }
`;

const ColorPicker = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 8px;
`;

const ColorOption = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 3px solid ${props => props.$selected ? props.theme.primary : 'transparent'};
  background: ${props => props.$color};
  cursor: pointer;
  transition: all 0.2s;
  padding: 0;

  &:hover {
    transform: scale(1.15);
  }

  &:focus {
    outline: none;
  }
`;

const Button = styled.button`
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

const AREA_COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444',
  '#14B8A6', '#F472B6', '#6366F1', '#F97316', '#06B6D4'
];

const CreateArea = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: AREA_COLORS[0],
    icon: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Send proper data to backend (using `name` not `title`)
      const payload = {
        name: formData.name,
        description: formData.description || undefined,
        color: formData.color,
        icon: formData.icon || undefined,
      };

      const response = await api.post('/areas', payload);
      
      if (response.data.success) {
        toast.success('Area created successfully! 🎉');
        navigate('/areas');
      } else {
        throw new Error(response.data.error?.message || 'Failed to create area');
      }
    } catch (error) {
      const message = error.response?.data?.error?.message || 
                      error.response?.data?.message || 
                      'Failed to create area';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate('/areas')}>
          <FiArrowLeft />
        </BackButton>
        <h1>Create New Area</h1>
      </Header>

      <Form onSubmit={handleSubmit}>
        {error && <ErrorMessage>{error}</ErrorMessage>}

        <FormGroup>
          <label>Area Name *</label>
          <Input
            type="text"
            name="name"
            placeholder="e.g., Islamic Studies, Career, Health"
            value={formData.name}
            onChange={handleChange}
            required
            maxLength={100}
          />
          <div className="help">Give your area a clear, memorable name</div>
        </FormGroup>

        <FormGroup>
          <label>Description</label>
          <TextArea
            name="description"
            placeholder="Describe what this area covers (e.g., 'Courses, books, and goals related to Islamic studies')"
            value={formData.description}
            onChange={handleChange}
            maxLength={500}
          />
          <div className="help">Optional - helps you remember the purpose</div>
        </FormGroup>

        <FormGroup>
          <label>Icon (emoji)</label>
          <Input
            type="text"
            name="icon"
            placeholder="📚 or 🎯 or 💪"
            value={formData.icon}
            onChange={handleChange}
            maxLength={10}
          />
          <div className="help">Optional - pick an emoji to represent this area</div>
        </FormGroup>

        <FormGroup>
          <label>Color</label>
          <ColorPicker>
            {AREA_COLORS.map((color) => (
              <ColorOption
                key={color}
                type="button"
                $color={color}
                $selected={formData.color === color}
                onClick={() => setFormData({ ...formData, color })}
              />
            ))}
          </ColorPicker>
        </FormGroup>

        <Button type="submit" disabled={loading}>
          <FiSave />
          {loading ? 'Creating...' : 'Create Area'}
        </Button>
      </Form>
    </Container>
  );
};

export default CreateArea;
