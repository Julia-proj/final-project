// ============================================================
// api/axiosInstance.ts
// ============================================================
// РУС: Это "настроенный" Axios — как почтовый ящик, который
//      АВТОМАТИЧЕСКИ приклеивает марку (JWT токен) к каждому письму.
// ESP: Axios configurado con interceptor para añadir JWT automáticamente.
//
// 📦 ФОРМУЛА: axios.create({ baseURL }) + interceptors
// ============================================================

import axios from 'axios'; // 📦 импортируем библиотеку axios

// ── СОЗДАЁМ ЭКЗЕМПЛЯР ────────────────────────────────────────
// 📦 ФОРМУЛА: axios.create({ baseURL })
// baseURL = адрес нашего бэкенда
// Все запросы будут начинаться с этого адреса
// axiosInstance.get('/auth/me') → GET http://localhost:3000/api/auth/me

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api', // 🎨 адрес нашего Express сервера
});

// ── INTERCEPTOR ──────────────────────────────────────────────
// РУС: Interceptor = перехватчик. Перехватывает КАЖДЫЙ запрос
//      ПЕРЕД отправкой и добавляет токен в заголовок.
// ESP: Interceptor = interceptor. Antes de enviar, añade el token.
//
// 📦 ФОРМУЛА: instance.interceptors.request.use(callback)
// Callback получает config (настройки запроса) и возвращает его модифицированным

axiosInstance.interceptors.request.use((config) => {
  // Берём токен из localStorage (где мы его сохранили при логине)
  const token = localStorage.getItem('token'); // 📦 ФОРМУЛА: getItem('ключ')

  // Если токен есть — добавляем в заголовок Authorization
  if (token) {
    // 📦 ФОРМУЛА: 'Bearer ' + token
    // Слово "Bearer" — это стандарт HTTP для JWT токенов
    // Бэкенд в auth.middleware.js проверяет именно это: startsWith('Bearer ')
    config.headers.Authorization = `Bearer ${token}`;
  }

  // ОБЯЗАТЕЛЬНО возвращаем config (иначе запрос не уйдёт!)
  return config;
});

// Экспортируем настроенный экземпляр — все файлы api/*.ts будут его использовать
export default axiosInstance;