import { useState } from 'react';
import Signup from './components/Signup';
import Login from './components/Login';
import UpdateProfile from './components/UpdateProfile';
import Show from './components/show';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('login');

  return (
    <div className="app-container">
      {/* Background ambient light effects */}
      <div className="bg-glow bg-glow-1"></div>
      <div className="bg-glow bg-glow-2"></div>

      <header className="app-header">
        <span className="badge">Authentication Portal</span>
        <h1>MERN Auth & Profile System</h1>
        <p>Manage your account, update settings, and browse community users</p>
      </header>

      {/* Navigation Tabs */}
      <nav className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`}
          onClick={() => setActiveTab('login')}
        >
          <svg className="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13 12H3"/>
          </svg>
          Login
        </button>
        <button 
          className={`tab-btn ${activeTab === 'signup' ? 'active' : ''}`}
          onClick={() => setActiveTab('signup')}
        >
          <svg className="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M8.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM20 8v6M23 11h-6"/>
          </svg>
          Sign Up
        </button>
        <button 
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <svg className="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/>
          </svg>

          Update Profile
        </button>
        <button 
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <svg className="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-3-3.87M9 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          User List
        </button>
      </nav>

      {/* Main View Area */}
      <main className="view-container">
        <div className="view-content fade-in">
          {activeTab === 'login' && <Login />}
          {activeTab === 'signup' && <Signup />}
          {activeTab === 'profile' && <UpdateProfile />}
          {activeTab === 'users' && <Show />}
        </div>
      </main>
    </div>
  );
}