import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FiPlus, FiBookOpen, FiArrowLeft, FiTrash2 } from 'react-icons/fi';
import { format } from 'date-fns';

const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;

  h1 {
    font-size: 2rem;
    display: flex;
    align-items: center;
    gap: 12px;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
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

const CreateButton = styled(Link)`
  background: ${props => props.theme.primary};
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.primaryDark};
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadowHover};
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
`;

const Card = styled.div`
  background: ${props => props.theme.surface};
  border-radius: 12px;
  border: 1px solid ${props => props.theme.border};
  padding: 24px;
  transition: all 0.3s;
  position: relative;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadowHover};
  }
`;

const CardTitle = styled(Link)`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${props => props.theme.text};
  text-decoration: none;
  display: block;
  margin-bottom: 8px;

  &:hover {
    color: ${props => props.theme.primary};
  }
`;

const CardDescription = styled.p`
  color: ${props => props.theme.textSecondary};
  font-size: 0.9rem;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CardMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid ${props => props.theme.border};
  font-size: 0.85rem;
  color: ${props => props.theme.textSecondary};
`;

const ProgressSection = styled.div`
  margin: 12px 0;
`;

const ProgressBar = styled.div`
  height: 6px;
  background: ${props => props.theme.border};
  border-radius: 3px;
  overflow: hidden;

  .bar {
    height: 100%;
    background: ${props => {
      const percent = props.percent || 0;
      if (percent >= 80) return props.theme.success;
      if (percent >= 50) return props.theme.warning;
      return props.theme.danger;
    }};
    border-radius: 3px;
    transition: width 0.5s ease;
    width: ${props => props.percent || 0}%;
  }
`;

const ProgressText = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: ${props => props.theme.textSecondary};
  margin-top: 4px;
`;

const TopicCount = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 10px;
  border-radius: 12px;
  background: ${props => props.theme.surface2};
  font-size: 0.8rem;
`;

const StatusDot = styled.span`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 4px;
  background: ${props => {
    if (props.status === 'complete') return props.theme.success;
    if (props.status === 'missed') return props.theme.danger;
    return props.theme.warning;
  }};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${props => props.theme.textSecondary};

  svg {
    font-size: 4rem;
    margin-bottom: 16px;
    opacity: 0.5;
  }

  h3 {
    color: ${props => props.theme.text};
    margin-bottom: 8px;
  }
`;

const FilterBar = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  padding: 6px 16px;
  border-radius: 20px;
  border: 1px solid ${props => props.active ? props.theme.primary : props.theme.border};
  background: ${props => props.active ? props.theme.primary : 'transparent'};
  color: ${props => props.active ? 'white' : props.theme.text};
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.85rem;

  &:hover {
    border-color: ${props => props.theme.primary};
  }
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 60px;
  color: ${props => props.theme.textSecondary};
`;

const CoursesList = () => {
  const navigate = useNavigate();
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState('all');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [areasLoaded, setAreasLoaded] = useState(false);

  // Step 1: Load areas on mount
  useEffect(() => {
    fetchAreas();
  }, []);

  // Step 2: Load courses whenever areas finish loading OR selectedArea changes
  useEffect(() => {
    if (!areasLoaded) return; // Wait for areas to load first

    if (selectedArea === 'all') {
      fetchAllCourses();
    } else {
      fetchCoursesByArea(selectedArea);
    }
  }, [selectedArea, areasLoaded]);

  const fetchAreas = async () => {
    try {
      const response = await api.get('/areas');
      setAreas(response.data.areas);
    } catch (error) {
      console.error('Error fetching areas:', error);
      toast.error('Failed to load areas');
      setAreas([]);
    } finally {
      setAreasLoaded(true); // Signal that areas are done loading
    }
  };

  const fetchAllCourses = async () => {
    try {
      setLoading(true);

      if (areas.length === 0) {
        setCourses([]);
        return;
      }

      const promises = areas.map(area => api.get(`/courses/area/${area._id}`));
      const responses = await Promise.all(promises);
      const allCourses = responses.flatMap(res => res.data.courses);
      setCourses(allCourses);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to load courses');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCoursesByArea = async (areaId) => {
    try {
      setLoading(true);
      const response = await api.get(`/courses/area/${areaId}`);
      setCourses(response.data.courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to load courses');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteCourse = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      await api.delete(`/courses/${id}`);
      toast.success('Course deleted successfully');
      if (selectedArea === 'all') {
        fetchAllCourses();
      } else {
        fetchCoursesByArea(selectedArea);
      }
    } catch (error) {
      toast.error('Failed to delete course');
    }
  };

  const getStatusSummary = (topics) => {
    const total = topics?.length || 0;
    const completed = topics?.filter(t => t.status === 'complete').length || 0;
    const missed = topics?.filter(t => t.status === 'missed').length || 0;
    const pending = total - completed - missed;
    return { total, completed, missed, pending };
  };

  // Show loading only while areas are loading initially
  if (!areasLoaded) {
    return (
      <Container>
        <LoadingSpinner>Loading areas...</LoadingSpinner>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <BackButton onClick={() => navigate('/areas')}>
            <FiArrowLeft />
          </BackButton>
          <h1>
            <FiBookOpen /> Courses
          </h1>
        </HeaderLeft>
        {selectedArea !== 'all' && (
          <CreateButton to={`/courses/create/${selectedArea}`}>
            <FiPlus /> New Course
          </CreateButton>
        )}
      </Header>

      <FilterBar>
        <FilterButton
          active={selectedArea === 'all'}
          onClick={() => setSelectedArea('all')}
        >
          All Areas
        </FilterButton>
        {areas.map(area => (
          <FilterButton
            key={area._id}
            active={selectedArea === area._id}
            onClick={() => setSelectedArea(area._id)}
          >
            {area.title}
          </FilterButton>
        ))}
      </FilterBar>

      {loading ? (
        <LoadingSpinner>Loading courses...</LoadingSpinner>
      ) : courses.length === 0 ? (
        <EmptyState>
          <FiBookOpen />
          <h3>No courses found</h3>
          <p>
            {selectedArea === 'all'
              ? areas.length === 0
                ? 'Create an area first to start adding courses'
                : 'No courses yet. Create a course in one of your areas to get started'
              : 'Create your first course in this area'}
          </p>
          {selectedArea !== 'all' && (
            <CreateButton
              to={`/courses/create/${selectedArea}`}
              style={{ marginTop: '16px', display: 'inline-flex' }}
            >
              <FiPlus /> Create Course
            </CreateButton>
          )}
        </EmptyState>
      ) : (
        <Grid>
          {courses.map((course) => {
            const stats = getStatusSummary(course.topics);
            const progress = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
            const area = areas.find(a => a._id === course.areaId);

            return (
              <Card key={course._id}>
                <CardTitle to={`/courses/${course._id}`}>
                  {course.title}
                </CardTitle>
                <CardDescription>{course.description}</CardDescription>

                <div style={{ fontSize: '0.85rem', color: '#9ca3af', marginBottom: '8px' }}>
                  📅 {format(new Date(course.startTime), 'MMM d')} - {format(new Date(course.endTime), 'MMM d, yyyy')}
                  {area && ` • ${area.title}`}
                </div>

                <TopicCount>
                  {stats.total} topics
                </TopicCount>

                <ProgressSection>
                  <ProgressBar percent={progress}>
                    <div className="bar" />
                  </ProgressBar>
                  <ProgressText>
                    <span>
                      <StatusDot status="complete" /> {stats.completed} done
                    </span>
                    <span>
                      <StatusDot status="pending" /> {stats.pending} pending
                    </span>
                    <span>
                      <StatusDot status="missed" /> {stats.missed} missed
                    </span>
                    <span>{progress}%</span>
                  </ProgressText>
                </ProgressSection>

                <CardMeta>
                  <span>Status: {course.status}% complete</span>
                  <button
                    onClick={() => deleteCourse(course._id, course.title)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#ef4444',
                      cursor: 'pointer',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => (e.target.style.background = '#ef444422')}
                    onMouseLeave={(e) => (e.target.style.background = 'transparent')}
                  >
                    <FiTrash2 />
                  </button>
                </CardMeta>
              </Card>
            );
          })}
        </Grid>
      )}
    </Container>
  );
};

export default CoursesList;