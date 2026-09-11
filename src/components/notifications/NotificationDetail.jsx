import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import {
  FiArrowLeft,
  FiTrash2,
  FiCheckCircle,
  FiClock,
  FiBook,
  FiBookOpen,
  FiTarget,
  FiSend,
  FiBell,
  FiUser,
} from 'react-icons/fi';

const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 12px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 12px;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  h1 {
    font-size: 1.4rem;

    @media (max-width: 768px) {
      font-size: 1.1rem;
    }
  }
`;

const BackButton = styled.button`
  background: transparent;
  border: none;
  color: ${(props) => props.theme.text};
  font-size: 1.4rem;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s;
  display: flex;
  align-items: center;

  &:hover {
    background: ${(props) => props.theme.surface2};
  }
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  background: transparent;
  border: 1px solid ${(props) => props.theme.border};
  border-radius: 8px;
  color: ${(props) => props.theme.text};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.2s;

  &:hover {
    background: ${(props) => props.theme.primary};
    color: white;
    border-color: ${(props) => props.theme.primary};
  }

  &.delete:hover {
    background: ${(props) => props.theme.danger};
    border-color: ${(props) => props.theme.danger};
  }
`;

const Card = styled.div`
  background: ${(props) => props.theme.surface};
  border: 1px solid ${(props) => props.theme.border};
  border-radius: 16px;
  overflow: hidden;
  box-shadow: ${(props) => props.theme.shadow};
`;

const CardHeader = styled.div`
  padding: 24px 24px 20px;
  background: ${(props) => {
    if (props.type === 'admin_broadcast')
      return 'linear-gradient(135deg, #4f46e5, #7c3aed)';
    return props.theme.surface2;
  }};
  color: ${(props) =>
    props.type === 'admin_broadcast' ? 'white' : props.theme.text};
  border-bottom: 1px solid ${(props) => props.theme.border};

  .type-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 700;
    background: ${(props) =>
      props.type === 'admin_broadcast'
        ? 'rgba(255,255,255,0.2)'
        : props.theme.primary + '22'};
    color: ${(props) =>
      props.type === 'admin_broadcast' ? 'white' : props.theme.primary};
    margin-bottom: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  h2 {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 8px;
    line-height: 1.3;

    @media (max-width: 768px) {
      font-size: 1.2rem;
    }
  }

  .meta {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 0.85rem;
    opacity: 0.85;
    flex-wrap: wrap;

    span {
      display: flex;
      align-items: center;
      gap: 4px;
    }
  }
`;

const CardBody = styled.div`
  padding: 24px;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const Message = styled.div`
  font-size: 1rem;
  line-height: 1.7;
  color: ${(props) => props.theme.text};
  white-space: pre-wrap;
  word-wrap: break-word;

  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
`;

const RelatedLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
  padding: 12px 20px;
  background: ${(props) => props.theme.primary};
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s;

  &:hover {
    background: ${(props) => props.theme.primaryDark};
    transform: translateY(-2px);
  }
`;

const StatusRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid ${(props) => props.theme.border};
  font-size: 0.85rem;
  color: ${(props) => props.theme.textSecondary};
  flex-wrap: wrap;

  .status-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 12px;
    border-radius: 12px;
    font-weight: 600;
    font-size: 0.75rem;
    background: ${(props) =>
      props.read ? props.theme.success + '22' : props.theme.warning + '22'};
    color: ${(props) =>
      props.read ? props.theme.success : props.theme.warning};
  }
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 60px;
  color: ${(props) => props.theme.textSecondary};
`;

const ErrorState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${(props) => props.theme.textSecondary};

  h3 {
    color: ${(props) => props.theme.text};
    margin-bottom: 10px;
  }

  p {
    margin-bottom: 20px;
  }

  a {
    padding: 10px 20px;
    background: ${(props) => props.theme.primary};
    color: white;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 600;

    &:hover {
      background: ${(props) => props.theme.primaryDark};
    }
  }
`;

const TYPE_LABELS = {
  admin_broadcast: { label: '📢 Admin Broadcast', icon: <FiSend /> },
  new_course: { label: '📚 New Course', icon: <FiBookOpen /> },
  new_book: { label: '📖 New Book', icon: <FiBook /> },
  new_goal: { label: '🎯 New Goal', icon: <FiTarget /> },
  system: { label: '🔔 System', icon: <FiBell /> },
};

const NotificationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchNotification();
  }, [id]);

  const fetchNotification = async () => {
    try {
      setLoading(true);
      const res = await api.get('/notifications');
      const found = res.data.notifications.find((n) => n._id === id);

      if (!found) {
        setError(true);
        return;
      }

      setNotification(found);

      // Auto-mark as read
      if (!found.isRead) {
        try {
          await api.put(`/notifications/${id}/read`);
          setNotification((prev) => ({ ...prev, isRead: true }));
        } catch (err) {
          // Silent fail on mark read
        }
      }
    } catch (err) {
      console.error('Error fetching notification:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async () => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotification((prev) => ({ ...prev, isRead: true }));
      toast.success('Marked as read');
    } catch (err) {
      toast.error('Failed to mark as read');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this notification permanently?')) return;

    try {
      await api.delete(`/notifications/${id}`);
      toast.success('Notification deleted');
      navigate('/notifications');
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const getRelatedLink = () => {
    if (!notification?.relatedId || !notification?.relatedModel) return null;

    const paths = {
      Course: `/courses/${notification.relatedId}`,
      Book: `/books/${notification.relatedId}`,
      Goal: `/goals/${notification.relatedId}`,
      Area: `/areas/${notification.relatedId}`,
    };

    return paths[notification.relatedModel] || null;
  };

  if (loading) return <LoadingSpinner>Loading notification...</LoadingSpinner>;

  if (error || !notification) {
    return (
      <Container>
        <ErrorState>
          <h3>Notification not found</h3>
          <p>This notification may have been deleted or doesn't exist.</p>
          <Link to="/notifications">← Back to Notifications</Link>
        </ErrorState>
      </Container>
    );
  }

  const typeInfo = TYPE_LABELS[notification.type] || TYPE_LABELS.system;
  const relatedLink = getRelatedLink();

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <BackButton onClick={() => navigate('/notifications')}>
            <FiArrowLeft />
          </BackButton>
          <h1>Notification</h1>
        </HeaderLeft>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {!notification.isRead && (
            <ActionButton onClick={handleMarkRead}>
              <FiCheckCircle /> Mark as read
            </ActionButton>
          )}
          <ActionButton className="delete" onClick={handleDelete}>
            <FiTrash2 /> Delete
          </ActionButton>
        </div>
      </Header>

      <Card>
        <CardHeader type={notification.type}>
          <div className="type-badge">
            {typeInfo.icon} {typeInfo.label}
          </div>

          <h2>{notification.title}</h2>

          <div className="meta">
            <span>
              <FiClock size={14} />
              {format(new Date(notification.createdAt), 'EEEE, MMMM d, yyyy • h:mm a')}
            </span>
            {notification.type === 'admin_broadcast' && (
              <span>
                <FiUser size={14} />
                From: {notification.senderName || 'Admin'}
              </span>
            )}
          </div>
        </CardHeader>

        <CardBody>
          <Message>{notification.message}</Message>

          {relatedLink && (
            <RelatedLink to={relatedLink}>
              Open {notification.relatedModel} →
            </RelatedLink>
          )}

          <StatusRow read={notification.isRead}>
            <span className="status-badge">
              {notification.isRead ? (
                <>
                  <FiCheckCircle size={12} /> Read
                </>
              ) : (
                <>
                  <FiClock size={12} /> Unread
                </>
              )}
            </span>
            {notification.emailSent && (
              <span style={{ fontSize: '0.75rem' }}>
                📧 Also sent via email
              </span>
            )}
          </StatusRow>
        </CardBody>
      </Card>
    </Container>
  );
};

export default NotificationDetail;