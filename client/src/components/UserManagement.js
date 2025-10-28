import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/users', getAuthConfig());
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete ${userName}? This will also delete all their recipes.`)) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, getAuthConfig());
      alert('User deleted successfully!');
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error deleting user:', error);
      alert(error.response?.data?.message || 'Failed to delete user');
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading users...</div>;
  }

  return (
    <div style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto' }} className="responsive-container">
      <style>{`
        .responsive-container {
          overflow-x: auto;
        }

        .users-table-wrapper {
          background: white;
          border-radius: 8px;
          overflow-x: auto;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .users-table {
          width: 100%;
          min-width: 800px;
          border-collapse: collapse;
        }

        .users-table th {
          padding: 15px;
          text-align: left;
          background: #34495e;
          color: white;
          font-weight: 600;
          white-space: nowrap;
        }

        .users-table td {
          padding: 15px;
          border-bottom: 1px solid #ecf0f1;
        }

        .users-table tr:hover {
          background: #f8f9fa;
        }

        .role-badge {
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: bold;
          color: white;
        }

        .role-badge.admin {
          background: #e74c3c;
        }

        .role-badge.user {
          background: #3498db;
        }

        .delete-btn {
          padding: 8px 16px;
          background: #e74c3c;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          font-weight: bold;
          transition: background 0.2s;
        }

        .delete-btn:hover {
          background: #c0392b;
        }

        .user-card {
          display: none;
          background: white;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 15px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .user-card-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 15px;
          padding-bottom: 15px;
          border-bottom: 1px solid #ecf0f1;
        }

        .user-info-item {
          margin-bottom: 10px;
          padding: 8px 0;
        }

        .user-info-label {
          font-weight: bold;
          color: #2c3e50;
          font-size: 13px;
          margin-bottom: 4px;
        }

        .user-info-value {
          color: #34495e;
          font-size: 14px;
        }

        /* Responsive Design */
        @media screen and (max-width: 768px) {
          .responsive-container {
            padding: 20px 15px !important;
          }

          .users-table-wrapper {
            display: none;
          }

          .user-card {
            display: block;
          }

          .user-card-header {
            flex-direction: column;
            gap: 10px;
          }
        }

        @media screen and (max-width: 480px) {
          .responsive-container {
            padding: 15px 10px !important;
          }
        }
      `}</style>

      <h1>User Management</h1>
      <p style={{ color: '#7f8c8d', marginBottom: '30px' }}>
        Manage all registered users. Deleting a user will also delete all their recipes.
      </p>

      {users.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: '#ecf0f1', borderRadius: '8px' }}>
          <h3>No users found</h3>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="users-table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>
                      {user.firstName} {user.lastName}
                    </td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-badge ${user.role}`}>
                        {user.role.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ fontSize: '14px', color: '#7f8c8d' }}>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {user.role !== 'admin' ? (
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteUser(user._id, `${user.firstName} ${user.lastName}`)}
                        >
                          🗑️ Delete
                        </button>
                      ) : (
                        <span style={{ color: '#95a5a6', fontSize: '14px' }}>Protected</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          {users.map((user) => (
            <div key={user._id} className="user-card">
              <div className="user-card-header">
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#2c3e50' }}>
                    {user.firstName} {user.lastName}
                  </div>
                  <div style={{ fontSize: '12px', color: '#7f8c8d', marginTop: '4px' }}>
                    @{user.username}
                  </div>
                </div>
                <span className={`role-badge ${user.role}`}>
                  {user.role.toUpperCase()}
                </span>
              </div>

              <div className="user-info-item">
                <div className="user-info-label">📧 Email</div>
                <div className="user-info-value">{user.email}</div>
              </div>

              <div className="user-info-item">
                <div className="user-info-label">📅 Joined</div>
                <div className="user-info-value">{new Date(user.createdAt).toLocaleDateString()}</div>
              </div>

              <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #ecf0f1' }}>
                {user.role !== 'admin' ? (
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteUser(user._id, `${user.firstName} ${user.lastName}`)}
                    style={{ width: '100%' }}
                  >
                    🗑️ Delete User
                  </button>
                ) : (
                  <div style={{ textAlign: 'center', color: '#95a5a6', fontSize: '14px', padding: '8px' }}>
                    🔒 Admin account - Protected
                  </div>
                )}
              </div>
            </div>
          ))}
        </>
      )}

      <div style={{ marginTop: '20px', padding: '15px', background: '#fff3cd', borderLeft: '4px solid #ffc107', borderRadius: '4px' }}>
        <strong>⚠️ Warning:</strong> Deleting a user will permanently remove their account and all recipes they've submitted. This action cannot be undone.
      </div>
    </div>
  );
}

export default UserManagement;
