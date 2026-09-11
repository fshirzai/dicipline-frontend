import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import {
  FiBell,
  FiCheck,
  FiTrash2,
  FiCheckCircle,
  FiBook,
  FiBookOpen,
  FiTarget,
  FiSend,
  FiChevronRight,
  FiFilter,
} from 'react-icons/fi';

const Container = styled.div`
  padding: 20px;
  max-width: 900px;
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

  h1 {
    font-size: 2rem;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 1.4rem;
    }
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  background: ${(props) => props.theme.surface};
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

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const FilterBar = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  padding: 6px 16px;
  border-radius: 20px;
  border: 1px solid
    ${(props) => (props.active ? props.theme.primary : props.theme.border)};
  background: ${(props) => (props.active ? props.theme.primary : 'transparent')};
  color: ${(props) => (props.active ? 'white' : props.theme.text)};
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.85rem;
  font-weight: 500;

  &:hover {
    border-color: ${(props) => props.theme.primary};
  }
`;

const NotificationCard = styled(Link)`
  display: block;
  background: ${(props) =>
    props.unread ? props.theme.primary + '11' : props.theme.surface};
  border: 1px solid
    ${(props) => (props.unread ? props.theme.primary + '44' : props.theme.border)};
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 12px;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s;
  position: relative;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${(props) => props.theme.shadowHover};
    border-color: ${(props) => props.theme.primary};
  }

  .top-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 6px;

    .title {
      font-size: 1rem;
      font-weight: 700;
      color: ${(props) => props.theme.text};
      display: flex;
      align-items: center;
      gap: 8px;
      flex: 1;

      .type-icon {
        color: ${(props) => {
          if (props.type === 'admin_broadcast') return props.theme.primary;
          if (props.type === 'new_course') return '#4f46e5';
          if (props.type === 'new_book') return '#10b981';
          if (props.type === 'new_goal') return '#f59e0b';
          return props.theme.textSecondary;
        }};
        font-size: 1.1rem;
      }
    }

    .time {
      font-size: 0.75rem;
      color: ${(props) => props.theme.textSecondary};
      white-space: nowrap;
      flex-shrink: 0;
    }
  }

  .message {
    font-size: 0.9rem;
    color: ${(props) => props.theme.textSecondary};
    line-height: 1.5;
    margin-bottom: 8px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .bottom-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;

    .sender {
      font-size: 0.75rem;
      color: ${(props) => props.theme.primary};
      font-weight: 600;
    }

    .read-more {
      font-size: 0.75rem;
      color: ${(props) => props.theme.primary};
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 4px;
    }
  }
`;

const UnreadDot = styled.span`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${(props) => props.theme.primary};
  flex-shrink: 0;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  background: ${(props) => props.theme.surface};
  border: 1px solid ${(props) => props.theme.border};
  border-radius: 12px;

  svg {
    font-size: 3rem;
    color: ${(props) => props.theme.textSecondary};
    opacity: 0.5;
    margin-bottom: 12px;
  }

  h3 {
    color: ${(props) => props.theme.text};
    margin-bottom: 6px;
  }

  p {
    color: ${(props) => props.theme.textSecondary};
    font-size: 0.9rem;
  }
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 60px;
  color: ${(props) => props.theme.textSecondary};
`;

const NotificationsList = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/notifications');
      setNotifications(res.data.notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      toast.success('All marked as read');
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  const handleMarkRead = async (id, e) => {
    e?.preventDefault();
    e?.stopPropagation();
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      toast.success('Marked as read');
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const handleDelete = async (id, e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (!window.confirm('Delete this notification?')) return;

    try {
      await api.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      toast.success('Notification deleted');
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'admin_broadcast':
        return <FiSend className="type-icon" />;
      case 'new_course':
        return <FiBookOpen className="type-icon" />;
      case 'new_book':
        return <FiBook className="type-icon" />;
      case 'new_goal':
        return <FiTarget className="type-icon" />;
      default:
        return <FiBell className="type-icon" />;
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.isRead;
    if (filter === 'read') return n.isRead;
    if (filter === 'broadcast') return n.type === 'admin_broadcast';
    if (filter === 'personal')
      return ['new_course', 'new_book', 'new_goal', 'system'].includes(n.type);
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (loading) return <LoadingSpinner>Loading notifications...</LoadingSpinner>;

  return (
    <Container>
      <Header>
        <h1>
          <FiBell /> Notifications
          {unreadCount > 0 && (
            <span
              style={{
                fontSize: '0.85rem',
                background: '#ef4444',
                color: 'white',
                padding: '2px 10px',
                borderRadius: '12px',
                fontWeight: '600',
              }}
            >
              {unreadCount}
            </span>
          )}
        </h1>

        <HeaderActions>
          {unreadCount > 0 && (
            <ActionButton onClick={handleMarkAllRead}>
              <FiCheckCircle /> Mark all read
            </ActionButton>
          )}
        </HeaderActions>
      </Header>

      <FilterBar>
        <FilterButton
          active={filter === 'all'}
          onClick={() => setFilter('all')}
        >
          All ({notifications.length})
        </FilterButton>
        <FilterButton
          active={filter === 'unread'}
          onClick={() => setFilter('unread')}
        >
          Unread ({unreadCount})
        </FilterButton>
        <FilterButton
          active={filter === 'read'}
          onClick={() => setFilter('read')}
        >
          Read
        </FilterButton>
        <FilterButton
          active={filter === 'broadcast'}
          onClick={() => setFilter('broadcast')}
        >
          Broadcasts
        </FilterButton>
        <FilterButton
          active={filter === 'personal'}
          onClick={() => setFilter('personal')}
        >
          My Activity
        </FilterButton>
      </FilterBar>

      {filteredNotifications.length === 0 ? (
        <EmptyState>
          <FiBell />
          <h3>No notifications</h3>
          <p>
            {filter === 'all'
              ? "You're all caught up! New notifications will appear here."
              : 'No notifications match this filter.'}
          </p>
        </EmptyState>
      ) : (
        filteredNotifications.map((notif) => (
          <NotificationCard
            key={notif._id}
            to={`/notifications/${notif._id}`}
            unread={!notif.isRead}
            type={notif.type}
          >
            <div className="top-row">
              <div className="title">
                {!notif.isRead && <UnreadDot />}
                {getIcon(notif.type)}
                {notif.title}
              </div>
              <div className="time">
                {format(new Date(notif.createdAt), 'MMM d, h:mm a')}
              </div>
            </div>

            <div className="message">{notif.message}</div>

            <div className="bottom-row">
              <div>
                {notif.type === 'admin_broadcast' ? (
                  <span className="sender">
                    📢 From {notif.senderName || 'Admin'}
                  </span>
                ) : (
                  <span className="sender">Personal notification</span>
                )}
              </div>
              <span className="read-more">
                View <FiChevronRight size={12} />
              </span>
            </div>
          </NotificationCard>
        ))
      )}
    </Container>
  );
};

export default NotificationsList;