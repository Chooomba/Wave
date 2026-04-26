-- ============================================================
-- WAVE MUSIC — 04_triggers.sql
-- Триггеры — автоматизация
-- ============================================================

-- ── Триггер: проверка существования трека перед добавлением ──
-- в историю и плейлист

CREATE OR REPLACE FUNCTION trg_fn_check_track_exists()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM track WHERE track_id = NEW.track_id) THEN
        RAISE EXCEPTION 'Track with id % does not exist', NEW.track_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_history_check_track
    BEFORE INSERT ON history
    FOR EACH ROW EXECUTE FUNCTION trg_fn_check_track_exists();

CREATE TRIGGER trg_playlist_track_check_track
    BEFORE INSERT ON playlist_track
    FOR EACH ROW EXECUTE FUNCTION trg_fn_check_track_exists();

-- ── Триггер: при добавлении Jamendo-трека заполнить artist ───
-- Если в track.artist_id пусто, но есть artist с таким именем — проставить
CREATE OR REPLACE FUNCTION trg_fn_auto_link_artist()
RETURNS TRIGGER AS $$
DECLARE
    v_artist_id INTEGER;
BEGIN
    -- если artist_id уже проставлен — ничего не делаем
    IF NEW.artist_id IS NOT NULL THEN
        RETURN NEW;
    END IF;

    -- ищем исполнителя по имени (поле artist если оно VARCHAR)
    -- адаптируй под своё поле если нужно
    IF NEW.artist IS NOT NULL THEN
        SELECT artist_id INTO v_artist_id
        FROM artist WHERE LOWER(name) = LOWER(NEW.artist) LIMIT 1;

        IF v_artist_id IS NOT NULL THEN
            NEW.artist_id = v_artist_id;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Раскомментировать если в track есть VARCHAR поле artist:
-- CREATE TRIGGER trg_track_auto_link_artist
--     BEFORE INSERT ON track
--     FOR EACH ROW EXECUTE FUNCTION trg_fn_auto_link_artist();
