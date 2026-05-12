// db/queries.js вЂ” РІСЃРµ Р·Р°РїСЂРѕСЃС‹ РўРћР›Р¬РљРћ С‡РµСЂРµР· С„СѓРЅРєС†РёРё Рё РїСЂРµРґСЃС‚Р°РІР»РµРЅРёСЏ PostgreSQL
const pool = require('./pool');

// в”Ђв”Ђ РўР Р•РљР в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ

// РџРѕР»СѓС‡РёС‚СЊ С‚СЂРµРєРё С‡РµСЂРµР· view (СЃ РїР°РіРёРЅР°С†РёРµР№)
const getTracks = async (limit = 20, offset = 0) => {
  const { rows } = await pool.query(
    `SELECT * FROM v_track_full LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  return rows;
};

// РџРѕРёСЃРє С‡РµСЂРµР· С„СѓРЅРєС†РёСЋ
const searchTracks = async (query, limit = 30) => {
  const { rows } = await pool.query(
    `SELECT * FROM fn_search_tracks($1, $2)`,
    [query, limit]
  );
  return rows;
};

// РћРґРёРЅ С‚СЂРµРє С‡РµСЂРµР· view
const getTrackById = async (trackId) => {
  const { rows } = await pool.query(
    `SELECT * FROM v_track_full WHERE track_id = $1`,
    [trackId]
  );
  return rows[0] || null;
};

// в”Ђв”Ђ РђР›Р¬Р‘РћРњР« в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ

const getAlbums = async (limit = 20, offset = 0) => {
  const { rows } = await pool.query(
    `SELECT * FROM v_album_full LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  return rows;
};

const getAlbumById = async (albumId) => {
  const { rows } = await pool.query(
    `SELECT * FROM v_album_full WHERE album_id = $1`,
    [albumId]
  );
  return rows[0] || null;
};

const getAlbumTracks = async (albumId) => {
  const { rows } = await pool.query(
    `SELECT * FROM fn_get_album_tracks($1)`,
    [albumId]
  );
  return rows;
};

// в”Ђв”Ђ РРЎРџРћР›РќРРўР•Р›Р в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ

const getArtists = async (limit = 20, offset = 0) => {
  const { rows } = await pool.query(
    `SELECT * FROM v_artist_stats LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  return rows;
};

const getArtistById = async (artistId) => {
  const { rows } = await pool.query(
    `SELECT * FROM v_artist_stats WHERE artist_id = $1`,
    [artistId]
  );
  return rows[0] || null;
};

// в”Ђв”Ђ РРЎРўРћР РРЇ в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ

const addToHistory = async (userId, trackId) => {
  await pool.query(
    `SELECT fn_add_to_history($1, $2)`,
    [userId, trackId]
  );
};

const getUserHistory = async (userId, limit = 50) => {
  const { rows } = await pool.query(
    `SELECT * FROM fn_get_user_history($1, $2)`,
    [userId, limit]
  );
  return rows;
};

// в”Ђв”Ђ Р Р•РљРћРњР•РќР”РђР¦РР в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ

const getRecommendations = async (userId, limit = 20) => {
  const { rows } = await pool.query(
    `SELECT * FROM fn_get_recommendations($1, $2)`,
    [userId, limit]
  );
  return rows;
};

// в”Ђв”Ђ РџР›Р•Р™Р›РРЎРўР« в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ

const getUserPlaylists = async (userId) => {
  const { rows } = await pool.query(
    `SELECT
        p.playlist_id,
        p.name AS playlist_name,
        p.user_id AS playlist_owner
     FROM playlist p
     WHERE p.user_id = $1
     ORDER BY p.created_at DESC, p.playlist_id DESC`,
    [userId]
  );
  return rows;
};

const getPlaylistTracks = async (playlistId, userId) => {
  const ownerCheck = await pool.query(
    `SELECT 1
     FROM playlist
     WHERE playlist_id = $1 AND user_id = $2`,
    [playlistId, userId]
  );

  if (!ownerCheck.rowCount) {
    throw new Error('Access denied');
  }

  const { rows } = await pool.query(
    `SELECT * FROM v_playlist_tracks
     WHERE playlist_id = $1`,
    [playlistId]
  );
  return rows;
};

const createPlaylist = async (userId, name) => {
  await pool.query(
    `CALL sp_create_playlist($1, $2)`,
    [userId, name]
  );
};

const addTrackToPlaylist = async (userId, playlistId, trackId) => {
  const { rows } = await pool.query(
    `SELECT fn_add_track_to_playlist($1, $2, $3) AS result`,
    [userId, playlistId, trackId]
  );
  return rows[0].result;
};

const removeTrackFromPlaylist = async (userId, playlistId, trackId) => {
  const { rows } = await pool.query(
    `SELECT fn_remove_track_from_playlist($1, $2, $3) AS result`,
    [userId, playlistId, trackId]
  );
  return rows[0].result;
};

const importJamendoTrack = async (track) => {
  const artistId = await upsertArtist(
    String(track.artist_jamendo_id || track.artist_id || track.artist_name),
    track.artist_name,
    track.artist_image || null
  );

  const albumId = await upsertAlbum(
    String(track.album_jamendo_id || track.album_id || `${track.artist_name}-${track.album_title || 'single'}`),
    track.album_title || 'Single',
    artistId,
    track.album_cover || track.cover_url || null,
    track.album_release || null
  );

  return upsertTrack({
    jamendoId: String(track.jamendo_id),
    title: track.track_title || track.title,
    artistName: track.artist_name,
    duration: track.duration,
    audioUrl: track.audio_url,
    coverUrl: track.cover_url,
    genre: track.genre || null,
    artistId,
    albumId,
  });
};

// в”Ђв”Ђ РџРћР›Р¬Р—РћР’РђРўР•Р›Р в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ

const getUserByEmail = async (email) => {
  const { rows } = await pool.query(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  );
  return rows[0] || null;
};

const getUserById = async (userId) => {
  const { rows } = await pool.query(
    `SELECT user_id, username, email FROM users WHERE user_id = $1`,
    [userId]
  );
  return rows[0] || null;
};

const createUser = async (username, email, hashedPassword) => {
  const { rows } = await pool.query(
    `INSERT INTO users  (username, email, password)
     VALUES ($1, $2, $3) RETURNING user_id, username, email`,
    [username, email, hashedPassword]
  );
  return rows[0];
};

// в”Ђв”Ђ JAMENDO: СЃРѕС…СЂР°РЅРёС‚СЊ С‚СЂРµРєРё РёР· API РІ Р‘Р” в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ

const upsertArtist = async (jamendoId, name, imageUrl) => {
  const { rows } = await pool.query(
    `INSERT INTO artist (jamendo_id, name, image_url)
     VALUES ($1, $2, $3)
     ON CONFLICT (jamendo_id) DO UPDATE
       SET name = EXCLUDED.name, image_url = EXCLUDED.image_url
     RETURNING artist_id`,
    [jamendoId, name, imageUrl]
  );
  return rows[0].artist_id;
};

const upsertAlbum = async (jamendoId, title, artistId, coverUrl, releaseDate) => {
  const { rows } = await pool.query(
    `INSERT INTO album (jamendo_id, title, artist_id, cover_url, release_date)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (jamendo_id) DO UPDATE
       SET title = EXCLUDED.title, cover_url = EXCLUDED.cover_url
     RETURNING album_id`,
    [jamendoId, title, artistId, coverUrl, releaseDate]
  );
  return rows[0].album_id;
};

const upsertTrack = async ({ jamendoId, title, duration, audioUrl, coverUrl, genre, artistId, albumId, artistName }) => {
  const { rows } = await pool.query(
    `INSERT INTO track (jamendo_id, title, artist, duration, audio_url, cover_url, genre, artist_id, album_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     ON CONFLICT (jamendo_id) DO UPDATE
       SET title = EXCLUDED.title, audio_url = EXCLUDED.audio_url,
           cover_url = EXCLUDED.cover_url, genre = EXCLUDED.genre,
           artist = EXCLUDED.artist, artist_id = EXCLUDED.artist_id,
           album_id = EXCLUDED.album_id
     RETURNING track_id`,
    [jamendoId, title, artistName || null, duration, audioUrl, coverUrl, genre, artistId, albumId]
  );
  return rows[0].track_id;
};

module.exports = {
  getTracks, searchTracks, getTrackById,
  getAlbums, getAlbumById, getAlbumTracks,
  getArtists, getArtistById,
  addToHistory, getUserHistory,
  getRecommendations,
  getUserPlaylists, getPlaylistTracks, createPlaylist,
  addTrackToPlaylist, removeTrackFromPlaylist, importJamendoTrack,
  getUserByEmail, getUserById, createUser,
  upsertArtist, upsertAlbum, upsertTrack,
};

