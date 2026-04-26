// routes/albums.js
const router = require('express').Router();
const { getAlbums, getAlbumById, getAlbumTracks } = require('../db/queries');

// GET /api/albums
router.get('/', async (req, res) => {
  try {
    const limit  = Math.min(parseInt(req.query.limit) || 20, 100);
    const offset = parseInt(req.query.offset) || 0;
    const albums = await getAlbums(limit, offset);
    res.json({ albums });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// GET /api/albums/:id
router.get('/:id', async (req, res) => {
  try {
    const album = await getAlbumById(req.params.id);
    if (!album) return res.status(404).json({ error: 'Альбом не найден' });
    res.json({ album });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// GET /api/albums/:id/tracks
router.get('/:id/tracks', async (req, res) => {
  try {
    const tracks = await getAlbumTracks(req.params.id);
    res.json({ tracks });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

module.exports = router;
