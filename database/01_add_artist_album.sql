

-- ── ИСПОЛНИТЕЛЬ ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS artist (
    artist_id   SERIAL          PRIMARY KEY,
    name        VARCHAR(255)    NOT NULL,
    bio         TEXT,
    image_url   VARCHAR(500),                  -- обложка / фото исполнителя
    jamendo_id  VARCHAR(50)     UNIQUE,        -- ID исполнителя в Jamendo API
    created_at  TIMESTAMP       DEFAULT NOW()
);

-- ── АЛЬБОМ ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS album (
    album_id    SERIAL          PRIMARY KEY,
    title       VARCHAR(255)    NOT NULL,
    artist_id   INTEGER         NOT NULL REFERENCES artist(artist_id) ON DELETE CASCADE,
    cover_url   VARCHAR(500),                  -- обложка альбома
    jamendo_id  VARCHAR(50)     UNIQUE,        -- ID альбома в Jamendo API
    release_date DATE,
    created_at  TIMESTAMP       DEFAULT NOW()
);

-- ── ИЗМЕНЕНИЯ В ТАБЛИЦЕ TRACK ────────────────────────────────
-- Добавляем недостающие колонки к уже существующей таблице track

ALTER TABLE track
    ADD COLUMN IF NOT EXISTS artist_id   INTEGER REFERENCES artist(artist_id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS album_id    INTEGER REFERENCES album(album_id)   ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS cover_url   VARCHAR(500),   -- обложка трека
    ADD COLUMN IF NOT EXISTS audio_url   VARCHAR(500),   -- прямая ссылка на MP3 (Jamendo)
    ADD COLUMN IF NOT EXISTS jamendo_id  VARCHAR(50) UNIQUE,  -- ID трека в Jamendo
    ADD COLUMN IF NOT EXISTS genre       VARCHAR(100);

ALTER TABLE track
    ALTER COLUMN artist DROP NOT NULL;

INSERT INTO artist (name)
SELECT DISTINCT t.artist
FROM track t
WHERE t.artist IS NOT NULL
  AND TRIM(t.artist) <> ''
  AND NOT EXISTS (
      SELECT 1
      FROM artist a
      WHERE LOWER(a.name) = LOWER(t.artist)
  );

UPDATE track t
SET artist_id = a.artist_id
FROM artist a
WHERE t.artist_id IS NULL
  AND t.artist IS NOT NULL
  AND LOWER(a.name) = LOWER(t.artist);

-- Если в track.artist сейчас VARCHAR — он теперь дублируется artist_id
-- Можно оставить для совместимости или убрать после миграции данных:
-- ALTER TABLE track DROP COLUMN IF EXISTS artist;

-- ── ИНДЕКСЫ ─────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_album_artist     ON album(artist_id);
CREATE INDEX IF NOT EXISTS idx_track_artist     ON track(artist_id);
CREATE INDEX IF NOT EXISTS idx_track_album      ON track(album_id);
CREATE INDEX IF NOT EXISTS idx_artist_jamendo   ON artist(jamendo_id);
CREATE INDEX IF NOT EXISTS idx_album_jamendo    ON album(jamendo_id);
CREATE INDEX IF NOT EXISTS idx_track_jamendo    ON track(jamendo_id);
