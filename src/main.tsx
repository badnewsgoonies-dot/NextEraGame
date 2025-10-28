/*
 * Main entry point for NextEra MVP
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App.js';
import { ErrorBoundary } from './components/ErrorBoundary.js';
import { VERSION } from './constants/version.js';
import './styles/index.css';

console.log(`🎮 Planets Descending v${VERSION}`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

const root = document.getElementById('root');

if (!root) {
  throw new Error('Root element not found');
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

