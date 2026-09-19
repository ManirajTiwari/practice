import React, { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import API from './api';

function App() {
  // Separate states for Register and Login forms
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'

  // Sign Up
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await API.post('register/', { 
        username: regUsername, 
        email: regEmail, 
        password: regPassword 
      });
      alert('User Registered Successfully! Please switch to Login.');
      setActiveTab('login');
    } catch (err) {
      alert(err.response?.data?.error || 'Registration Failed');
    }
  };

  // Login (Obtain JWT Token)
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('token/', { 
        username: loginUsername, 
        password: loginPassword 
      });
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

  // GitHub Login Redirect
  const handleGithubLogin = () => {
    const client_id = "YOUR_GITHUB_CLIENT_ID";
    const redirect_uri = "http://localhost:5173/github/callback";
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=user:email`;
  };

  // Catch the Callback Code from URL parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      API.post('auth/github/', { code })
        .then((res) => {
          localStorage.setItem('access_token', res.data.access || res.data.access_token);
          localStorage.setItem('refresh_token', res.data.refresh || res.data.refresh_token);
          alert('GitHub Login Successful! User Data Synced in DB.');
          window.history.replaceState({}, document.title, window.location.pathname);
        })
        .catch((err) => {
          console.error('GitHub Login Failed:', err);
          alert('GitHub Authentication failed');
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
    <div style={styles.pageBackground}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Welcome Back</h2>
          <p style={styles.subtitle}>Django + React JWT & OAuth Authentication</p>
        </div>

        {/* Tab Toggle Controls */}
        <div style={styles.tabContainer}>
          <button 
            style={{ ...styles.tabButton, ...(activeTab === 'login' ? styles.activeTab : {}) }} 
            onClick={() => setActiveTab('login')}
          >
            Login
          </button>
          <button 
            style={{ ...styles.tabButton, ...(activeTab === 'register' ? styles.activeTab : {}) }} 
            onClick={() => setActiveTab('register')}
          >
            Register
          </button>
        </div>

        {/* Dynamic Form Sections */}
        {activeTab === 'login' ? (
          <form onSubmit={handleLogin} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Username</label>
              <input 
                style={styles.input}
                placeholder="Enter your username" 
                value={loginUsername} 
                onChange={(e) => setLoginUsername(e.target.value)} 
                required
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input 
                type="password" 
                style={styles.input}
                placeholder="••••••••" 
                value={loginPassword} 
                onChange={(e) => setLoginPassword(e.target.value)} 
                required
              />
            </div>
            <button type="submit" style={styles.primaryButton}>Sign In</button>
          </form>
        ) : (
          <form onSubmit={handleRegister} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Username</label>
              <input 
                style={styles.input}
                placeholder="Choose a username" 
                value={regUsername} 
                onChange={(e) => setRegUsername(e.target.value)} 
                required
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <input 
                type="email"
                style={styles.input}
                placeholder="you@example.com" 
                value={regEmail} 
                onChange={(e) => setRegEmail(e.target.value)} 
                required
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input 
                type="password" 
                style={styles.input}
                placeholder="••••••••" 
                value={regPassword} 
                onChange={(e) => setRegPassword(e.target.value)} 
                required
              />
            </div>
            <button type="submit" style={styles.primaryButton}>Create Account</button>
          </form>
        )}

        <div style={styles.dividerContainer}>
          <div style={styles.dividerLine} />
          <span style={styles.dividerText}>or continue with</span>
          <div style={styles.dividerLine} />
        </div>

        {/* OAuth Action Buttons */}
        <div style={styles.socialContainer}>
          <div style={styles.googleWrapper}>
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={() => alert('Google Login Failed')}
              shape="pill"
              theme="outline"
            />
          </div>

          <button onClick={handleGithubLogin} style={styles.githubButton}>
            <svg height="18" width="18" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            Sign in with GitHub
          </button>
        </div>

        {/* Protected API Test Section */}
        <div style={styles.testContainer}>
          <button onClick={getProtectedData} style={styles.secondaryButton}>
            Test Protected Endpoint
          </button>
          {message && (
            <div style={styles.messageBox}>
              <strong>Backend Response:</strong> {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Inline Styling System
const styles = {
  pageBackground: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    padding: '20px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
    width: '100%',
    maxWidth: '440px',
    padding: '36px',
    boxSizing: 'border-box',
  },
  header: {
    textAlign: 'center',
    marginBottom: '24px',
  },
  title: {
    margin: '0 0 6px 0',
    color: '#111827',
    fontSize: '24px',
    fontWeight: '700',
  },
  subtitle: {
    margin: 0,
    color: '#6b7280',
    fontSize: '14px',
  },
  tabContainer: {
    display: 'flex',
    backgroundColor: '#f3f4f6',
    borderRadius: '8px',
    padding: '4px',
    marginBottom: '24px',
  },
  tabButton: {
    flex: 1,
    padding: '8px 0',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#6b7280',
    fontWeight: '600',
    fontSize: '14px',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  activeTab: {
    backgroundColor: '#ffffff',
    color: '#111827',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#374151',
  },
  input: {
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s ease',
  },
  primaryButton: {
    marginTop: '8px',
    padding: '12px',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  dividerContainer: {
    display: 'flex',
    alignItems: 'center',
    margin: '24px 0',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    backgroundColor: '#e5e7eb',
  },
  dividerText: {
    padding: '0 12px',
    fontSize: '12px',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  socialContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    alignItems: 'center',
  },
  googleWrapper: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  githubButton: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '10px',
    backgroundColor: '#24292e',
    color: '#ffffff',
    border: 'none',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  testContainer: {
    marginTop: '28px',
    paddingTop: '20px',
    borderTop: '1px solid #f3f4f6',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  secondaryButton: {
    padding: '10px',
    backgroundColor: '#f3f4f6',
    color: '#374151',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  messageBox: {
    padding: '12px',
    backgroundColor: '#eff6ff',
    border: '1px solid #bfdbfe',
    borderRadius: '8px',
    color: '#1e40af',
    fontSize: '13px',
    wordBreak: 'break-word',
  },
};

export default App;