const router = require('express').Router();
const { requireAuth } = require('../middleware/auth');
const pool = require('../db/pool');

require('dotenv').config();

const parseList = (value) =>
  String(value || '')
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

const canUseAdminByUser = (user) => {
  const adminEmails = parseList(process.env.ADMIN_EMAILS);
  const adminUsernames = parseList(process.env.ADMIN_USERNAMES);

  if (!adminEmails.length && !adminUsernames.length) {
    return true;
  }

  return adminEmails.includes(String(user.email || '').toLowerCase()) ||
    adminUsernames.includes(String(user.username || '').toLowerCase());
};

const requireAdminPassword = (req, res, next) => {
  const expected = String(process.env.ADMIN_PANEL_PASSWORD || '').trim();
  if (!expected) return next();

  const actual = String(req.headers['x-admin-password'] || '').trim();
  if (actual !== expected) {
    return res.status(401).json({ error: 'Неверный пароль админ-панели' });
  }

  next();
};

router.use(requireAuth);
router.use((req, res, next) => {
  if (!canUseAdminByUser(req.user)) {
    return res.status(403).json({ error: 'Нет доступа к админ-панели' });
  }
  next();
});
router.use(requireAdminPassword);

router.get('/summary', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        (SELECT COUNT(*)::int FROM users) AS users_count,
        (SELECT COUNT(*)::int FROM track) AS tracks_count,
        (SELECT COUNT(*)::int FROM album) AS albums_count,
        (SELECT COUNT(*)::int FROM artist) AS artists_count,
        (SELECT COUNT(*)::int FROM playlist) AS playlists_count,
        (SELECT COUNT(*)::int FROM history) AS plays_count
    `);

    res.json({ summary: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

router.get('/users', async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 20, 100);
    const { rows } = await pool.query(
      `SELECT
          u.user_id,
          u.username,
          u.email,
          COUNT(DISTINCT p.playlist_id)::int AS playlists_count,
          COUNT(DISTINCT h.history_id)::int AS plays_count
       FROM users u
       LEFT JOIN playlist p ON p.user_id = u.user_id
       LEFT JOIN history h ON h.user_id = u.user_id
       GROUP BY u.user_id, u.username, u.email
       ORDER BY u.user_id DESC
       LIMIT $1`,
      [limit]
    );

    res.json({ users: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

router.get('/playlists', async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 20, 100);
    const { rows } = await pool.query(
      `SELECT
          p.playlist_id,
          p.name AS playlist_name,
          p.created_at,
          u.username,
          COUNT(pt.id)::int AS tracks_count
       FROM playlist p
       JOIN users u ON u.user_id = p.user_id
       LEFT JOIN playlist_track pt ON pt.playlist_id = p.playlist_id
       GROUP BY p.playlist_id, p.name, p.created_at, u.username
       ORDER BY p.created_at DESC, p.playlist_id DESC
       LIMIT $1`,
      [limit]
    );

    res.json({ playlists: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

router.get('/tracks', async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 20, 100);
    const { rows } = await pool.query(
      `SELECT
          track_id,
          title AS track_title,
          artist_name,
          album_title,
          duration,
          jamendo_id,
          audio_url
       FROM v_track_full
       ORDER BY track_id DESC
       LIMIT $1`,
      [limit]
    );

    res.json({ tracks: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

module.exports = router;
