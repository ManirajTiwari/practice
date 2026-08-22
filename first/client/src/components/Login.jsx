import { useState } from 'react';
import axios from 'axios';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    try {
      // Send request to your Express backend
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      
      setMessage({ text: response.data.message || 'Login successful!', type: 'success' });
      
      // Save logged-in user data or token locally
      console.log('User Data:', response.data.user);
      
      // Clear form inputs
      setFormData({ email: '', password: '' });
    } catch (error) {
      // Show error message from backend
      setMessage({ 
        text: error.response?.data?.message || 'Server error. Please try again.', 
        type: 'error' 
      });
    }
  };

  return (
    <div className="form-card">
      <h2>Log In</h2>

      {/* Message Feedback Banner */}
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
        <button type="submit" className="btn-primary">Login</button>
      </form>
    </div>
  );
}