import { useState } from 'react';
import axios from 'axios';

export default function Signup() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    try {
      // Send registration data to Express backend
      const response = await axios.post('http://localhost:5000/api/auth/signup', formData);

      setMessage({ text: response.data.message || 'Account created successfully!', type: 'success' });
      
      // Clear form inputs on success
      setFormData({ username: '', email: '', password: '' });
    } catch (error) {
      // Display backend error message (e.g., "User already exists")
      setMessage({ 
        text: error.response?.data?.message || 'Server error. Please try again.', 
        type: 'error' 
      });
    }
  };

  return (
    <div className="form-card">
      <h2>Sign Up</h2>

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
          <label>Username</label>
          <input 
            type="text" 
            name="username" 
            value={formData.username} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input 
            type="password" 
            name="password" 
            value={formData.password} 
            onChange={handleChange} 
            required 
          />
        </div>
        <button type="submit" className="btn-primary">Register</button>
      </form>
    </div>
  );
}