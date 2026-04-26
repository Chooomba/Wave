// routes/jamendo.js — получение музыки из Jamendo API и синхронизация с БД
const router  = require('express').Router();
const fetch   = require('node-fetch');
const { upsertArtist, upsertAlbum, upsertTrack } = require('../db/queries');
require('dotenv').config();

const CLIENT_ID = process.env.JAMENDO_CLIENT_ID;
const BASE      = process.env.JAMENDO_BASE_URL;

// Вспомогательная функция запроса к Jamendo
const jamendoGet = async (endpoint, params = {}) => {
  const url = new URL(`${BASE}/${endpoint}/`);
  url.searchParams.set('client_id', CLIENT_ID);
  url.searchParams.set('format', 'json');
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Jamendo error: ${res.status}`);
  return res.json();
};

// ── Синхронизация треков из Jamendo в БД ─────────────────────
// Jamendo возвращает треки с artist и album уже включёнными
const syncTracksFromJamendo = async (tracks) => {
  const results = [];

  for (const t of tracks) {
    try {
      // 1. Upsert исполнителя
      const artistId = await upsertArtist(
        String(t.artist_id),
        t.artist_name,
        t.artist_image || null
      );

      // 2. Upsert альбома
      const albumId = await upsertAlbum(
        String(t.album_id),
        t.album_name,
        artistId,
        t.album_image || t.image || null,
        t.releasedate || null
      );

      // 3. Upsert трека
      const trackId = await upsertTrack({
        jamendoId : String(t.id),
        title     : t.name,
        artistName: t.artist_name,
        duration  : t.duration,
        audioUrl  : t.audio,       // прямая ссылка на MP3
        coverUrl  : t.image,
        genre     : t.musicinfo?.tags?.genres?.[0] || null,
        artistId,
        albumId,
      });

      results.push({ trackId, title: t.name });
    } catch (err) {
      console.error('Ошибка upsert трека:', t.name, err.message);
    }
  }
  return results;
};

// GET /api/jamendo/tracks?limit=20&search=ambient
// Получает треки из Jamendo и возвращает БЕЗ сохранения (для быстрого поиска)
router.get('/tracks', async (req, res) => {
  try {
    const { limit = 20, search, genre, offset = 0 } = req.query;
    const params = {
      limit,
      offset,
      include: 'musicinfo',
      audioformat: 'mp32',
      imagesize: '200',
    };
    if (search) params.search = search;
    if (genre)  params.tags   = genre;

    const data = await jamendoGet('tracks', params);
    res.json({ tracks: data.results, total: data.headers?.results_count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка Jamendo API' });
  }
});

// POST /api/jamendo/sync?limit=50
// Синхронизирует треки из Jamendo в нашу БД
router.post('/sync', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 200);
    const { search, genre } = req.query;
    const params = {
      limit,
      include : 'musicinfo',
      audioformat: 'mp32',
      imagesize: '200',
    };
    if (search) params.search = search;
    if (genre)  params.tags   = genre;

    const data    = await jamendoGet('tracks', params);
    const synced  = await syncTracksFromJamendo(data.results);
    res.json({ synced: synced.length, tracks: synced });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка синхронизации' });
  }
});

// GET /api/jamendo/albums?limit=20
router.get('/albums', async (req, res) => {
  try {
    const { limit = 20, search, offset = 0 } = req.query;
    const params = { limit, offset, imagesize: '200' };
    if (search) params.search = search;
    const data = await jamendoGet('albums', params);
    res.json({ albums: data.results });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка Jamendo API' });
  }
});

// GET /api/jamendo/search?q=aurora&type=tracks|albums|artists
router.get('/search', async (req, res) => {
  try {
    const { q, type = 'tracks', limit = 20 } = req.query;
    if (!q) return res.status(400).json({ error: 'Укажите параметр q' });

    const params = { search: q, limit, audioformat: 'mp32', imagesize: '200' };
    const data   = await jamendoGet(type, params);
    res.json({ results: data.results, type });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка Jamendo API' });
  }
});

module.exports = router;
