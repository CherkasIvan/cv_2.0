// @ts-nocheck
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env['PORT'] || 4000;

// 🔧 Универсальный прокси с умной маршрутизацией
const universalProxy = createProxyMiddleware({
  target: 'http://localhost:3000',
  changeOrigin: true,
  secure: false,
  logLevel: 'debug' as any,
  pathRewrite: (path, req) => {
    console.log(`🔄 Original path: ${path}`);
    
    // API маршруты
    if (path.startsWith('/api')) {
      return path.replace('/api', '/api/v1');
    }
    
    // i18n маршруты
    if (path.startsWith('/i18n')) {
      return path.replace('/i18n', '/api/v1/i18n');
    }
    
    // Остальные маршруты как есть
    return path;
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`📡 ${req.method} ${req.originalUrl} -> http://localhost:3000${proxyReq.path}`);
  },
  onError: (err, req, res) => {
    console.error('❌ Proxy error:', err.message);
    
    // 🔧 Заглушки для популярных эндпоинтов
    if (req.path === '/person/state') {
      return res.json({
        isFirstTime: true,
        isGuest: true,
        user: null,
        route: '/auth',
        experienceRoute: 'work',
        technologiesRoute: 'technologies',
        subTechnologiesRoute: 'frontend',
        isDark: false,
        language: 'ru'
      });
    }
    
    if (req.path.startsWith('/firebase/images/')) {
      return res.json([]);
    }
    
    res.status(503).json({ error: 'Service Unavailable' });
  }
});

// 🔧 Применяем прокси ко всем API маршрутам
app.use(['/api', '/auth', '/firebase', '/person', '/template', '/i18n'], universalProxy);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    backend: 'http://localhost:3000',
    i18n: 'http://localhost:3000/api/v1/i18n'
  });
});

// 🔧 Дополнительные заглушки
app.get('/person/state', (req, res) => {
  console.log('⚠️ Using stub for /person/state');
  res.json({
    isFirstTime: true,
    isGuest: true,
    user: null,
    route: '/auth',
    experienceRoute: 'work',
    technologiesRoute: 'technologies',
    subTechnologiesRoute: 'frontend',
    isDark: false,
    language: 'ru'
  });
});

// Логирование
app.use((req, res, next) => {
  console.log(`🔍 ${req.method} ${req.originalUrl}`);
  next();
});

// Статика
app.use(express.static(join(__dirname, '../browser')));

// Angular app
app.get('*', (req, res) => {
  console.log(`📄 Angular: ${req.path}`);
  res.sendFile(join(__dirname, '../browser/index.html'));
});

app.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log(`🚀 Server: http://localhost:${PORT}`);
  console.log(`📡 Backend: http://localhost:3000`);
  console.log(`🔗 i18n: /i18n/* -> /api/v1/i18n/*`);
  console.log('='.repeat(60));
});