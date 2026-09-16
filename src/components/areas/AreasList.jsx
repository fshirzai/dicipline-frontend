// pages/areas/AreasList.jsx - Complete Updated
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import api from '../../services/api';
import { 
  FiPlus, FiBook, FiBookOpen, FiTarget, FiTrash2, FiEdit, 
  FiRefreshCw, FiEye, FiEyeOff, FiAward 
} from 'react-icons/fi';
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
  flex-wrap: wrap;
  gap: 15px;

  h1 {
    font-size: 2rem;
    display: flex;
    align-items: center;
    gap: 10px;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
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

const SecondaryButton = styled.button`
  background: ${props => props.theme.surface2};
  color: ${props => props.theme.text};
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.border};
    transform: translateY(-2px);
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
  opacity: ${props => props.$inactive ? 0.6 : 1};

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadowHover};
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`;

const ColorDot = styled.div`
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: ${props => props.$color || '#3B82F6'};
  flex-shrink: 0;
`;

const Icon = styled.span`
  font-size: 1.5rem;
  flex-shrink: 0;
`;

const StatusBadge = styled.span`
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  background: ${props => props.$active 
    ? 'rgba(34, 197, 94, 0.15)' 
    : 'rgba(107, 114, 128, 0.15)'};
  color: ${props => props.$active 
    ? '#22c55e' 
    : '#6b7280'};
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
  min-height: 40px;
`;

const Stats = styled.div`
  display: flex;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid ${props => props.theme.border};
  flex-wrap: wrap;
`;

const Stat = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${props => props.theme.textSecondary};
  font-size: 0.85rem;
  padding: 4px 10px;
  background: ${props => props.theme.surface2};
  border-radius: 6px;

  svg {
    color: ${props => props.$color || props.theme.primary};
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 6px;
  position: absolute;
  top: 16px;
  right: 16px;
`;

const ActionButton = styled.button`
  background: transparent;
  border: none;
  color: ${props => props.theme.textSecondary};
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${props => props.theme.surface2};
    color: ${props => props.theme.primary};
  }

  &.danger:hover {
    background: rgba(239, 68, 68, 0.1);
    color: ${props => props.theme.danger || '#ef4444'};
  }

  &.toggle:hover {
    background: rgba(34, 197, 94, 0.1);
    color: #22c55e;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${props => props.theme.textSecondary};
  background: ${props => props.theme.surface};
  border-radius: 12px;
  border: 1px solid ${props => props.theme.border};

  svg {
    font-size: 4rem;
    margin-bottom: 16px;
    opacity: 0.5;
  }

  h3 {
    color: ${props => props.theme.text};
    margin-bottom: 8px;
    font-size: 1.5rem;
  }

  p {
    margin-bottom: 20px;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  color: ${props => props.theme.textSecondary};
  font-size: 1.1rem;
`;

const AreaStatsBar = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
  margin-bottom: 24px;
  padding: 20px;
  background: ${props => props.theme.surface};
  border-radius: 12px;
  border: 1px solid ${props => props.theme.border};
`;

const StatBox = styled.div`
  text-align: center;
  padding: 12px;

  .value {
    font-size: 1.8rem;
    font-weight: 700;
    color: ${props => props.$color || props.theme.text};
  }

  .label {
    font-size: 0.75rem;
    color: ${props => props.theme.textSecondary};
    margin-top: 4px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

const AreasList = () => {
  const navigate = useNavigate();
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInactive, setShowInactive] = useState(false);

  useEffect(() => {
    fetchAreas();
  }, []);

  const fetchAreas = async () => {
    try {
      setLoading(true);
      const response = await api.get('/areas', { 
        params: { activeOnly: false, includeStats: true } 
      });
      // Handle both response formats
      const areasData = response.data.data || response.data.areas || [];
      setAreas(areasData);
    } catch (error) {
      console.error('Error fetching areas:', error);
      toast.error('Failed to load areas');
    } finally {
      setLoading(false);
    }
  };

  const deleteArea = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?\n\nAll associated books, courses, and goals will be lost.`)) {
      return;
    }

    try {
      await api.delete(`/areas/${id}`);
      toast.success('Area deleted successfully');
      fetchAreas();
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Failed to delete area');
    }
  };

  const toggleActive = async (id) => {
    try {
      await api.post(`/areas/${id}/toggle`);
      toast.success('Area status updated');
      fetchAreas();
    } catch (error) {
      toast.error('Failed to toggle area');
    }
  };

  // Calculate overall stats
  const totalAreas = areas.length;
  const activeAreas = areas.filter(a => a.active).length;
  const totalBooks = areas.reduce((sum, a) => sum + (a.stats?.books || 0), 0);
  const totalCourses = areas.reduce((sum, a) => sum + (a.stats?.courses || 0), 0);
  const totalGoals = areas.reduce((sum, a) => sum + (a.stats?.goals || 0), 0);

  const displayAreas = showInactive ? areas : areas.filter(a => a.active);

  if (loading) {
    return (
      <Container>
        <LoadingContainer>Loading areas...</LoadingContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <h1>📚 My Areas</h1>
        <HeaderActions>
          <SecondaryButton onClick={fetchAreas}>
            <FiRefreshCw /> Refresh
          </SecondaryButton>
          <SecondaryButton onClick={() => setShowInactive(!showInactive)}>
            {showInactive ? <FiEyeOff /> : <FiEye />}
            {showInactive ? 'Hide Inactive' : 'Show All'}
          </SecondaryButton>
          <CreateButton to="/areas/create">
            <FiPlus /> New Area
          </CreateButton>
        </HeaderActions>
      </Header>

      {/* Stats Bar */}
      {totalAreas > 0 && (
        <AreaStatsBar>
          <StatBox>
            <div className="value">{totalAreas}</div>
            <div className="label">Total Areas</div>
          </StatBox>
          <StatBox $color="#22c55e">
            <div className="value">{activeAreas}</div>
            <div className="label">Active</div>
          </StatBox>
          <StatBox $color="#3b82f6">
            <div className="value">{totalBooks}</div>
            <div className="label">📖 Books</div>
          </StatBox>
          <StatBox $color="#a855f7">
            <div className="value">{totalCourses}</div>
            <div className="label">📚 Courses</div>
          </StatBox>
          <StatBox $color="#f59e0b">
            <div className="value">{totalGoals}</div>
            <div className="label">🎯 Goals</div>
          </StatBox>
        </AreaStatsBar>
      )}

      {displayAreas.length === 0 ? (
        <EmptyState>
          <FiBook />
          <h3>No areas yet</h3>
          <p>Create your first area to start tracking your progress</p>
          <CreateButton 
            to="/areas/create" 
            style={{ display: 'inline-flex', marginTop: '10px' }}
          >
            <FiPlus /> Create Area
          </CreateButton>
        </EmptyState>
      ) : (
        <Grid>
          {displayAreas.map((area) => (
            <Card key={area._id} $inactive={!area.active}>
              <Actions>
                <ActionButton 
                  className="toggle"
                  title={area.active ? 'Deactivate' : 'Activate'}
                  onClick={() => toggleActive(area._id)}
                >
                  {area.active ? <FiEyeOff /> : <FiEye />}
                </ActionButton>
                <ActionButton 
                  as={Link} 
                  to={`/areas/${area._id}/edit`}
                  title="Edit"
                >
                  <FiEdit />
                </ActionButton>
                <ActionButton 
                  className="danger"
                  title="Delete"
                  onClick={() => deleteArea(area._id, area.name)}
                >
                  <FiTrash2 />
                </ActionButton>
              </Actions>

              <CardHeader>
                <ColorDot $color={area.color} />
                {area.icon && <Icon>{area.icon}</Icon>}
                <StatusBadge $active={area.active}>
                  {area.active ? 'Active' : 'Inactive'}
                </StatusBadge>
              </CardHeader>

              <CardTitle to={`/areas/${area._id}`}>
                {area.name}
              </CardTitle>

              <CardDescription>
                {area.description || 'No description'}
              </CardDescription>

              <Stats>
                <Stat $color="#a855f7">
                  <FiBookOpen /> {area.stats?.courses || 0} Courses
                </Stat>
                <Stat $color="#3b82f6">
                  <FiBook /> {area.stats?.books || 0} Books
                </Stat>
                <Stat $color="#f59e0b">
                  <FiTarget /> {area.stats?.goals || 0} Goals
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
