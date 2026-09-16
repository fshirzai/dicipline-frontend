// pages/areas/EditArea.jsx - Complete Updated
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiSave, FiTrash2 } from 'react-icons/fi';

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

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 10px;
`;

const DangerButton = styled.button`
  padding: 12px 24px;
  background: transparent;
  color: ${props => props.theme.danger || '#ef4444'};
  border: 1px solid ${props => props.theme.danger || '#ef4444'};
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
  flex-shrink: 0;

  &:hover {
    background: ${props => props.theme.danger || '#ef4444'};
    color: white;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
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
  padding: 60px;
  color: ${props => props.theme.textSecondary};
  font-size: 1.1rem;
`;

const AREA_COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444',
  '#14B8A6', '#F472B6', '#6366F1', '#F97316', '#06B6D4'
];

const EditArea = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: AREA_COLORS[0],
    icon: '',
    active: true,
  });

  useEffect(() => {
    fetchArea();
  }, [id]);

  const fetchArea = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/areas/${id}`);
      const area = response.data.data || response.data.area;
      
      if (!area) {
        throw new Error('Area not found');
      }

      setFormData({
        name: area.name || '',
        description: area.description || '',
        color: area.color || AREA_COLORS[0],
        icon: area.icon || '',
        active: area.active !== undefined ? area.active : true,
      });
    } catch (error) {
      console.error('Error fetching area:', error);
      setError('Failed to load area');
      toast.error('Failed to load area');
      setTimeout(() => navigate('/areas'), 1500);
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
      // Build payload with only provided fields
      const payload = {
        name: formData.name,
        description: formData.description || undefined,
        color: formData.color,
        icon: formData.icon || undefined,
        active: formData.active,
      };

      await api.put(`/areas/${id}`, payload);
      toast.success('Area updated successfully! ✅');
      navigate(`/areas/${id}`);
    } catch (error) {
      const message = error.response?.data?.error?.message || 
                      error.response?.data?.message || 
                      'Failed to update area';
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this area?\n\nAll associated books, courses, and goals will be lost.')) {
      return;
    }

    setDeleting(true);
    try {
      await api.delete(`/areas/${id}`);
      toast.success('Area deleted successfully');
      navigate('/areas');
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Failed to delete area');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <LoadingSpinner>Loading area details...</LoadingSpinner>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate(`/areas/${id}`)}>
          <FiArrowLeft />
        </BackButton>
        <h1>Edit Area</h1>
      </Header>

      <Form onSubmit={handleSubmit}>
        {error && <ErrorMessage>{error}</ErrorMessage>}

        <FormGroup>
          <label>Area Name *</label>
          <Input
            type="text"
            name="name"
            placeholder="Enter area name"
            value={formData.name}
            onChange={handleChange}
            required
            maxLength={100}
          />
        </FormGroup>

        <FormGroup>
          <label>Description</label>
          <TextArea
            name="description"
            placeholder="Describe your area"
            value={formData.description}
            onChange={handleChange}
            maxLength={500}
          />
        </FormGroup>

        <FormGroup>
          <label>Icon (emoji)</label>
          <Input
            type="text"
            name="icon"
            placeholder="📚"
            value={formData.icon}
            onChange={handleChange}
            maxLength={10}
          />
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

        <ButtonRow>
          <Button type="submit" disabled={saving || deleting}>
            <FiSave />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
          <DangerButton 
            type="button" 
            onClick={handleDelete} 
            disabled={saving || deleting}
          >
            <FiTrash2 />
            {deleting ? 'Deleting...' : 'Delete'}
          </DangerButton>
        </ButtonRow>
      </Form>
    </Container>
  );
};

export default EditArea;
