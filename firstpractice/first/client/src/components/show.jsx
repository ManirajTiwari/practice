import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Show() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Function to fetch users from backend
  const fetchUsers = async () => {
    try {
      setError('');
      const response = await axios.get('http://localhost:5000/api/auth/users');
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
      setLoading(false);
    }
  };

  // Function to delete user by ID
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/auth/users/${id}`);
      // Remove deleted user from state immediately
      setUsers(users.filter((user) => user._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="form-card" style={{ maxWidth: '650px', width: '100%' }}>
      <h2>Registered Users</h2>
      <button 
        onClick={fetchUsers} 
        className="btn-primary" 
        style={{ marginBottom: '16px', padding: '8px 16px' }}
      >
        Refresh Data
      </button>

      {loading && <p>Loading users...</p>}
      {error && <p style={{ color: '#ef4444' }}>{error}</p>}

      {!loading && !error && users.length === 0 && (
        <p>No users found in MongoDB.</p>
      )}

      {!loading && !error && users.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '8px' }}>Username</th>
              <th style={{ padding: '8px' }}>Email</th>
              <th style={{ padding: '8px' }}>Joined</th>
              <th style={{ padding: '8px', textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '8px' }}>{user.username}</td>
                <td style={{ padding: '8px' }}>{user.email}</td>
                <td style={{ padding: '8px' }}>
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td style={{ padding: '8px', textAlign: 'center' }}>
                  <button
                    onClick={() => handleDelete(user._id)}
                    style={{
                      backgroundColor: '#ef4444',
                      color: '#fff',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}