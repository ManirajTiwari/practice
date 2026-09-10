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
      <header className="app-header">
        <h1>MERN Auth & Profile System</h1>
        <p>Select a view below to interact with the API</p>
      </header>

      {/* Navigation Tabs */}
      <nav className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`}
          onClick={() => setActiveTab('login')}
        >
          Login
        </button>
        <button 
          className={`tab-btn ${activeTab === 'signup' ? 'active' : ''}`}
          onClick={() => setActiveTab('signup')}
        >
          Sign Up
        </button>
        <button 
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Update Profile
        </button>
        <button 
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          User List
        </button>
      </nav>

      {/* Main View Area */}
      <main className="view-container">
        {activeTab === 'login' && <Login />}
        {activeTab === 'signup' && <Signup />}
        {activeTab === 'profile' && <UpdateProfile />}
        {activeTab === 'users' && <Show />}
      </main>
    </div>
  );
}