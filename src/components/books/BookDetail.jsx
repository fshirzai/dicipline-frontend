import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiCheckCircle, FiClock, FiXCircle, FiTrash2, FiUser, FiCalendar, FiEdit, FiPlus } from 'react-icons/fi';
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
  flex-wrap: wrap;
  gap: 15px;

  @media (max-width: 768px) {
    flex-direction: column;
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

  .author {
    display: flex;
    align-items: center;
    gap: 6px;
    color: ${props => props.theme.textSecondary};
    margin-top: 4px;
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

const HeaderActions = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const EditButton = styled(Link)`
  padding: 8px 16px;
  background: ${props => props.theme.primary};
  color: white;
  border-radius: 6px;
  text-decoration: none;
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

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  h3 {
    font-size: 1.2rem;
  }
`;

const AddButton = styled(Link)`
  padding: 8px 16px;
  background: ${props => props.theme.primary};
  color: white;
  border-radius: 6px;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.primaryDark};
    transform: translateY(-2px);
  }
`;

const SessionsList = styled.div`
  background: ${props => props.theme.surface};
  border-radius: 12px;
  border: 1px solid ${props => props.theme.border};
  overflow: hidden;
`;

const SessionItem = styled.div`
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

  .pages {
    font-weight: 600;
    margin-bottom: 2px;
  }

  .date {
    font-size: 0.85rem;
    color: ${props => props.theme.textSecondary};
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

  p {
    margin-bottom: 16px;
  }
`;

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      const response = await api.get(`/books/${id}`);
      setBook(response.data.book);
    } catch (error) {
      console.error('Error fetching book:', error);
      toast.error('Failed to load book');
      navigate('/books');
    } finally {
      setLoading(false);
    }
  };

  const updateSessionStatus = async (sessionId, currentStatus) => {
    const newStatus = currentStatus === 'complete' ? 'pending' : 'complete';

    try {
      await api.put(`/books/reading-sessions/${sessionId}`, { status: newStatus });
      toast.success(`Session marked as ${newStatus}`);
      fetchBook();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const deleteSession = async (sessionId, pageStart, pageEnd) => {
    if (!window.confirm(`Delete reading session "Pages ${pageStart}-${pageEnd}"?`)) return;

    try {
      await api.delete(`/books/reading-sessions/${sessionId}`);
      toast.success('Reading session deleted');
      fetchBook();
    } catch (error) {
      toast.error('Failed to delete session');
    }
  };

  const deleteBook = async () => {
    if (!window.confirm('Are you sure you want to delete this book? All reading sessions will be lost.')) {
      return;
    }

    try {
      await api.delete(`/books/${id}`);
      toast.success('Book deleted successfully');
      navigate('/books');
    } catch (error) {
      toast.error('Failed to delete book');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!book) {
    return <div>Book not found</div>;
  }

  const totalSessions = book.readingSessions?.length || 0;
  const completedSessions = book.readingSessions?.filter(s => s.status === 'complete').length || 0;
  const progress = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <BackButton onClick={() => navigate('/books')}>
            <FiArrowLeft />
          </BackButton>
          <div>
            <h1>{book.title}</h1>
            <div className="author">
              <FiUser size={14} /> {book.author}
            </div>
            <div className="subtitle" style={{ marginTop: '4px' }}>
              📄 {book.pages} pages •
              <FiCalendar size={14} style={{ display: 'inline', marginLeft: '8px', marginRight: '4px' }} />
              {format(new Date(book.startDate), 'MMM d, yyyy')} - {format(new Date(book.endDate), 'MMM d, yyyy')}
            </div>
          </div>
        </HeaderLeft>
        <HeaderActions>
          <EditButton to={`/books/${id}/edit`}>
            <FiEdit /> Edit Book
          </EditButton>
          <DeleteButton onClick={deleteBook}>
            <FiTrash2 /> Delete
          </DeleteButton>
        </HeaderActions>
      </Header>

      <ProgressSection>
        <ProgressInfo>
          <span>Progress: {completedSessions}/{totalSessions} sessions completed</span>
          <span>{progress}%</span>
        </ProgressInfo>
        <ProgressBar>
          <div className="bar" style={{ width: `${progress}%` }} />
        </ProgressBar>
      </ProgressSection>

      <SectionHeader>
        <h3>Reading Sessions ({totalSessions})</h3>
        <AddButton to={`/books/${id}/sessions/create`}>
          <FiPlus /> Add Session
        </AddButton>
      </SectionHeader>

      {totalSessions === 0 ? (
        <EmptyState>
          <p>No reading sessions for this book yet.</p>
          <AddButton to={`/books/${id}/sessions/create`} style={{ display: 'inline-flex' }}>
            <FiPlus /> Add First Session
          </AddButton>
        </EmptyState>
      ) : (
        <SessionsList>
          {book.readingSessions.map((session) => (
            <SessionItem key={session._id}>
              <div className="left">
                <div className="pages">
                  Pages {session.pageStart} - {session.pageEnd}
                </div>
                <div className="date">
                  📅 {format(new Date(session.date), 'EEEE, MMM d, yyyy')}
                </div>
              </div>
              <div className="right">
                <StatusBadge status={session.status}>
                  {session.status === 'complete' ? <FiCheckCircle /> :
                   session.status === 'missed' ? <FiXCircle /> : <FiClock />}
                  {' '}{session.status}
                </StatusBadge>
                <StatusButton
                  status={session.status}
                  onClick={() => updateSessionStatus(session._id, session.status)}
                  disabled={session.status === 'missed'}
                >
                  {session.status === 'complete' ? 'Undo' : 'Complete'}
                </StatusButton>
                <button
                  onClick={() => deleteSession(session._id, session.pageStart, session.pageEnd)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#ef4444',
                    cursor: 'pointer',
                    padding: '6px',
                    borderRadius: '6px',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => (e.target.style.background = '#ef444422')}
                  onMouseLeave={(e) => (e.target.style.background = 'transparent')}
                  title="Delete session"
                >
                  <FiTrash2 />
                </button>
              </div>
            </SessionItem>
          ))}
        </SessionsList>
      )}
    </Container>
  );
};

export default BookDetail;