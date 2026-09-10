import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiCheckCircle, FiClock, FiXCircle, FiTrash2 } from 'react-icons/fi';
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

  .subtitle {
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

const TopicsList = styled.div`
  background: ${props => props.theme.surface};
  border-radius: 12px;
  border: 1px solid ${props => props.theme.border};
  overflow: hidden;
`;

const TopicItem = styled.div`
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

  .name {
    font-weight: 600;
    margin-bottom: 2px;
  }

  .description {
    font-size: 0.9rem;
    color: ${props => props.theme.textSecondary};
  }

  .date {
    font-size: 0.8rem;
    color: ${props => props.theme.textSecondary};
    margin-top: 4px;
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
`;

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const response = await api.get(`/courses/${id}`);
      setCourse(response.data.course);
    } catch (error) {
      console.error('Error fetching course:', error);
      toast.error('Failed to load course');
      navigate('/areas');
    } finally {
      setLoading(false);
    }
  };

  const updateTopicStatus = async (topicId, currentStatus) => {
    const newStatus = currentStatus === 'complete' ? 'pending' : 'complete';
    
    try {
      await api.put(`/courses/topics/${topicId}`, { status: newStatus });
      toast.success(`Topic marked as ${newStatus}`);
      fetchCourse();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const deleteCourse = async () => {
    if (!window.confirm('Are you sure you want to delete this course? All topics will be lost.')) {
      return;
    }

    try {
      await api.delete(`/courses/${id}`);
      toast.success('Course deleted successfully');
      navigate('/areas');
    } catch (error) {
      toast.error('Failed to delete course');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!course) {
    return <div>Course not found</div>;
  }

  const completedTopics = course.topics?.filter(t => t.status === 'complete').length || 0;
  const totalTopics = course.topics?.length || 0;
  const progress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <BackButton onClick={() => navigate('/areas')}>
            <FiArrowLeft />
          </BackButton>
          <div>
            <h1>{course.title}</h1>
            <div className="subtitle">{course.description}</div>
            <div className="subtitle" style={{ fontSize: '0.85rem', marginTop: '4px' }}>
              📅 {format(new Date(course.startTime), 'MMM d, yyyy')} - {format(new Date(course.endTime), 'MMM d, yyyy')}
            </div>
          </div>
        </HeaderLeft>
        <DeleteButton onClick={deleteCourse}>
          <FiTrash2 /> Delete
        </DeleteButton>
      </Header>

      <ProgressSection>
        <ProgressInfo>
          <span>Progress: {completedTopics}/{totalTopics} topics completed</span>
          <span>{progress}%</span>
        </ProgressInfo>
        <ProgressBar>
          <div className="bar" style={{ width: `${progress}%` }} />
        </ProgressBar>
      </ProgressSection>

      <h3 style={{ marginBottom: '16px' }}>Topics</h3>
      {totalTopics === 0 ? (
        <EmptyState>No topics in this course yet.</EmptyState>
      ) : (
        <TopicsList>
          {course.topics.map((topic) => (
            <TopicItem key={topic._id}>
              <div className="left">
                <div className="name">{topic.name}</div>
                {topic.description && (
                  <div className="description">{topic.description}</div>
                )}
                <div className="date">
                  📅 {format(new Date(topic.dateToStudy), 'EEEE, MMM d, yyyy')}
                </div>
              </div>
              <div className="right">
                <StatusBadge status={topic.status}>
                  {topic.status === 'complete' ? <FiCheckCircle /> : 
                   topic.status === 'missed' ? <FiXCircle /> : <FiClock />}
                  {' '}{topic.status}
                </StatusBadge>
                <StatusButton
                  status={topic.status}
                  onClick={() => updateTopicStatus(topic._id, topic.status)}
                  disabled={topic.status === 'missed'}
                >
                  {topic.status === 'complete' ? 'Undo' : 'Complete'}
                </StatusButton>
              </div>
            </TopicItem>
          ))}
        </TopicsList>
      )}
    </Container>
  );
};

export default CourseDetail;