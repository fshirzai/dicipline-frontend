import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import api from '../../services/api';
import { FiBell, FiCheck, FiTrash2 } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';

const BellWrapper = styled.div`
  position: relative;
`;

const BellButton = styled.button`
  background: transparent;
  border: none;
  color: ${(props) => props.theme.navbarText};
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  position: relative;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  font-size: 1.2rem;

  &:hover {
    background: ${(props) => props.theme.surface2};
  }
`;

const Badge = styled.span`
  position: absolute;
  top: 2px;
  right: 2px;
  background: ${(props) => props.theme.danger};
  color: white;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 2px 5px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
  line-height: 1;
`;

const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 380px;
  max-width: 90vw;
  background: ${(props) => props.theme.surface};
  border: 1px solid ${(props) => props.theme.border};
  border-radius: 12px;
  box-shadow: ${(props) => props.theme.shadowHover};
  z-index: 2000;
  max-height: 500px;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  @media (max-width: 500px) {
    width: 320px;
    right: -100px;
  }
`;

const DropdownHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid ${(props) => props.theme.border};

  h4 {
    font-size: 1rem;
    color: ${(props) => props.theme.text};
  }

  button {
    background: transparent;
    border: none;
    color: ${(props) => props.theme.primary};
    font-size: 0.8rem;
    cursor: pointer;
    font-weight: 600;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const NotificationList = styled.div`
  overflow-y: auto;
  flex: 1;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.primary};
    border-radius: 3px;
  }
`;

const NotificationItem = styled.div`
  padding: 14px 16px;
  border-bottom: 1px solid ${(props) => props.theme.border};
  cursor: pointer;
  transition: all 0.2s;
  background: ${(props) => (props.unread ? props.theme.primary + '11' : 'transparent')};
  position: relative;

  &:hover {
    background: ${(props) => props.theme.surface2};
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 4px;

    .title {
      font-weight: 600;
      font-size: 0.9rem;
      color: ${(props) => props.theme.text};
      flex: 1;
    }

    .time {
      font-size: 0.7rem;
      color: ${(props) => props.theme.textSecondary};
      white-space: nowrap;
    }
  }

  .message {
    font-size: 0.85rem;
    color: ${(props) => props.theme.textSecondary};
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .sender {
    font-size: 0.7rem;
    color: ${(props) => props.theme.primary};
    margin-top: 4px;
    font-weight: 600;
  }

  .actions {
    position: absolute;
    top: 8px;
    right: 8px;
    display: none;
    gap: 4px;
  }

  &:hover .actions {
    display: flex;
  }

  .icon-btn {
    background: transparent;
    border: none;
    color: ${(props) => props.theme.textSecondary};
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    display: flex;
    align-items: center;

    &:hover {
      background: ${(props) => props.theme.border};
    }

    &.delete:hover {
      background: ${(props) => props.theme.danger}22;
      color: ${(props) => props.theme.danger};
    }
  }
`;

const UnreadDot = styled.span`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${(props) => props.theme.primary};
  margin-right: 6px;
`;

const EmptyState = styled.div`
  padding: 40px 20px;
  text-align: center;
  color: ${(props) => props.theme.textSecondary};

  svg {
    font-size: 2.5rem;
    opacity: 0.5;
    margin-bottom: 8px;
  }

  p {
    font-size: 0.9rem;
  }
`;

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  // Fetch on mount + poll every 30s
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.notifications);
      setUnreadCount(res.data.unreadCount);
    } catch (error) {
      // Silent fail
    }
  };

  const handleMarkAllRead = async (e) => {
    e.stopPropagation();
    try {
      await api.put('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Mark all read error:', error);
    }
  };

  const handleMarkRead = async (id, e) => {
    e?.stopPropagation();
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Mark read error:', error);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      // Recalculate unread
      const removed = notifications.find((n) => n._id === id);
      if (removed && !removed.isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleNotificationClick = async (notif) => {
    if (!notif.isRead) {
      await handleMarkRead(notif._id);
    }

    // Navigate based on type
    if (notif.relatedModel === 'Course' && notif.relatedId) {
      navigate(`/courses/${notif.relatedId}`);
    } else if (notif.relatedModel === 'Book' && notif.relatedId) {
      navigate(`/books/${notif.relatedId}`);
    } else if (notif.relatedModel === 'Goal' && notif.relatedId) {
      navigate(`/goals/${notif.relatedId}`);
    }

    setIsOpen(false);
  };

  return (
    <BellWrapper ref={wrapperRef}>
      <BellButton onClick={() => setIsOpen(!isOpen)} title="Notifications">
        <FiBell />
        {unreadCount > 0 && <Badge>{unreadCount > 99 ? '99+' : unreadCount}</Badge>}
      </BellButton>

      {isOpen && (
        <Dropdown>
          <DropdownHeader>
            <h4>Notifications</h4>
            {unreadCount > 0 && (
              <button onClick={handleMarkAllRead}>Mark all read</button>
            )}
          </DropdownHeader>

          <NotificationList>
            {notifications.length === 0 ? (
              <EmptyState>
                <FiBell />
                <p>No notifications yet</p>
              </EmptyState>
            ) : (
              notifications.map((notif) => (
                <NotificationItem
                  key={notif._id}
                  unread={!notif.isRead}
                  onClick={() => handleNotificationClick(notif)}
                >
                  <div className="header">
                    <div className="title">
                      {!notif.isRead && <UnreadDot />}
                      {notif.title}
                    </div>
                    <div className="time">
                      {formatDistanceToNow(new Date(notif.createdAt), {
                        addSuffix: true,
                      })}
                    </div>
                  </div>
                  <div className="message">{notif.message}</div>
                  {notif.type === 'admin_broadcast' && (
                    <div className="sender">From: {notif.senderName || 'Admin'}</div>
                  )}

                  <div className="actions">
                    {!notif.isRead && (
                      <button
                        className="icon-btn"
                        title="Mark as read"
                        onClick={(e) => handleMarkRead(notif._id, e)}
                      >
                        <FiCheck size={14} />
                      </button>
                    )}
                    <button
                      className="icon-btn delete"
                      title="Delete"
                      onClick={(e) => handleDelete(notif._id, e)}
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </NotificationItem>
              ))
            )}
          </NotificationList>
        </Dropdown>
      )}
    </BellWrapper>
  );
};

export default NotificationBell;