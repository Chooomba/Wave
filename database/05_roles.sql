-- ============================================================
-- WAVE MUSIC — 05_roles.sql
-- Роли PostgreSQL и разграничение доступа
-- ============================================================

-- ── СОЗДАНИЕ РОЛЕЙ ───────────────────────────────────────────
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'wave_user') THEN
        CREATE ROLE wave_user LOGIN PASSWORD 'wave_user_pass';
    END IF;
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'wave_admin') THEN
        CREATE ROLE wave_admin LOGIN PASSWORD 'wave_admin_pass';
    END IF;
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'wave_api') THEN
        -- Роль для Node.js backend (читает и пишет через функции)
        CREATE ROLE wave_api LOGIN PASSWORD 'wave_api_pass';
    END IF;
END $$;

-- ── wave_user: обычный пользователь ─────────────────────────
-- Читает данные только через Views и Functions (не напрямую)
GRANT USAGE ON SCHEMA public TO wave_user;

-- Доступ к представлениям (только чтение)
GRANT SELECT ON v_track_full        TO wave_user;
GRANT SELECT ON v_album_full        TO wave_user;
GRANT SELECT ON v_artist_stats      TO wave_user;
GRANT SELECT ON v_playlist_tracks   TO wave_user;
GRANT SELECT ON v_user_history      TO wave_user;

-- Доступ к своей истории и плейлистам (через функции)
GRANT EXECUTE ON FUNCTION fn_add_to_history(INTEGER, INTEGER)              TO wave_user;
GRANT EXECUTE ON FUNCTION fn_get_user_history(INTEGER, INTEGER)            TO wave_user;
GRANT EXECUTE ON FUNCTION fn_get_recommendations(INTEGER, INTEGER)         TO wave_user;
GRANT EXECUTE ON FUNCTION fn_search_tracks(VARCHAR, INTEGER)               TO wave_user;
GRANT EXECUTE ON FUNCTION fn_get_album_tracks(INTEGER)                     TO wave_user;
GRANT EXECUTE ON FUNCTION fn_add_track_to_playlist(INTEGER,INTEGER,INTEGER) TO wave_user;
GRANT EXECUTE ON FUNCTION fn_remove_track_from_playlist(INTEGER,INTEGER,INTEGER) TO wave_user;
GRANT EXECUTE ON PROCEDURE sp_create_playlist(INTEGER, VARCHAR)            TO wave_user;

-- Запрещаем прямой доступ к базовым таблицам для wave_user
REVOKE ALL ON TABLE track         FROM wave_user;
REVOKE ALL ON TABLE artist        FROM wave_user;
REVOKE ALL ON TABLE album         FROM wave_user;
REVOKE ALL ON TABLE history       FROM wave_user;
REVOKE ALL ON TABLE playlist      FROM wave_user;
REVOKE ALL ON TABLE playlist_track FROM wave_user;
REVOKE ALL ON TABLE users         FROM wave_user;

-- ── wave_admin: администратор ────────────────────────────────
-- Полный доступ ко всем таблицам
GRANT USAGE ON SCHEMA public TO wave_admin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO wave_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO wave_admin;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO wave_admin;

-- ── wave_api: роль для Node.js backend ───────────────────────
-- Читает/пишет через функции и views, но не напрямую в таблицы
GRANT USAGE ON SCHEMA public TO wave_api;

GRANT SELECT ON v_track_full        TO wave_api;
GRANT SELECT ON v_album_full        TO wave_api;
GRANT SELECT ON v_artist_stats      TO wave_api;
GRANT SELECT ON v_playlist_tracks   TO wave_api;
GRANT SELECT ON v_user_history      TO wave_api;

-- API может читать таблицы пользователей (для аутентификации)
GRANT SELECT ON users TO wave_api;
-- Может вставлять нового пользователя
GRANT INSERT ON users TO wave_api;
GRANT USAGE, SELECT ON SEQUENCE users_user_id_seq TO wave_api;
GRANT SELECT, INSERT, UPDATE ON artist TO wave_api;
GRANT SELECT, INSERT, UPDATE ON album TO wave_api;
GRANT SELECT, INSERT, UPDATE ON track TO wave_api;
GRANT USAGE, SELECT ON SEQUENCE artist_artist_id_seq TO wave_api;
GRANT USAGE, SELECT ON SEQUENCE album_album_id_seq TO wave_api;
GRANT USAGE, SELECT ON SEQUENCE track_track_id_seq TO wave_api;

-- Все функции доступны API-роли
GRANT EXECUTE ON ALL FUNCTIONS  IN SCHEMA public TO wave_api;
GRANT EXECUTE ON ALL PROCEDURES IN SCHEMA public TO wave_api;

-- ── КОММЕНТАРИИ: как применять в Node.js ─────────────────────
/*
  В backend/db/pool.js подключаться как wave_api:

  const pool = new Pool({
    user:     'wave_api',
    password: 'wave_api_pass',
    host:     'localhost',
    database: 'wave_db',
    port:     5432,
  });

  Тогда Node.js может:
    - Читать данные через Views
    - Вызывать Functions/Procedures
    - Вставлять пользователей при регистрации
    - НО не может напрямую DELETE/UPDATE треки или пользователей
      (это только через wave_admin)
*/
