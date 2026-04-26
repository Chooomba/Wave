// routes/auth.js — регистрация и вход
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const { getUserByEmail, createUser } = require('../db/queries');
require('dotenv').config();

const makeToken = (user) => jwt.sign(
  { user_id: user.user_id, username: user.username, email: user.email },
  process.env.JWT_SECRET,
  { expiresIn: process.env.JWT_EXPIRES_IN }
);

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ error: 'Заполните все поля' });

    if (await getUserByEmail(email))
      return res.status(409).json({ error: 'Email уже зарегистрирован' });

    const hash = await bcrypt.hash(password, 10);
    const user = await createUser(username, email, hash);
    res.status(201).json({ token: makeToken(user), user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Заполните все поля' });

    const user = await getUserByEmail(email);
    if (!user) return res.status(401).json({ error: 'Неверный email или пароль' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Неверный email или пароль' });

    const { password: _, ...safeUser } = user;
    res.json({ token: makeToken(safeUser), user: safeUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// GET /api/auth/me
router.get('/me', require('../middleware/auth').requireAuth, async (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
