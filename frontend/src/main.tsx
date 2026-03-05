import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux'; // 📦 ФОРМУЛА: оборачиваем в Provider
import { store } from './store/store';  // наш Redux store
import App from './App.tsx';
import './index.css'; // стили Tailwind

// 📦 ФОРМУЛА: createRoot(element).render(<App />)
// getElementById('root') — ищем div#root в index.html
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Provider store={store} — делает Redux доступным везде ниже */}
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
