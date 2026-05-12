

-- ── v_track_full — полная информация о треке ─────────────────
CREATE OR REPLACE VIEW v_track_full AS
SELECT
    t.track_id,
    t.title,
    t.duration,
    t.audio_url,
    t.cover_url,
    t.genre,
    t.jamendo_id,
    a.artist_id,
    a.name          AS artist_name,
    a.image_url     AS artist_image,
    al.album_id,
    al.title        AS album_title,
    al.cover_url    AS album_cover,
    al.release_date AS album_release
FROM track t
LEFT JOIN artist a  ON t.artist_id = a.artist_id
LEFT JOIN album  al ON t.album_id  = al.album_id;

-- ── v_album_full — альбом с исполнителем и кол-вом треков ────
CREATE OR REPLACE VIEW v_album_full AS
SELECT
    al.album_id,
    al.title,
    al.cover_url,
    al.release_date,
    al.jamendo_id,
    a.artist_id,
    a.name          AS artist_name,
    a.image_url     AS artist_image,
    COUNT(t.track_id) AS track_count
FROM album al
JOIN artist a       ON al.artist_id = a.artist_id
LEFT JOIN track t   ON t.album_id   = al.album_id
GROUP BY al.album_id, al.title, al.cover_url, al.release_date,
         al.jamendo_id, a.artist_id, a.name, a.image_url;

-- ── v_user_history — история прослушиваний с деталями ────────
CREATE OR REPLACE VIEW v_user_history AS
SELECT
    h.history_id,
    h.user_id,
    h.played_at,
    t.track_id,
    t.title         AS track_title,
    t.duration,
    t.audio_url,
    t.cover_url,
    a.name          AS artist_name,
    al.title        AS album_title
FROM history h
JOIN track  t   ON h.track_id  = t.track_id
LEFT JOIN artist a  ON t.artist_id = a.artist_id
LEFT JOIN album  al ON t.album_id  = al.album_id
ORDER BY h.played_at DESC;

-- ── v_playlist_tracks — треки плейлиста с деталями ───────────
CREATE OR REPLACE VIEW v_playlist_tracks AS
SELECT
    pt.id           AS playlist_track_id,
    pt.playlist_id,
    p.name          AS playlist_name,
    p.user_id       AS playlist_owner,
    t.track_id,
    t.title         AS track_title,
    t.duration,
    t.audio_url,
    t.cover_url,
    a.name          AS artist_name,
    al.title        AS album_title
FROM playlist_track pt
JOIN playlist p     ON pt.playlist_id = p.playlist_id
JOIN track    t     ON pt.track_id    = t.track_id
LEFT JOIN artist a  ON t.artist_id    = a.artist_id
LEFT JOIN album  al ON t.album_id     = al.album_id;

-- ── v_artist_stats — исполнитель + кол-во альбомов и треков ──
CREATE OR REPLACE VIEW v_artist_stats AS
SELECT
    a.artist_id,
    a.name,
    a.bio,
    a.image_url,
    COUNT(DISTINCT al.album_id)  AS album_count,
    COUNT(DISTINCT t.track_id)   AS track_count
FROM artist a
LEFT JOIN album al ON al.artist_id = a.artist_id
LEFT JOIN track t  ON t.artist_id  = a.artist_id
GROUP BY a.artist_id, a.name, a.bio, a.image_url;
