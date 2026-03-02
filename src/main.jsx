/**
 * main.jsx — Application entry point.
 * Imports global styles before mounting React to avoid FOUC.
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/styles/index.css';
import App from './App';

const root = document.getElementById('root');

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
);
