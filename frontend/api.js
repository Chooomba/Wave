// api.js — единый клиент для всех запросов к backend
const API = (() => {
  const BASE = '/api';

  const getToken = () => localStorage.getItem('wave_token');
  const getUser  = () => JSON.parse(localStorage.getItem('wave_user') || 'null');

  const headers = (extra = {}) => ({
    'Content-Type': 'application/json',
    ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
    ...extra,
  });

  const req = async (method, path, body) => {
    const opts = { method, headers: headers() };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(BASE + path, opts);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Ошибка запроса');
    return data;
  };

  return {
    getUser,
    isLoggedIn: () => !!getToken(),

    // ── Auth ──
    auth: {
      register: (username, email, password) =>
        req('POST', '/auth/register', { username, email, password }),
      login: (email, password) =>
        req('POST', '/auth/login', { email, password }),
      me: () => req('GET', '/auth/me'),
      logout: () => {
        localStorage.removeItem('wave_token');
        localStorage.removeItem('wave_user');
        window.location.href = '/login.html';
      },
      save: ({ token, user }) => {
        localStorage.setItem('wave_token', token);
        localStorage.setItem('wave_user', JSON.stringify(user));
      },
    },

    // ── Tracks ──
    tracks: {
      list:   (limit = 20, offset = 0) => req('GET', `/tracks?limit=${limit}&offset=${offset}`),
      get:    (id)    => req('GET', `/tracks/${id}`),
      search: (q, limit = 30) => req('GET', `/tracks/search?q=${encodeURIComponent(q)}&limit=${limit}`),
      play:   (id)    => req('POST', `/tracks/${id}/play`),
    },

    // ── Albums ──
    albums: {
      list:   (limit = 20, offset = 0) => req('GET', `/albums?limit=${limit}&offset=${offset}`),
      get:    (id)    => req('GET', `/albums/${id}`),
      tracks: (id)    => req('GET', `/albums/${id}/tracks`),
    },

    // ── Artists ──
    artists: {
      list: (limit = 20, offset = 0) => req('GET', `/artists?limit=${limit}&offset=${offset}`),
      get:  (id) => req('GET', `/artists/${id}`),
    },

    // ── User ──
    user: {
      history:         ()           => req('GET',    '/user/history'),
      recommendations: ()           => req('GET',    '/user/recommendations'),
      playlists:       ()           => req('GET',    '/user/playlists'),
      playlistTracks:  (id)         => req('GET',    `/user/playlists/${id}`),
      createPlaylist:  (name)       => req('POST',   '/user/playlists', { name }),
      addTrack:        (pid, payload)   => req('POST',   `/user/playlists/${pid}/tracks`, payload),
      removeTrack:     (pid, tid)   => req('DELETE', `/user/playlists/${pid}/tracks/${tid}`),
    },

    // ── Jamendo ──
    jamendo: {
      tracks: (params = {}) => {
        const qs = new URLSearchParams(params).toString();
        return req('GET', `/jamendo/tracks?${qs}`);
      },
      search: (q, type = 'tracks') =>
        req('GET', `/jamendo/search?q=${encodeURIComponent(q)}&type=${type}`),
      sync: (limit = 50) => req('POST', `/jamendo/sync?limit=${limit}`),
    },
  };
})();

window.API = API;
