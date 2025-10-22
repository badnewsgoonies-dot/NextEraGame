/*
 * Main entry point for NextEra MVP
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';
import { App } from './App.js';
import { ErrorBoundary } from './components/ErrorBoundary.js';
import './styles/index.css';

const root = document.getElementById('root');

if (!root) {
  throw new Error('Root element not found');
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
      <Analytics />
    </ErrorBoundary>
  </React.StrictMode>
);

