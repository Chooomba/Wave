// middleware/auth.js — проверка JWT токена
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Обязательная авторизация
const requireAuth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Не авторизован' });
  }

  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { user_id, username, email }
    next();
  } catch {
    return res.status(401).json({ error: 'Токен недействителен' });
  }
};

// Опциональная авторизация (не блокирует, но добавляет req.user если есть токен)
const optionalAuth = (req, res, next) => {
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) {
    try {
      req.user = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
    } catch {
      req.user = null;
    }
  }
  next();
};

module.exports = { requireAuth, optionalAuth };
