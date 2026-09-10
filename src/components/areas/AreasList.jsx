import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import api from '../../services/api';
import { FiPlus, FiBook, FiBookOpen, FiTarget, FiTrash2, FiEdit } from 'react-icons/fi';
import toast from 'react-hot-toast';

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
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
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
  font-size: 1.25rem;
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
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Stats = styled.div`
  display: flex;
  gap: 20px;
  padding-top: 16px;
  border-top: 1px solid ${props => props.theme.border};
`;

const Stat = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${props => props.theme.textSecondary};
  font-size: 0.85rem;

  svg {
    color: ${props => props.theme.primary};
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
  position: absolute;
  top: 16px;
  right: 16px;
`;

const ActionButton = styled.button`
  background: transparent;
  border: none;
  color: ${props => props.theme.textSecondary};
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.surface2};
    color: ${props => props.theme[props.color] || props.theme.primary};
  }
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

const AreasList = () => {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAreas();
  }, []);

  const fetchAreas = async () => {
    try {
      const response = await api.get('/areas');
      setAreas(response.data.areas);
    } catch (error) {
      console.error('Error fetching areas:', error);
      toast.error('Failed to load areas');
    } finally {
      setLoading(false);
    }
  };

  const deleteArea = async (id) => {
    if (!window.confirm('Are you sure you want to delete this area? All associated data will be lost.')) {
      return;
    }

    try {
      await api.delete(`/areas/${id}`);
      toast.success('Area deleted successfully');
      fetchAreas();
    } catch (error) {
      toast.error('Failed to delete area');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Header>
        <h1>📚 My Areas</h1>
        <CreateButton to="/areas/create">
          <FiPlus /> New Area
        </CreateButton>
      </Header>

      {areas.length === 0 ? (
        <EmptyState>
          <FiBook />
          <h3>No areas yet</h3>
          <p>Create your first area to start tracking your progress</p>
          <CreateButton to="/areas/create" style={{ marginTop: '20px', display: 'inline-flex' }}>
            <FiPlus /> Create Area
          </CreateButton>
        </EmptyState>
      ) : (
        <Grid>
          {areas.map((area) => (
            <Card key={area._id}>
              <Actions>
                <ActionButton as={Link} to={`/areas/${area._id}`}>
                  <FiEdit />
                </ActionButton>
                <ActionButton color="danger" onClick={() => deleteArea(area._id)}>
                  <FiTrash2 />
                </ActionButton>
              </Actions>
              
              <CardTitle to={`/areas/${area._id}`}>{area.title}</CardTitle>
              <CardDescription>{area.description}</CardDescription>
              
              <Stats>
                <Stat>
                  <FiBookOpen /> {area.courses?.length || 0} Courses
                </Stat>
                <Stat>
                  <FiBook /> {area.books?.length || 0} Books
                </Stat>
                <Stat>
                  <FiTarget /> {area.goals?.length || 0} Goals
                </Stat>
              </Stats>
            </Card>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default AreasList;