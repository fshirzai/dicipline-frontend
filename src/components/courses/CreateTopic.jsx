import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiSave, FiPlus, FiTrash2 } from 'react-icons/fi';

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

const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  background: ${props => props.theme.inputBg};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  color: ${props => props.theme.text};
  font-size: 1rem;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
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
  min-height: 70px;
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const TopicRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 10px;
  padding: 12px;
  background: ${props => props.theme.surface2};
  border-radius: 8px;
  margin-bottom: 10px;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const RemoveButton = styled.button`
  background: transparent;
  border: none;
  color: ${props => props.theme.danger};
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.danger}22;
  }
`;

const AddButton = styled.button`
  padding: 8px 16px;
  background: ${props => props.theme.surface2};
  color: ${props => props.theme.text};
  border: 1px dashed ${props => props.theme.border};
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  transition: all 0.2s;

  &:hover {
    border-color: ${props => props.theme.primary};
    color: ${props => props.theme.primary};
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

const CreateTopic = () => {
  const { id: courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [topics, setTopics] = useState([{ name: '', description: '' }]);
  const [day, setDay] = useState('');
  const [position, setPosition] = useState('end');
  const [referenceTopicId, setReferenceTopicId] = useState('');

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      const res = await api.get(`/courses/${courseId}`);
      setCourse(res.data.course);

      // Default day: last topic's date + 1, or course end
      const topics = res.data.course.topics || [];
      if (topics.length > 0) {
        const maxDate = new Date(
          Math.max(...topics.map((t) => new Date(t.dateToStudy).getTime()))
        );
        maxDate.setDate(maxDate.getDate() + 1);
        setDay(maxDate.toISOString().split('T')[0]);
      } else {
        setDay(new Date(res.data.course.startTime).toISOString().split('T')[0]);
      }
    } catch (error) {
      toast.error('Failed to load course');
      navigate(`/courses/${courseId}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTopicChange = (index, field, value) => {
    const updated = [...topics];
    updated[index][field] = value;
    setTopics(updated);
  };

  const addTopicRow = () => {
    setTopics([...topics, { name: '', description: '' }]);
  };

  const removeTopicRow = (index) => {
    if (topics.length === 1) {
      toast.error('At least one topic is required');
      return;
    }
    setTopics(topics.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const validTopics = topics.filter((t) => t.name.trim());
    if (validTopics.length === 0) {
      toast.error('Please add at least one topic with a name');
      setSaving(false);
      return;
    }

    try {
      await api.post(`/courses/${courseId}/topics`, {
        topics: validTopics,
        day,
        position,
        referenceTopicId: position !== 'end' ? referenceTopicId : undefined,
      });
      toast.success('Topics added successfully! 🎉');
      navigate(`/courses/${courseId}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add topics');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner>Loading course...</LoadingSpinner>;
  if (!course) return <div>Course not found</div>;

  const existingTopics = course.topics || [];

  return (
    <Container>
      <Header>
        <BackButton to={`/courses/${courseId}`}>
          <FiArrowLeft />
        </BackButton>
        <div>
          <h1>Add Topics</h1>
          <div className="subtitle">to "{course.title}"</div>
        </div>
      </Header>

      <Form onSubmit={handleSubmit}>
        {/* Day selection */}
        <FormGroup>
          <label>Day to Study *</label>
          <Input
            type="date"
            value={day}
            onChange={(e) => setDay(e.target.value)}
            required
          />
          <div className="hint">
            Choose the day these topics will be assigned to.
          </div>
        </FormGroup>

        {/* Position selection */}
        <FormGroup>
          <label>Position in Course</label>
          <Select value={position} onChange={(e) => setPosition(e.target.value)}>
            <option value="end">At the end (after all topics)</option>
            <option value="before">Before a specific topic</option>
            <option value="after">After a specific topic</option>
          </Select>
        </FormGroup>

        {position !== 'end' && existingTopics.length > 0 && (
          <FormGroup>
            <label>Reference Topic *</label>
            <Select
              value={referenceTopicId}
              onChange={(e) => setReferenceTopicId(e.target.value)}
              required
            >
              <option value="">-- Select a topic --</option>
              {existingTopics.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name} ({new Date(t.dateToStudy).toLocaleDateString()})
                </option>
              ))}
            </Select>
          </FormGroup>
        )}

        {/* Topics */}
        <FormGroup>
          <label>Topics to Add ({topics.length})</label>
          {topics.map((topic, index) => (
            <TopicRow key={index}>
              <Input
                placeholder="Topic name"
                value={topic.name}
                onChange={(e) => handleTopicChange(index, 'name', e.target.value)}
                required
              />
              <Input
                placeholder="Description (optional)"
                value={topic.description}
                onChange={(e) =>
                  handleTopicChange(index, 'description', e.target.value)
                }
              />
              <RemoveButton
                type="button"
                onClick={() => removeTopicRow(index)}
                title="Remove"
              >
                <FiTrash2 />
              </RemoveButton>
            </TopicRow>
          ))}
          <AddButton type="button" onClick={addTopicRow} style={{ marginTop: '10px' }}>
            <FiPlus /> Add Another Topic
          </AddButton>
        </FormGroup>

        <SubmitButton type="submit" disabled={saving}>
          <FiSave />
          {saving ? 'Saving...' : 'Add Topics'}
        </SubmitButton>
      </Form>
    </Container>
  );
};

export default CreateTopic;