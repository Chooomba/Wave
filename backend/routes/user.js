const router = require('express').Router();
const { requireAuth } = require('../middleware/auth');
const {
  getUserHistory,
  getRecommendations,
  getUserPlaylists,
  getPlaylistTracks,
  createPlaylist,
  addTrackToPlaylist,
  removeTrackFromPlaylist,
  importJamendoTrack,
} = require('../db/queries');

router.use(requireAuth);

router.get('/history', async (req, res) => {
  try {
    const history = await getUserHistory(req.user.user_id, 50);
    res.json({ history });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

router.get('/recommendations', async (req, res) => {
  try {
    const tracks = await getRecommendations(req.user.user_id, 20);
    res.json({ tracks });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

router.get('/playlists', async (req, res) => {
  try {
    const playlists = await getUserPlaylists(req.user.user_id);
    res.json({ playlists });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

router.post('/playlists', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Укажите название' });
    await createPlaylist(req.user.user_id, name);
    res.status(201).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

router.get('/playlists/:id', async (req, res) => {
  try {
    const tracks = await getPlaylistTracks(req.params.id, req.user.user_id);
    res.json({ tracks });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

router.post('/playlists/:id/tracks', async (req, res) => {
  try {
    let { track_id, track } = req.body;

    if (!track_id && !track) {
      return res.status(400).json({ error: 'Укажите track_id или track' });
    }

    if (!track_id && track?.jamendo_id) {
      track_id = await importJamendoTrack(track);
    }

    if (!track_id) {
      return res.status(400).json({ error: 'Не удалось подготовить трек' });
    }

    const added = await addTrackToPlaylist(req.user.user_id, req.params.id, track_id);
    res.json({ ok: true, added });
  } catch (err) {
    if (err.message.includes('Access denied')) {
      return res.status(403).json({ error: 'Нет доступа' });
    }
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

router.delete('/playlists/:id/tracks/:trackId', async (req, res) => {
  try {
    const removed = await removeTrackFromPlaylist(
      req.user.user_id,
      req.params.id,
      req.params.trackId
    );
    res.json({ ok: true, removed });
  } catch (err) {
    if (err.message.includes('Access denied')) {
      return res.status(403).json({ error: 'Нет доступа' });
    }
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

module.exports = router;
