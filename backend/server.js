// server.js — главный файл Express сервера
require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');

const app = express();

// ── MIDDLEWARE ────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// Статические файлы фронтенда
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// ── API РОУТЫ ─────────────────────────────────────────────────
app.use('/api/auth',    require('./routes/auth'));
app.use('/api/tracks',  require('./routes/tracks'));
app.use('/api/albums',  require('./routes/albums'));
app.use('/api/artists', require('./routes/artists'));
app.use('/api/user',    require('./routes/user'));
app.use('/api/jamendo', require('./routes/jamendo'));

// ── HEALTH CHECK ──────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// ── SPA FALLBACK — все остальные запросы → index.html ─────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// ── СТАРТ ─────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🎵 Wave server running at http://localhost:${PORT}`);
});
