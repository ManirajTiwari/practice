import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import API from './api';

function App() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  // Sign Up
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await API.post('register/', { username, email, password });
      alert('User Registered Successfully! Now Login.');
    } catch (err) {
      alert(err.response?.data?.error || 'Registration Failed');
    }
  };

  // Login (Obtain JWT Token)
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('token/', { username, password });
      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('refresh_token', res.data.refresh);
      alert('Login Successful!');
    } catch (err) {
      alert('Invalid Credentials');
    }
  };

  // Google OAuth Login
  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      const res = await API.post('auth/google/', {
        id_token: credentialResponse.credential,
      });
      localStorage.setItem('access_token', res.data.access || res.data.access_token);
      localStorage.setItem('refresh_token', res.data.refresh || res.data.refresh_token);
      alert('Google Login Successful!');
    } catch (err) {
      console.error('Google Auth Failed:', err);
      alert('Google Authentication failed on backend');
    }
  };

  // Fetch Protected Data
  const getProtectedData = async () => {
    try {
      const res = await API.get('protected/');
      setMessage(res.data.message);
    } catch (err) {
      setMessage('Unauthorized access! Please login first.');
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h2>Django + React JWT Auth Base</h2>

      <div style={{ display: 'flex', gap: '40px' }}>
        <form onSubmit={handleRegister}>
          <h3>Register</h3>
          <input placeholder="Username" onChange={(e) => setUsername(e.target.value)} /><br /><br />
          <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} /><br /><br />
          <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} /><br /><br />
          <button type="submit">Sign Up</button>
        </form>

        <form onSubmit={handleLogin}>
          <h3>Login</h3>
          <input placeholder="Username" onChange={(e) => setUsername(e.target.value)} /><br /><br />
          <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} /><br /><br />
          <button type="submit">Login</button>
        </form>
      </div>

      <h2>Google OAuth Login</h2>
      <GoogleLogin
        onSuccess={handleGoogleLoginSuccess}
        onError={() => alert('Google Login Failed')}
      />

      <hr style={{ margin: '40px 0' }} />
      <button onClick={getProtectedData}>Test Protected API</button>
      <h4>Response: {message}</h4>
    </div>
  );
}

export default App;