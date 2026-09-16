// pages/areas/AreaDetail.jsx - Complete Updated
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
  FiRefreshCw,
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
  flex-wrap: wrap;
  gap: 15px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  flex: 1;

  h1 {
    font-size: 2rem;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  p {
    color: ${props => props.theme.textSecondary};
    margin-top: 4px;
  }
`;

const ColorDot = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${props => props.$color || '#3B82F6'};
  display: inline-block;
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
  flex-shrink: 0;

  &:hover {
    background: ${props => props.theme.surface2};
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
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
  background: ${props => props.$primary ? props.theme.primary : props.theme.surface2};
  color: ${props => props.$primary ? 'white' : props.theme.text};
  text-decoration: none;
  font-size: 0.9rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadowHover};
  }

  &.danger {
    background: ${props => props.theme.surface2};
    color: ${props => props.theme.danger || '#ef4444'};

    &:hover {
      background: ${props => props.theme.danger || '#ef4444'};
      color: white;
    }
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
  padding: 20px;
  border-radius: 12px;
  border: 1px solid ${props => props.theme.border};
  text-align: center;

  .icon {
    font-size: 1.5rem;
    margin-bottom: 8px;
  }

  .value {
    font-size: 2rem;
    font-weight: 700;
    color: ${props => props.$color || props.theme.text};
  }

  .label {
    font-size: 0.85rem;
    color: ${props => props.theme.textSecondary};
    margin-top: 4px;
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
  flex-wrap: wrap;
  gap: 10px;

  h3 {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 1.1rem;
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
    margin-top: 4px;
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

  p {
    font-size: 0.9rem;
  }
`;

const AddButton = styled(Link)`
  background: ${props => props.theme.primary};
  color: white;
  padding: 8px 14px;
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

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 60px;
  color: ${props => props.theme.textSecondary};
  font-size: 1.1rem;
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
      setLoading(true);
      const response = await api.get(`/areas/${id}`, { 
        params: { includeItems: true } 
      });
      // Handle both response formats
      const areaData = response.data.data || response.data.area;
      setArea(areaData);
    } catch (error) {
      console.error('Error fetching area:', error);
      toast.error('Failed to load area');
      navigate('/areas');
    } finally {
      setLoading(false);
    }
  };

  const deleteArea = async () => {
    if (!window.confirm(`Are you sure you want to delete "${area?.name}"?\n\nAll associated books, courses, and goals will be lost.`)) {
      return;
    }

    try {
      await api.delete(`/areas/${id}`);
      toast.success('Area deleted successfully');
      navigate('/areas');
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Failed to delete area');
    }
  };

  if (loading) {
    return (
      <Container>
        <LoadingSpinner>Loading area details...</LoadingSpinner>
      </Container>
    );
  }

  if (!area) {
    return (
      <Container>
        <EmptyState>
          <h3>Area not found</h3>
          <p>The area you're looking for doesn't exist.</p>
        </EmptyState>
      </Container>
    );
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
            <h1>
              {area.icon && <span>{area.icon}</span>}
              <ColorDot $color={area.color} />
              {area.name}
            </h1>
            {area.description && <p>{area.description}</p>}
          </div>
        </HeaderLeft>
        <HeaderActions>
          <ActionButton onClick={fetchArea}>
            <FiRefreshCw /> Refresh
          </ActionButton>
          <ActionButton $primary as={Link} to={`/areas/${id}/edit`}>
            <FiEdit /> Edit
          </ActionButton>
          <ActionButton className="danger" onClick={deleteArea}>
            <FiTrash2 /> Delete
          </ActionButton>
        </HeaderActions>
      </Header>

      <StatsGrid>
        <StatCard $color="#a855f7">
          <div className="icon">📚</div>
          <div className="value">{totalCourses}</div>
          <div className="label">Courses</div>
        </StatCard>
        <StatCard $color="#3b82f6">
          <div className="icon">📖</div>
          <div className="value">{totalBooks}</div>
          <div className="label">Books</div>
        </StatCard>
        <StatCard $color="#f59e0b">
          <div className="icon">🎯</div>
          <div className="value">{totalGoals}</div>
          <div className="label">Goals</div>
        </StatCard>
      </StatsGrid>

      {/* Courses Section */}
      <Section>
        <SectionHeader>
          <h3>
            <FiBookOpen /> Courses
            <span className="count">({totalCourses})</span>
          </h3>
          <AddButton to={`/courses/create?areaId=${id}`}>
            <FiPlus /> Add Course
          </AddButton>
        </SectionHeader>
        {totalCourses === 0 ? (
          <EmptyState>
            <FiBookOpen />
            <p>No courses yet. Add your first course to start learning!</p>
          </EmptyState>
        ) : (
          <ItemGrid>
            {area.courses.map((course) => (
              <ItemCard key={course._id} to={`/courses/${course._id}`}>
                <div className="title">{course.title}</div>
                <div className="meta">
                  <span>{course.topics?.length || 0} topics</span>
                  <span>•</span>
                  <span>{Math.round(course.progress || 0)}%</span>
                </div>
                <div className="progress">
                  <div 
                    className="bar" 
                    style={{ width: `${course.progress || 0}%` }} 
                  />
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
          <AddButton to={`/books/create?areaId=${id}`}>
            <FiPlus /> Add Book
          </AddButton>
        </SectionHeader>
        {totalBooks === 0 ? (
          <EmptyState>
            <FiBook />
            <p>No books yet. Add your first book to start reading!</p>
          </EmptyState>
        ) : (
          <ItemGrid>
            {area.books.map((book) => (
              <ItemCard key={book._id} to={`/books/${book._id}`}>
                <div className="title">{book.title}</div>
                <div className="meta">
                  <span>by {book.author}</span>
                </div>
                <div className="meta">
                  <span>{book.pagesRead || 0}/{book.totalPages} pages</span>
                  <span>•</span>
                  <span>{Math.round(book.progress || 0)}%</span>
                </div>
                <div className="progress">
                  <div 
                    className="bar" 
                    style={{ width: `${book.progress || 0}%` }} 
                  />
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
          <AddButton to={`/goals/create?areaId=${id}`}>
            <FiPlus /> Add Goal
          </AddButton>
        </SectionHeader>
        {totalGoals === 0 ? (
          <EmptyState>
            <FiTarget />
            <p>No goals yet. Add your first goal to start tracking!</p>
          </EmptyState>
        ) : (
          <ItemGrid>
            {area.goals.map((goal) => (
              <ItemCard key={goal._id} to={`/goals/${goal._id}`}>
                <div className="title">{goal.title}</div>
                <div className="meta">
                  <span>{goal.tasks?.length || 0} tasks</span>
                  <span>•</span>
                  <span>{goal.status?.replace('_', ' ')}</span>
                </div>
                <div className="progress">
                  <div 
                    className="bar" 
                    style={{ width: `${goal.progress || 0}%` }} 
                  />
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
