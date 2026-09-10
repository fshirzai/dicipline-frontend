import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 40px;
  color: ${props => props.theme.textSecondary};
`;

const EditArea = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });

  useEffect(() => {
    fetchArea();
  }, [id]);

  const fetchArea = async () => {
    try {
      const response = await api.get(`/areas/${id}`);
      const area = response.data.area;
      setFormData({
        title: area.title,
        description: area.description,
      });
    } catch (error) {
      console.error('Error fetching area:', error);
      setError('Failed to load area');
      toast.error('Failed to load area');
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
      await api.put(`/areas/${id}`, formData);
      toast.success('Area updated successfully! ✅');
      navigate(`/areas/${id}`);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update area');
      toast.error('Failed to update area');
    } finally {
      setSaving(false);
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
          <label>Area Title *</label>
          <Input
            type="text"
            name="title"
            placeholder="Enter area title"
            value={formData.title}
            onChange={handleChange}
            required
            maxLength={100}
          />
        </FormGroup>

        <FormGroup>
          <label>Description *</label>
          <TextArea
            name="description"
            placeholder="Describe your area"
            value={formData.description}
            onChange={handleChange}
            required
            maxLength={500}
          />
        </FormGroup>

        <Button type="submit" disabled={saving}>
          <FiSave />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </Form>
    </Container>
  );
};

export default EditArea;