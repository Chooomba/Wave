-- ============================================================
-- WAVE MUSIC — 03_functions.sql
-- Функции и процедуры — вся бизнес-логика через них
-- ============================================================

-- ── fn_add_to_history ────────────────────────────────────────
-- Записывает прослушивание. Если трек уже есть за последние 30 сек
-- (повторный вызов) — не дублирует запись.
CREATE OR REPLACE FUNCTION fn_add_to_history(
    p_user_id   INTEGER,
    p_track_id  INTEGER
) RETURNS void AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM history
        WHERE user_id  = p_user_id
          AND track_id = p_track_id
          AND played_at > NOW() - INTERVAL '30 seconds'
    ) THEN
        INSERT INTO history (user_id, track_id, played_at)
        VALUES (p_user_id, p_track_id, NOW());
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── fn_get_user_history ──────────────────────────────────────
-- Возвращает историю пользователя через view (с лимитом)
CREATE OR REPLACE FUNCTION fn_get_user_history(
    p_user_id   INTEGER,
    p_limit     INTEGER DEFAULT 50
) RETURNS TABLE (
    history_id   INTEGER,
    track_id     INTEGER,
    track_title  VARCHAR,
    artist_name  VARCHAR,
    album_title  VARCHAR,
    duration     INTEGER,
    audio_url    VARCHAR,
    cover_url    VARCHAR,
    played_at    TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        h.history_id, h.track_id, h.track_title, h.artist_name,
        h.album_title, h.duration, h.audio_url, h.cover_url, h.played_at
    FROM v_user_history h
    WHERE h.user_id = p_user_id
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── fn_get_recommendations ───────────────────────────────────
-- Рекомендации: треки которые пользователь НЕ слушал,
-- но слушали другие пользователи с похожей историей
CREATE OR REPLACE FUNCTION fn_get_recommendations(
    p_user_id   INTEGER,
    p_limit     INTEGER DEFAULT 20
) RETURNS TABLE (
    track_id     INTEGER,
    track_title  VARCHAR,
    artist_name  VARCHAR,
    album_title  VARCHAR,
    audio_url    VARCHAR,
    cover_url    VARCHAR,
    score        BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        vt.track_id,
        vt.title        AS track_title,
        vt.artist_name,
        vt.album_title,
        vt.audio_url,
        vt.cover_url,
        COUNT(*)        AS score
    FROM history h
    JOIN v_track_full vt ON h.track_id = vt.track_id
    WHERE
        -- пользователи у которых похожая история
        h.user_id IN (
            SELECT DISTINCT h2.user_id FROM history h2
            WHERE h2.track_id IN (
                SELECT track_id FROM history WHERE user_id = p_user_id
            )
            AND h2.user_id <> p_user_id
        )
        -- треки которые наш пользователь ещё не слушал
        AND h.track_id NOT IN (
            SELECT track_id FROM history WHERE user_id = p_user_id
        )
    GROUP BY vt.track_id, vt.title, vt.artist_name,
             vt.album_title, vt.audio_url, vt.cover_url
    ORDER BY score DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── sp_create_playlist ───────────────────────────────────────
-- Процедура: создать плейлист для пользователя
CREATE OR REPLACE PROCEDURE sp_create_playlist(
    p_user_id   INTEGER,
    p_name      VARCHAR(255)
) AS $$
BEGIN
    INSERT INTO playlist (user_id, name, created_at)
    VALUES (p_user_id, p_name, NOW());
END;
$$ LANGUAGE plpgsql;

-- ── fn_add_track_to_playlist ─────────────────────────────────
-- Добавить трек в плейлист (с проверкой владельца)
CREATE OR REPLACE FUNCTION fn_add_track_to_playlist(
    p_user_id     INTEGER,
    p_playlist_id INTEGER,
    p_track_id    INTEGER
) RETURNS BOOLEAN AS $$
DECLARE
    v_owner INTEGER;
BEGIN
    SELECT user_id INTO v_owner FROM playlist WHERE playlist_id = p_playlist_id;

    IF v_owner <> p_user_id THEN
        RAISE EXCEPTION 'Access denied: playlist does not belong to this user';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM playlist_track
        WHERE playlist_id = p_playlist_id AND track_id = p_track_id
    ) THEN
        INSERT INTO playlist_track (playlist_id, track_id)
        VALUES (p_playlist_id, p_track_id);
        RETURN TRUE;
    END IF;

    RETURN FALSE; -- трек уже есть
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── fn_remove_track_from_playlist ────────────────────────────
CREATE OR REPLACE FUNCTION fn_remove_track_from_playlist(
    p_user_id     INTEGER,
    p_playlist_id INTEGER,
    p_track_id    INTEGER
) RETURNS BOOLEAN AS $$
DECLARE
    v_owner INTEGER;
BEGIN
    SELECT user_id INTO v_owner FROM playlist WHERE playlist_id = p_playlist_id;

    IF v_owner <> p_user_id THEN
        RAISE EXCEPTION 'Access denied';
    END IF;

    DELETE FROM playlist_track
    WHERE playlist_id = p_playlist_id AND track_id = p_track_id;

    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── fn_search_tracks ─────────────────────────────────────────
-- Поиск треков по названию / исполнителю / жанру
CREATE OR REPLACE FUNCTION fn_search_tracks(
    p_query VARCHAR,
    p_limit INTEGER DEFAULT 30
) RETURNS TABLE (
    track_id     INTEGER,
    track_title  VARCHAR,
    artist_name  VARCHAR,
    album_title  VARCHAR,
    genre        VARCHAR,
    duration     INTEGER,
    audio_url    VARCHAR,
    cover_url    VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        vt.track_id,
        vt.title        AS track_title,
        vt.artist_name,
        vt.album_title,
        vt.genre,
        vt.duration,
        vt.audio_url,
        vt.cover_url
    FROM v_track_full vt
    WHERE
        vt.title        ILIKE '%' || p_query || '%'
        OR vt.artist_name ILIKE '%' || p_query || '%'
        OR vt.album_title ILIKE '%' || p_query || '%'
        OR vt.genre       ILIKE '%' || p_query || '%'
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── fn_get_album_tracks ──────────────────────────────────────
CREATE OR REPLACE FUNCTION fn_get_album_tracks(
    p_album_id INTEGER
) RETURNS TABLE (
    track_id    INTEGER,
    title       VARCHAR,
    artist_name VARCHAR,
    duration    INTEGER,
    audio_url   VARCHAR,
    cover_url   VARCHAR,
    genre       VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        vt.track_id,
        vt.title,
        vt.artist_name,
        vt.duration,
        vt.audio_url,
        vt.cover_url,
        vt.genre
    FROM v_track_full vt
    WHERE vt.album_id = p_album_id
    ORDER BY vt.track_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
