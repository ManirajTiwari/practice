import { useState } from 'react';
import axios from 'axios';

export default function UpdateProfile() {
  const [formData, setFormData] = useState({ username: '', email: '' });
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    try {
      // Send PUT request to update username based on the provided email
      const response = await axios.put('http://localhost:5000/api/auth/update', formData);

      setMessage({ text: response.data.message || 'Profile updated successfully!', type: 'success' });
      
      // Clear form fields on success
      setFormData({ username: '', email: '' });
    } catch (error) {
      // Display error from backend (e.g., "User not found")
      setMessage({ 
        text: error.response?.data?.message || 'Server error. Please try again.', 
        type: 'error' 
      });
    }
  };

  return (
    <div className="form-card">
      <h2>Update Profile</h2>

      {/* Response Message Banner */}
      {message.text && (
        <p style={{ 
          color: message.type === 'success' ? '#22c55e' : '#ef4444', 
          fontSize: '14px',
          marginBottom: '10px' 
        }}>
          {message.text}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Target Account Email</label>
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            placeholder="Enter user email to identify"
            required 
          />
        </div>
        <div className="form-group">
          <label>New Username</label>
          <input 
            type="text" 
            name="username" 
            value={formData.username} 
            onChange={handleChange} 
            placeholder="Enter new username"
            required 
          />
        </div>
        <button type="submit" className="btn-primary">Update Details</button>
      </form>
    </div>
  );
}