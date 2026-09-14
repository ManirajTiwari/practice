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

  // 1. User redirect to GitHub Authorization URL
  const handleGithubLogin = () => {
    const client_id = "YOUR_GITHUB_CLIENT_ID";
    const redirect_uri = "http://localhost:5173/github/callback";
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=user:email`;
  };

  // 2. Catch the Callback Code from URL parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      // Exchange code with Django Backend
      API.post('auth/github/', { code })
        .then((res) => {
          localStorage.setItem('access_token', res.data.access_token);
          localStorage.setItem('refresh_token', res.data.refresh_token);
          alert('GitHub Login Successful! User Data Synced in DB.');
          window.history.replaceState({}, document.title, "/"); // Clean URL
        })
        .catch((err) => {
          console.error('GitHub Login Failed:', err);
        });
    }
  }, []);

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

      <div style={{ padding: '20px' }}>
      <h2>GitHub Social Login</h2>
      <button 
        onClick={handleGithubLogin}
        style={{ padding: '10px 20px', background: '#24292e', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
      >
        Login with GitHub
      </button>
    </div>

      <hr style={{ margin: '40px 0' }} />
      <button onClick={getProtectedData}>Test Protected API</button>
      <h4>Response: {message}</h4>
    </div>
  );
}

export default App;