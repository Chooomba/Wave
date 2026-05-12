const API = (() => {
  const BASE = '/api';

  const getToken = () => localStorage.getItem('wave_token');
  const getUser = () => JSON.parse(localStorage.getItem('wave_user') || 'null');
  const getAdminPassword = () => sessionStorage.getItem('wave_admin_password') || '';

  const headers = (extra = {}) => ({
    'Content-Type': 'application/json',
    ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
    ...extra,
  });

  const req = async (method, path, body, extraHeaders = {}) => {
    const options = { method, headers: headers(extraHeaders) };
    if (body !== undefined && body !== null) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(BASE + path, options);
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
      throw new Error(data.error || 'Ошибка запроса');
    }

    return data;
  };

  return {
    getUser,
    isLoggedIn: () => !!getToken(),

    auth: {
      register: (username, email, password) =>
        req('POST', '/auth/register', { username, email, password }),
      login: (email, password) =>
        req('POST', '/auth/login', { email, password }),
      me: () => req('GET', '/auth/me'),
      logout: () => {
        localStorage.removeItem('wave_token');
        localStorage.removeItem('wave_user');
        sessionStorage.removeItem('wave_admin_password');
        window.location.href = '/login.html';
      },
      save: ({ token, user }) => {
        localStorage.setItem('wave_token', token);
        localStorage.setItem('wave_user', JSON.stringify(user));
      },
    },

    tracks: {
      list: (limit = 20, offset = 0) => req('GET', `/tracks?limit=${limit}&offset=${offset}`),
      get: (id) => req('GET', `/tracks/${id}`),
      search: (q, limit = 30) => req('GET', `/tracks/search?q=${encodeURIComponent(q)}&limit=${limit}`),
      play: (id) => req('POST', `/tracks/${id}/play`),
    },

    albums: {
      list: (limit = 20, offset = 0) => req('GET', `/albums?limit=${limit}&offset=${offset}`),
      get: (id) => req('GET', `/albums/${id}`),
      tracks: (id) => req('GET', `/albums/${id}/tracks`),
    },

    artists: {
      list: (limit = 20, offset = 0) => req('GET', `/artists?limit=${limit}&offset=${offset}`),
      get: (id) => req('GET', `/artists/${id}`),
    },

    user: {
      history: () => req('GET', '/user/history'),
      recommendations: () => req('GET', '/user/recommendations'),
      playlists: () => req('GET', '/user/playlists'),
      playlistTracks: (id) => req('GET', `/user/playlists/${id}`),
      createPlaylist: (name) => req('POST', '/user/playlists', { name }),
      addTrack: (playlistId, payload) => req('POST', `/user/playlists/${playlistId}/tracks`, payload),
      removeTrack: (playlistId, trackId) => req('DELETE', `/user/playlists/${playlistId}/tracks/${trackId}`),
    },

    admin: {
      getPassword: getAdminPassword,
      savePassword: (password) => sessionStorage.setItem('wave_admin_password', password),
      clearPassword: () => sessionStorage.removeItem('wave_admin_password'),
      summary: () => req('GET', '/admin/summary', null, { 'X-Admin-Password': getAdminPassword() }),
      users: (limit = 20) => req('GET', `/admin/users?limit=${limit}`, null, { 'X-Admin-Password': getAdminPassword() }),
      playlists: (limit = 20) => req('GET', `/admin/playlists?limit=${limit}`, null, { 'X-Admin-Password': getAdminPassword() }),
      tracks: (limit = 20) => req('GET', `/admin/tracks?limit=${limit}`, null, { 'X-Admin-Password': getAdminPassword() }),
    },

    jamendo: {
      tracks: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return req('GET', `/jamendo/tracks?${query}`);
      },
      search: (q, type = 'tracks') =>
        req('GET', `/jamendo/search?q=${encodeURIComponent(q)}&type=${type}`),
      sync: (limit = 50) => req('POST', `/jamendo/sync?limit=${limit}`),
    },
  };
})();

window.API = API;
