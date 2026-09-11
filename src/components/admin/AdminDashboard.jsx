import React, { useState, useEffect } from "react";
import styled from "styled-components";
import api from "../../services/api";
import toast from "react-hot-toast";
import AdminBroadcast from "./AdminBroadcast";
import {
  FiUsers,
  FiUserCheck,
  FiUserX,
  FiRefreshCw,
  FiTrash2,
  FiEdit,
  FiSend,
} from "react-icons/fi";

const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
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

const RefreshButton = styled.button`
  padding: 10px 20px;
  background: ${(props) => props.theme.surface};
  border: 1px solid ${(props) => props.theme.border};
  border-radius: 8px;
  color: ${(props) => props.theme.text};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  font-weight: 600;

  &:hover {
    background: ${(props) => props.theme.primary};
    color: white;
  }
`;

/* ============================================
   TABS
   ============================================ */
const TabBar = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  border-bottom: 1px solid ${(props) => props.theme.border};
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.border};
    border-radius: 2px;
  }
`;

const Tab = styled.button`
  padding: 12px 20px;
  background: transparent;
  border: none;
  color: ${(props) =>
    props.active ? props.theme.primary : props.theme.textSecondary};
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  border-bottom: 3px solid
    ${(props) => (props.active ? props.theme.primary : "transparent")};
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  transition: all 0.2s;
  margin-bottom: -1px;

  &:hover {
    color: ${(props) => props.theme.primary};
  }

  @media (max-width: 768px) {
    padding: 10px 14px;
    font-size: 0.85rem;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatCard = styled.div`
  background: ${(props) => props.theme.surface};
  padding: 20px;
  border-radius: 12px;
  border: 1px solid ${(props) => props.theme.border};

  .value {
    font-size: 2rem;
    font-weight: 700;
    color: ${(props) => props.theme.text};
  }

  .label {
    color: ${(props) => props.theme.textSecondary};
    font-size: 0.9rem;
    margin-top: 4px;
  }

  @media (max-width: 480px) {
    padding: 14px;

    .value {
      font-size: 1.5rem;
    }

    .label {
      font-size: 0.75rem;
    }
  }
`;

const Table = styled.div`
  background: ${(props) => props.theme.surface};
  border-radius: 12px;
  border: 1px solid ${(props) => props.theme.border};
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 2fr 1fr 1fr 2fr;
  padding: 16px 20px;
  background: ${(props) => props.theme.surface2};
  border-bottom: 1px solid ${(props) => props.theme.border};
  font-weight: 600;
  color: ${(props) => props.theme.textSecondary};
  font-size: 0.9rem;

  @media (max-width: 900px) {
    display: none;
  }
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 2fr 1fr 1fr 2fr;
  padding: 14px 20px;
  border-bottom: 1px solid ${(props) => props.theme.border};
  align-items: center;
  transition: all 0.2s;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${(props) => props.theme.surface2};
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 8px;
    padding: 16px;

    .mobile-label {
      font-size: 0.75rem;
      color: ${(props) => props.theme.textSecondary};
      font-weight: 600;
      text-transform: uppercase;
      margin-bottom: 2px;
    }
  }

  @media (min-width: 901px) {
    .mobile-label {
      display: none;
    }
  }
`;

const StatusBadge = styled.span`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  display: inline-block;
  background: ${(props) =>
    props.active ? props.theme.success + "33" : props.theme.danger + "33"};
  color: ${(props) =>
    props.active ? props.theme.success : props.theme.danger};
`;

const RoleBadge = styled.span`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  display: inline-block;
  background: ${(props) =>
    props.admin ? props.theme.primary + "33" : props.theme.surface2};
  color: ${(props) =>
    props.admin ? props.theme.primary : props.theme.textSecondary};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;

  @media (max-width: 900px) {
    justify-content: flex-start;
    margin-top: 6px;
  }
`;

const ActionButton = styled.button`
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 600;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 4px;

  &.toggle {
    background: ${(props) =>
      props.active ? props.theme.danger + "33" : props.theme.success + "33"};
    color: ${(props) =>
      props.active ? props.theme.danger : props.theme.success};

    &:hover {
      background: ${(props) =>
        props.active ? props.theme.danger : props.theme.success};
      color: white;
    }
  }

  &.role {
    background: ${(props) => props.theme.primary}33;
    color: ${(props) => props.theme.primary};

    &:hover {
      background: ${(props) => props.theme.primary};
      color: white;
    }
  }

  &.delete {
    background: ${(props) => props.theme.danger}33;
    color: ${(props) => props.theme.danger};

    &:hover {
      background: ${(props) => props.theme.danger};
      color: white;
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: ${(props) => props.theme.textSecondary};
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 60px;
  color: ${(props) => props.theme.textSecondary};
`;

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, active: 0, admin: 0 });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/users");
      setUsers(response.data.users);

      const total = response.data.users.length;
      const active = response.data.users.filter((u) => u.isActive).length;
      const admin = response.data.users.filter((u) => u.role === "admin").length;

      setStats({ total, active, admin });
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      await api.put(`/admin/users/${userId}/toggle`);
      toast.success(
        `User ${currentStatus ? "deactivated" : "activated"} successfully`
      );
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to toggle user status");
    }
  };

  const toggleUserRole = async (userId, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";

    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      toast.success(`User role updated to ${newRole}`);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update user role");
    }
  };

  const deleteUser = async (userId, username) => {
    if (
      !window.confirm(
        `Are you sure you want to delete user "${username}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await api.delete(`/admin/users/${userId}`);
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  };

  return (
    <Container>
      <Header>
        <h1>
          <FiUsers /> Admin Dashboard
        </h1>
        {activeTab === "users" && (
          <RefreshButton onClick={fetchUsers}>
            <FiRefreshCw /> Refresh
          </RefreshButton>
        )}
      </Header>

      {/* Tabs */}
      <TabBar>
        <Tab
          active={activeTab === "users"}
          onClick={() => setActiveTab("users")}
        >
          <FiUsers /> Users
        </Tab>
        <Tab
          active={activeTab === "broadcast"}
          onClick={() => setActiveTab("broadcast")}
        >
          <FiSend /> Send Broadcast
        </Tab>
      </TabBar>

      {/* ============================================
          USERS TAB
          ============================================ */}
      {activeTab === "users" && (
        <>
          <StatsGrid>
            <StatCard>
              <div className="value">{stats.total}</div>
              <div className="label">Total Users</div>
            </StatCard>
            <StatCard>
              <div className="value">{stats.active}</div>
              <div className="label">Active Users</div>
            </StatCard>
            <StatCard>
              <div className="value">{stats.total - stats.active}</div>
              <div className="label">Inactive Users</div>
            </StatCard>
            <StatCard>
              <div className="value">{stats.admin}</div>
              <div className="label">Administrators</div>
            </StatCard>
          </StatsGrid>

          {loading ? (
            <LoadingSpinner>Loading users...</LoadingSpinner>
          ) : (
            <Table>
              <TableHeader>
                <div>Username</div>
                <div>Email</div>
                <div>Status</div>
                <div>Role</div>
                <div>Actions</div>
              </TableHeader>

              {users.length === 0 ? (
                <EmptyState>No users found</EmptyState>
              ) : (
                users.map((user) => (
                  <TableRow key={user._id}>
                    <div>
                      <div className="mobile-label">Username</div>
                      {user.username}
                    </div>
                    <div>
                      <div className="mobile-label">Email</div>
                      {user.email}
                    </div>
                    <div>
                      <div className="mobile-label">Status</div>
                      <StatusBadge active={user.isActive}>
                        {user.isActive ? "Active" : "Inactive"}
                      </StatusBadge>
                    </div>
                    <div>
                      <div className="mobile-label">Role</div>
                      <RoleBadge admin={user.role === "admin"}>
                        {user.role === "admin" ? "Admin" : "User"}
                      </RoleBadge>
                    </div>
                    <div>
                      <div className="mobile-label">Actions</div>
                      <ActionButtons>
                        <ActionButton
                          className="toggle"
                          active={user.isActive}
                          onClick={() =>
                            toggleUserStatus(user._id, user.isActive)
                          }
                        >
                          {user.isActive ? <FiUserX /> : <FiUserCheck />}
                          {user.isActive ? "Deactivate" : "Activate"}
                        </ActionButton>
                        <ActionButton
                          className="role"
                          onClick={() => toggleUserRole(user._id, user.role)}
                        >
                          <FiEdit />
                          {user.role === "admin" ? "Make User" : "Make Admin"}
                        </ActionButton>
                        <ActionButton
                          className="delete"
                          onClick={() => deleteUser(user._id, user.username)}
                        >
                          <FiTrash2 />
                        </ActionButton>
                      </ActionButtons>
                    </div>
                  </TableRow>
                ))
              )}
            </Table>
          )}
        </>
      )}

      {/* ============================================
          BROADCAST TAB
          ============================================ */}
      {activeTab === "broadcast" && <AdminBroadcast />}
    </Container>
  );
};

export default AdminDashboard;