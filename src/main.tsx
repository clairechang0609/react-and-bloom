import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap';
import "bootstrap-icons/font/bootstrap-icons.css";
import './assets/app.scss';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
