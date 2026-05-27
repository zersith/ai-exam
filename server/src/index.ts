import express from 'express';
import routes from './routes.js';
import { getDashboardHTML } from './dashboard-page.js';

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;

const app = express();

app.use(express.json());

// CORS — allow GitHub Pages and local dev
app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (_req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }
  next();
});

app.use('/api', routes);

// Protected dashboard — only for zersith
app.get('/dashboard', (_req, res) => {
  res.type('html').send(getDashboardHTML());
});

app.listen(PORT, () => {
  console.log(`ai-exam server running on http://localhost:${PORT}`);
});
