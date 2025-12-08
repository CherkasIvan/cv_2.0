// @ts-nocheck
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env['PORT'] || 4000;

// 🔧 Создаем отдельные прокси для каждого маршрута
const createApiProxy = (options: any) => {
  const defaultOptions = {
    target: 'http://localhost:3000',
    changeOrigin: true,
    secure: false,
    logLevel: 'debug' as any,
    onProxyReq: (proxyReq: any, req: any, res: any) => {
      console.log(`📡 Proxying: ${req.method} ${req.originalUrl} -> ${proxyReq.path}`);
    },
    onError: (err: any, req: any, res: any) => {
      console.error('❌ Proxy error:', err.message);
      res.status(500).json({ error: 'Proxy error', message: err.message });
    }
  };

  return createProxyMiddleware({ ...defaultOptions, ...options });
};

// 🔧 ФИКС: Используем регулярные выражения вместо wildcard
app.use(/^\/api/, createApiProxy({ 
  pathRewrite: { '^/api': '/api/v1' }
}));

app.use(/^\/auth/, createApiProxy({}));
app.use(/^\/firebase/, createApiProxy({}));
app.use(/^\/person/, createApiProxy({}));
app.use(/^\/template/, createApiProxy({}));
app.use(/^\/i18n/, createApiProxy({}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'cv-portfolio',
    timestamp: new Date().toISOString(),
    environment: process.env['NODE_ENV'] || 'development'
  });
});

// 🔧 Логирование всех входящих запросов
app.use((req, res, next) => {
  console.log(`🔍 Incoming: ${req.method} ${req.originalUrl}`);
  next();
});

// Статические файлы из Angular build
app.use('/assets', express.static(join(__dirname, '../browser/assets'), {
  maxAge: '1y'
}));

app.use(express.static(join(__dirname, '../browser'), {
  maxAge: '1y',
  index: false
}));

// 🔧 ФИКС: Используем регулярное выражение вместо '*'
app.get(/.*/, (req, res, next) => {
  // 🔧 Пропускаем API запросы
  if (req.path.startsWith('/api') || 
      req.path.startsWith('/auth') ||
      req.path.startsWith('/firebase') ||
      req.path.startsWith('/person') ||
      req.path.startsWith('/template') ||
      req.path.startsWith('/i18n') ||
      req.path === '/health') {
    return next();
  }
  
  console.log(`📄 Serving Angular app for: ${req.path}`);
  res.sendFile(join(__dirname, '../browser/index.csr.html'));
});

app.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log(`🚀 CV Portfolio Server запущен!`);
  console.log(`🌐 Frontend URL: http://localhost:${PORT}`);
  console.log(`📡 API Backend:  http://localhost:3000`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
  console.log('='.repeat(60));
});