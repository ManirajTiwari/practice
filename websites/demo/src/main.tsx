import React from 'react';
import ReactDOM from 'react-dom/client';
import AuthModalProps from './App';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the root element');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <AuthModalProps />
  </React.StrictMode>
);