import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
    font-size: 0.85rem;
    color: ${props => props.theme.textSecondary};
    margin-top: 6px;
    line-height: 1.5;
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

const InfoBox = styled.div`
  background: ${props => props.theme.primary}11;
  border-left: 4px solid ${props => props.theme.primary};
  padding: 14px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 0.9rem;
  color: ${props => props.theme.textSecondary};
  line-height: 1.6;

  strong {
    color: ${props => props.theme.primary};
  }

  .big {
    font-size: 1.1rem;
    font-weight: 700;
    color: ${props => props.theme.text};
    display: block;
    margin: 4px 0;
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

const CreateSession = () => {
  const { id: bookId } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [date, setDate] = useState('');

  useEffect(() => {
    fetchBook();
  }, [bookId]);

  const fetchBook = async () => {
    try {
      const res = await api.get(`/books/${bookId}`);
      setBook(res.data.book);

      const sessions = res.data.book.readingSessions || [];
      if (sessions.length > 0) {
        const lastDate = new Date(
          Math.max(...sessions.map((s) => new Date(s.date).getTime()))
        );
        lastDate.setDate(lastDate.getDate() + 1);
        setDate(lastDate.toISOString().split('T')[0]);
      } else {
        setDate(new Date(res.data.book.startDate).toISOString().split('T')[0]);
      }
    } catch (error) {
      toast.error('Failed to load book');
      navigate(`/books/${bookId}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    if (!date) {
      toast.error('Please select a day');
      setSaving(false);
      return;
    }

    try {
      await api.post(`/books/${bookId}/sessions`, { date });
      toast.success('Day added! Pages recalculated. 📖');
      navigate(`/books/${bookId}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add session');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner>Loading book...</LoadingSpinner>;
  if (!book) return <div>Book not found</div>;

  const sessions = book.readingSessions || [];
  const totalPages = book.pages;
  const newTotalDays = sessions.length + 1;
  const newPagesPerDay = Math.ceil(totalPages / newTotalDays);

  return (
    <Container>
      <Header>
        <BackButton to={`/books/${bookId}`}>
          <FiArrowLeft />
        </BackButton>
        <div>
          <h1>Add Reading Day</h1>
          <div className="subtitle">to "{book.title}"</div>
        </div>
      </Header>

      <Form onSubmit={handleSubmit}>
        <InfoBox>
          <strong>📚 Book:</strong> {book.title}
          <br />
          <strong>Total pages:</strong> {totalPages}
          <br />
          <strong>Current days:</strong> {sessions.length}
          {sessions.length > 0 && (
            <>
              {' '}
              • Each day ≈{' '}
              {Math.ceil(totalPages / sessions.length)} pages
            </>
          )}
          <span className="big">
            ➕ After adding this day: {newTotalDays} days → {newPagesPerDay} pages/day
          </span>
          <em>
            The system will automatically recalculate and redistribute pages
            across all days so the whole book fits evenly.
          </em>
        </InfoBox>

        <FormGroup>
          <label>Day to Read *</label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <div className="hint">
            Pick the day for this reading session. You can only add one day at a time.
          </div>
        </FormGroup>

        <SubmitButton type="submit" disabled={saving}>
          <FiSave />
          {saving ? 'Adding...' : 'Add Day & Recalculate'}
        </SubmitButton>
      </Form>
    </Container>
  );
};

export default CreateSession;