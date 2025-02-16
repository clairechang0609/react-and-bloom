import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap';
import "bootstrap-icons/font/bootstrap-icons.css";
import './assets/app.scss';
import App from './App.tsx';
import { store } from './store'
import { Provider } from 'react-redux'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
)
