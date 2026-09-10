import { useState, useEffect } from 'react';
import axios from 'axios';
import './Show.css';

export default function Show() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('http://localhost:5000/api/auth/users');
      setUsers(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      setDeletingId(id);
      await axios.delete(`http://localhost:5000/api/auth/users/${id}`);
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user.');
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="table-card">
      <div className="table-header">
        <div>
          <h2>Registered Users</h2>
          <p className="subtitle">Manage and monitor database entries</p>
        </div>
        <button 
          onClick={fetchUsers} 
          className="btn-secondary" 
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {error && <div className="alert-banner error">{error}</div>}

      {loading && users.length === 0 ? (
        <div className="state-container">
          <div className="spinner"></div>
          <p>Fetching user records...</p>
        </div>
      ) : users.length === 0 && !error ? (
        <div className="state-container">
          <p className="empty-text">No users found in database.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="user-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Joined Date</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className={deletingId === user._id ? 'row-deleting' : ''}>
                  <td className="user-cell">
                    <div className="avatar">
                      {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="username">{user.username || 'N/A'}</span>
                  </td>
                  <td className="email-cell">{user.email}</td>
                  <td className="date-cell">
                    {user.createdAt 
                      ? new Date(user.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })
                      : 'N/A'}
                  </td>
                  <td className="text-right">
                    <button
                      onClick={() => handleDelete(user._id)}
                      disabled={deletingId === user._id}
                      className="btn-danger-outline"
                    >
                      {deletingId === user._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}