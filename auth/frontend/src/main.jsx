import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css'
import App from './App.jsx'


createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="GOOGLE_OAUTH_CLIENT_ID">
    <App />
    </GoogleOAuthProvider>
  </React.StrictMode>,
)
