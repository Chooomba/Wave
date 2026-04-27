# Wave — Music Streaming Service

Стриминговый сервис для прослушивания музыки. Использует Jamendo API для получения треков.

## Стек

- **Frontend** — HTML, CSS, Vanilla JS
- **Backend** — Node.js + Express
- **База данных** — PostgreSQL
- **Музыка** — Jamendo API

## Структура проекта

```
wave/
├── frontend/           ← Все HTML страницы + стили
│   ├── index.html      ← Главная
│   ├── search.html     ← Поиск
│   ├── browse.html     ← Обзор жанров
│   ├── favorites.html  ← История
│   ├── playlists.html  ← Плейлисты
│   ├── albums.html     ← Альбомы
│   ├── login.html      ← Вход
│   ├── register.html   ← Регистрация
│   ├── shared.css      ← Общие стили
│   ├── shared.js       ← Sidebar + аудиоплеер
│   └── api.js          ← Клиент для backend API
├── backend/            ← Node.js сервер
│   ├── server.js       ← Точка входа
│   ├── .env            ← Переменные окружения
│   ├── package.json
│   ├── db/
│   │   ├── pool.js     ← Подключение к PostgreSQL
│   │   └── queries.js  ← Все запросы через функции/views
│   ├── middleware/
│   │   └── auth.js     ← JWT авторизация
│   └── routes/
│       ├── auth.js     ← /api/auth
│       ├── tracks.js   ← /api/tracks
│       ├── albums.js   ← /api/albums
│       ├── artists.js  ← /api/artists
│       ├── user.js     ← /api/user
│       └── jamendo.js  ← /api/jamendo
└── database/           ← SQL файлы
    ├── 01_add_artist_album.sql  ← Новые таблицы
    ├── 02_views.sql             ← Представления
    ├── 03_functions.sql         ← Функции и процедуры
    ├── 04_triggers.sql          ← Триггеры
    └── 05_roles.sql             ← Роли PostgreSQL
```

---

## Установка и запуск

### 1. Клонировать репозиторий

```bash
git clone https://github.com/ВАШ_НИК/wave.git
cd wave
```

### 2. Настроить базу данных

```bash
# Создать БД
psql -U postgres -c "CREATE DATABASE wave_db;"

# Применить базовую схему
psql -U postgres -d wave_db -f database/table.sql

# Применить новые таблицы и объекты
psql -U postgres -d wave_db -f database/01_add_artist_album.sql
psql -U postgres -d wave_db -f database/02_views.sql
psql -U postgres -d wave_db -f database/03_functions.sql
psql -U postgres -d wave_db -f database/04_triggers.sql
psql -U postgres -d wave_db -f database/05_roles.sql

# Опционально: загрузить тестовые данные до Jamendo sync
psql -U postgres -d wave_db -f database/test_data.sql
```

### 3. Настроить backend

```bash
cd backend

# Установить зависимости
npm install

# Файл backend/.env уже есть в проекте, нужно только проверить его значения
```

Отредактировать `.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=wave_db
DB_USER=wave_api
DB_PASSWORD=wave_api_pass
JWT_SECRET=придумайте_секретный_ключ
JWT_EXPIRES_IN=7d
PORT=3000
JAMENDO_CLIENT_ID=68ca9d5f
JAMENDO_BASE_URL=https://api.jamendo.com/v3.0
```

### 4. Запустить сервер

```bash
# В папке backend/
npm start

# Или в режиме разработки (авто-перезапуск)
npm run dev
```

Сервер запустится на `http://localhost:3000`

### 5. Загрузить музыку из Jamendo в БД

```bash
# Синхронизировать 50 треков
curl -X POST http://localhost:3000/api/jamendo/sync?limit=50

# Или открыть в браузере после входа
# http://localhost:3000
```

### 6. Открыть сайт

```
http://localhost:3000
```

---

## API Endpoints

| Метод | URL | Описание |
|-------|-----|----------|
| POST | `/api/auth/register` | Регистрация |
| POST | `/api/auth/login` | Вход |
| GET  | `/api/tracks` | Список треков |
| GET  | `/api/tracks/search?q=` | Поиск треков |
| POST | `/api/tracks/:id/play` | Записать прослушивание |
| GET  | `/api/albums` | Список альбомов |
| GET  | `/api/albums/:id/tracks` | Треки альбома |
| GET  | `/api/artists` | Список исполнителей |
| GET  | `/api/user/history` | История пользователя |
| GET  | `/api/user/recommendations` | Рекомендации |
| GET  | `/api/user/playlists` | Плейлисты |
| POST | `/api/user/playlists` | Создать плейлист |
| POST | `/api/jamendo/sync` | Синхронизация с Jamendo |

---

## Роли PostgreSQL

| Роль | Права |
|------|-------|
| `wave_api` | Читает views, вызывает функции — используется Node.js |
| `wave_user` | Ограниченный доступ только через функции |
| `wave_admin` | Полный доступ ко всем таблицам |
