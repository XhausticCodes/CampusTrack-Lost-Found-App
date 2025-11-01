// --- FIX for sockjs-client ---
window.global = window;
// -----------------------------

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { ThemeProvider } from './Context/ThemeContext.jsx';
import axios from 'axios';
// import 'bootstrap/dist/css/bootstrap.min.css';

axios.defaults.withCredentials = true;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
);
