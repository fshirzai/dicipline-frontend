import React, { useState } from 'react';
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

const CreateBook = () => {
  const { areaId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    pages: '',
    startDate: '',
    endDate: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        ...formData,
        areaId,
        pages: parseInt(formData.pages),
      };
      
      await api.post('/books', data);
      toast.success('Book created successfully! 📚');
      navigate(`/areas/${areaId}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create book');
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
        <h1>Add New Book</h1>
      </Header>

      <Form onSubmit={handleSubmit}>
        <InfoBox>
          💡 <strong>Tip:</strong> Pages will be automatically divided across the days between start and end date.
        </InfoBox>

        <FormGroup>
          <label>Book Title *</label>
          <Input
            type="text"
            name="title"
            placeholder="e.g., 'The Sealed Nectar'"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <label>Author *</label>
          <Input
            type="text"
            name="author"
            placeholder="e.g., 'Safi-ur-Rahman Al-Mubarakpuri'"
            value={formData.author}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <label>Total Pages *</label>
          <Input
            type="number"
            name="pages"
            placeholder="e.g., 300"
            value={formData.pages}
            onChange={handleChange}
            required
            min="1"
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

        <SubmitButton type="submit" disabled={loading}>
          <FiSave />
          {loading ? 'Creating...' : 'Create Book'}
        </SubmitButton>
      </Form>
    </Container>
  );
};

export default CreateBook;