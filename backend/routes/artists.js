// routes/artists.js
const router = require('express').Router();
const { getArtists, getArtistById } = require('../db/queries');

// GET /api/artists
router.get('/', async (req, res) => {
  try {
    const limit  = Math.min(parseInt(req.query.limit) || 20, 100);
    const offset = parseInt(req.query.offset) || 0;
    const artists = await getArtists(limit, offset);
    res.json({ artists });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// GET /api/artists/:id
router.get('/:id', async (req, res) => {
  try {
    const artist = await getArtistById(req.params.id);
    if (!artist) return res.status(404).json({ error: 'Исполнитель не найден' });
    res.json({ artist });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

module.exports = router;
