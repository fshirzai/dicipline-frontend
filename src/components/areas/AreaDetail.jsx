import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { 
  FiArrowLeft, 
  FiPlus, 
  FiBook, 
  FiBookOpen, 
  FiTarget,
  FiTrash2,
  FiEdit,
  FiCheckCircle,
  FiClock,
  FiXCircle
} from 'react-icons/fi';

const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;

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

  p {
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

const HeaderActions = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
  background: ${props => props.primary ? props.theme.primary : props.theme.surface2};
  color: ${props => props.primary ? 'white' : props.theme.text};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadowHover};
  }

  &.danger:hover {
    background: ${props => props.theme.danger};
    color: white;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background: ${props => props.theme.surface};
  padding: 16px;
  border-radius: 12px;
  border: 1px solid ${props => props.theme.border};
  text-align: center;

  .value {
    font-size: 1.8rem;
    font-weight: 700;
    color: ${props => props.theme.text};
  }

  .label {
    font-size: 0.85rem;
    color: ${props => props.theme.textSecondary};
    margin-top: 2px;
  }
`;

const Section = styled.div`
  background: ${props => props.theme.surface};
  border-radius: 12px;
  border: 1px solid ${props => props.theme.border};
  padding: 20px;
  margin-bottom: 20px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid ${props => props.theme.border};

  h3 {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .count {
    font-size: 0.85rem;
    font-weight: normal;
    color: ${props => props.theme.textSecondary};
  }
`;

const ItemGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 12px;
`;

const ItemCard = styled(Link)`
  background: ${props => props.theme.surface2};
  padding: 16px;
  border-radius: 8px;
  text-decoration: none;
  color: ${props => props.theme.text};
  border: 1px solid ${props => props.theme.border};
  transition: all 0.2s;

  &:hover {
    transform: translateX(4px);
    border-color: ${props => props.theme.primary};
  }

  .title {
    font-weight: 600;
    margin-bottom: 4px;
  }

  .meta {
    font-size: 0.85rem;
    color: ${props => props.theme.textSecondary};
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .progress {
    margin-top: 8px;
    height: 4px;
    background: ${props => props.theme.border};
    border-radius: 2px;
    overflow: hidden;

    .bar {
      height: 100%;
      background: ${props => props.theme.primary};
      border-radius: 2px;
      transition: width 0.3s;
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 30px;
  color: ${props => props.theme.textSecondary};

  svg {
    font-size: 2rem;
    margin-bottom: 8px;
    opacity: 0.5;
  }
`;

const AddButton = styled(Link)`
  background: ${props => props.theme.primary};
  color: white;
  padding: 6px 14px;
  border-radius: 6px;
  text-decoration: none;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.primaryDark};
    transform: translateY(-2px);
  }
`;

const AreaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [area, setArea] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArea();
  }, [id]);

  const fetchArea = async () => {
    try {
      const response = await api.get(`/areas/${id}`);
      setArea(response.data.area);
    } catch (error) {
      console.error('Error fetching area:', error);
      toast.error('Failed to load area');
      navigate('/areas');
    } finally {
      setLoading(false);
    }
  };

  const deleteArea = async () => {
    if (!window.confirm('Are you sure you want to delete this area? All associated data will be lost.')) {
      return;
    }

    try {
      await api.delete(`/areas/${id}`);
      toast.success('Area deleted successfully');
      navigate('/areas');
    } catch (error) {
      toast.error('Failed to delete area');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!area) {
    return <div>Area not found</div>;
  }

  const totalCourses = area.courses?.length || 0;
  const totalBooks = area.books?.length || 0;
  const totalGoals = area.goals?.length || 0;

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <BackButton onClick={() => navigate('/areas')}>
            <FiArrowLeft />
          </BackButton>
          <div>
            <h1>{area.title}</h1>
            <p>{area.description}</p>
          </div>
        </HeaderLeft>
        <HeaderActions>
          <ActionButton primary as={Link} to={`/areas/${id}/edit`}>
            <FiEdit /> Edit
          </ActionButton>
          <ActionButton className="danger" onClick={deleteArea}>
            <FiTrash2 /> Delete
          </ActionButton>
        </HeaderActions>
      </Header>

      <StatsGrid>
        <StatCard>
          <div className="value">{totalCourses}</div>
          <div className="label">📚 Courses</div>
        </StatCard>
        <StatCard>
          <div className="value">{totalBooks}</div>
          <div className="label">📖 Books</div>
        </StatCard>
        <StatCard>
          <div className="value">{totalGoals}</div>
          <div className="label">🎯 Goals</div>
        </StatCard>
      </StatsGrid>

      {/* Courses Section */}
      <Section>
        <SectionHeader>
          <h3>
            <FiBookOpen /> Courses
            <span className="count">({totalCourses})</span>
          </h3>
          <AddButton to={`/courses/create/${id}`}>
            <FiPlus /> Add Course
          </AddButton>
        </SectionHeader>
        {totalCourses === 0 ? (
          <EmptyState>
            <FiBookOpen />
            <p>No courses yet. Add your first course!</p>
          </EmptyState>
        ) : (
          <ItemGrid>
            {area.courses.map((course) => (
              <ItemCard key={course._id} to={`/courses/${course._id}`}>
                <div className="title">{course.title}</div>
                <div className="meta">
                  <span>{course.topics?.length || 0} topics</span>
                  <span>•</span>
                  <span>{course.status}% complete</span>
                </div>
                <div className="progress">
                  <div className="bar" style={{ width: `${course.status || 0}%` }} />
                </div>
              </ItemCard>
            ))}
          </ItemGrid>
        )}
      </Section>

      {/* Books Section */}
      <Section>
        <SectionHeader>
          <h3>
            <FiBook /> Books
            <span className="count">({totalBooks})</span>
          </h3>
          <AddButton to={`/books/create/${id}`}>
            <FiPlus /> Add Book
          </AddButton>
        </SectionHeader>
        {totalBooks === 0 ? (
          <EmptyState>
            <FiBook />
            <p>No books yet. Add your first book!</p>
          </EmptyState>
        ) : (
          <ItemGrid>
            {area.books.map((book) => (
              <ItemCard key={book._id} to={`/books/${book._id}`}>
                <div className="title">{book.title}</div>
                <div className="meta">
                  <span>by {book.author}</span>
                  <span>•</span>
                  <span>{book.pages} pages</span>
                </div>
                <div className="meta">
                  <span>{book.readingSessions?.length || 0} sessions</span>
                  <span>•</span>
                  <span>{book.status}% read</span>
                </div>
                <div className="progress">
                  <div className="bar" style={{ width: `${book.status || 0}%` }} />
                </div>
              </ItemCard>
            ))}
          </ItemGrid>
        )}
      </Section>

      {/* Goals Section */}
      <Section>
        <SectionHeader>
          <h3>
            <FiTarget /> Goals
            <span className="count">({totalGoals})</span>
          </h3>
          <AddButton to={`/goals/create/${id}`}>
            <FiPlus /> Add Goal
          </AddButton>
        </SectionHeader>
        {totalGoals === 0 ? (
          <EmptyState>
            <FiTarget />
            <p>No goals yet. Add your first goal!</p>
          </EmptyState>
        ) : (
          <ItemGrid>
            {area.goals.map((goal) => (
              <ItemCard key={goal._id} to={`/goals/${goal._id}`}>
                <div className="title">{goal.title}</div>
                <div className="meta">
                  <span>{goal.tasks?.length || 0} tasks</span>
                </div>
              </ItemCard>
            ))}
          </ItemGrid>
        )}
      </Section>
    </Container>
  );
};

export default AreaDetail;