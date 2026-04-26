// routes/tracks.js
const router = require('express').Router();
const { requireAuth, optionalAuth } = require('../middleware/auth');
const {
  getTracks, searchTracks, getTrackById, addToHistory
} = require('../db/queries');

// GET /api/tracks?limit=20&offset=0
router.get('/', async (req, res) => {
  try {
    const limit  = Math.min(parseInt(req.query.limit)  || 20, 100);
    const offset = parseInt(req.query.offset) || 0;
    const tracks = await getTracks(limit, offset);
    res.json({ tracks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// GET /api/tracks/search?q=aurora
router.get('/search', async (req, res) => {
  try {
    const { q, limit } = req.query;
    if (!q) return res.status(400).json({ error: 'Укажите параметр q' });
    const tracks = await searchTracks(q, parseInt(limit) || 30);
    res.json({ tracks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// GET /api/tracks/:id
router.get('/:id', async (req, res) => {
  try {
    const track = await getTrackById(req.params.id);
    if (!track) return res.status(404).json({ error: 'Трек не найден' });
    res.json({ track });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// POST /api/tracks/:id/play — записать в историю
router.post('/:id/play', requireAuth, async (req, res) => {
  try {
    await addToHistory(req.user.user_id, req.params.id);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

module.exports = router;
