const PAGES = {
  'index.html': 'Главная',
  'search.html': 'Поиск',
  'browse.html': 'Обзор',
  'favorites.html': 'Избранное',
  'playlists.html': 'Плейлисты',
  'albums.html': 'Альбомы',
  'admin.html': 'Админ',
};

const NAV_ICONS = {
  'index.html': `<svg viewBox="0 0 16 16" fill="none"><path d="M2 6.5L8 2l6 4.5V14H10v-3H6v3H2V6.5z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/></svg>`,
  'search.html': `<svg viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="4.5" stroke="currentColor" stroke-width="1.2"/><path d="M10.5 10.5L14 14" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>`,
  'browse.html': `<svg viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="2" rx="1" fill="currentColor"/><rect x="2" y="7" width="9" height="2" rx="1" fill="currentColor"/><rect x="2" y="11" width="11" height="2" rx="1" fill="currentColor"/></svg>`,
  'favorites.html': `<svg viewBox="0 0 16 16" fill="none"><path d="M8 13.5S1.5 9.5 1.5 5.5a3.5 3.5 0 0 1 6.5-1.8A3.5 3.5 0 0 1 14.5 5.5c0 4-6.5 8-6.5 8z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/></svg>`,
  'playlists.html': `<svg viewBox="0 0 16 16" fill="none"><circle cx="5.5" cy="12" r="2" stroke="currentColor" stroke-width="1.2"/><circle cx="11.5" cy="11" r="2" stroke="currentColor" stroke-width="1.2"/><path d="M7.5 12V4l6-1v7" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  'albums.html': `<svg viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="5" height="5" rx="1.5" stroke="currentColor" stroke-width="1.2"/><rect x="9" y="2" width="5" height="5" rx="1.5" stroke="currentColor" stroke-width="1.2"/><rect x="2" y="9" width="5" height="5" rx="1.5" stroke="currentColor" stroke-width="1.2"/><rect x="9" y="9" width="5" height="5" rx="1.5" stroke="currentColor" stroke-width="1.2"/></svg>`,
  'admin.html': `<svg viewBox="0 0 16 16" fill="none"><path d="M8 2.5l1.5 1 .2 1.7 1.6.7 1.6-.3.9 1.6-.9 1.4.4 1.7-1.2 1.2-1.7-.4-1.4.9-1.6-.9-1.7.4-1.2-1.2.4-1.7-.9-1.4.9-1.6 1.6.3 1.6-.7.2-1.7L8 2.5z" stroke="currentColor" stroke-width="1.1" stroke-linejoin="round"/><circle cx="8" cy="8" r="1.8" stroke="currentColor" stroke-width="1.1"/></svg>`,
};

const FAVORITES_NAME = 'Избранное';
const FAVORITES_ALIASES = new Set([
  FAVORITES_NAME,
  'РР·Р±СЂР°РЅРЅРѕРµ',
]);

function buildSidebar() {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  const mainPages = ['index.html', 'search.html', 'browse.html'];
  const user = API.getUser();
  const libPages = ['favorites.html', 'playlists.html', 'albums.html'];
  if (user) libPages.push('admin.html');

  const navItem = (page) => `
    <a href="${page}" class="nav-item ${page === current ? 'active' : ''}">
      <span class="ni">${NAV_ICONS[page]}</span>${PAGES[page]}
    </a>`;

  const initials = user ? user.username.slice(0, 2).toUpperCase() : '??';
  const userName = user ? user.username : 'Гость';

  return `
    <nav class="sidebar">
      <div class="logo"><div class="logo-dot"></div>Wave</div>
      <div class="nav-label">Главное</div>
      ${mainPages.map(navItem).join('')}
      <div class="nav-label">Библиотека</div>
      ${libPages.map(navItem).join('')}
      <div class="sidebar-spacer"></div>
      <div class="sidebar-footer">
        <div class="user-row" id="userRowBtn">
          <div class="avatar">${initials}</div>
          <div>
            <div class="user-name">${userName}</div>
            <div class="user-plan">${user ? 'Аккаунт' : 'Не вошел'}</div>
          </div>
        </div>
      </div>
    </nav>`;
}

function buildPlayer() {
  return `
    <footer class="player">
      <div class="player-track">
        <div class="player-art" id="playerArt">
          <div class="player-art-inner"></div>
        </div>
        <div>
          <div class="player-name" id="playerName">Выберите трек</div>
          <div class="player-artist" id="playerArtist">—</div>
        </div>
      </div>

      <div class="player-controls">
        <div class="ctrl-row">
          <button class="ctrl-btn" id="btnShuffle" title="Перемешать">
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round">
              <path d="M2 6h8.5l2-2M2 10h8.5l2 2M12.5 4l2 2-2 2M12.5 8l2 2-2 2"/>
            </svg>
          </button>
          <button class="ctrl-btn" id="btnPrev">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M4 3v10M4 8l8-5v10L4 8z"/></svg>
          </button>
          <button class="play-btn" id="playBtn">
            <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" id="playIcon">
              <path d="M4 3l10 5-10 5V3z"/>
            </svg>
          </button>
          <button class="ctrl-btn" id="btnNext">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M12 3v10M12 8L4 3v10l8-5z"/></svg>
          </button>
          <button class="ctrl-btn" id="btnRepeat" title="Повтор">
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 10a5 5 0 1 0 .5-2"/><path d="M3 7V4l-2 2 2 2"/>
            </svg>
          </button>
        </div>
        <div class="progress-row">
          <span class="time-lbl" id="timeCur">0:00</span>
          <div class="progress-track" id="progressTrack">
            <div class="progress-fill" id="progressFill">
              <div class="progress-dot"></div>
            </div>
          </div>
          <span class="time-lbl end" id="timeDur">0:00</span>
        </div>
      </div>

      <div class="player-right">
        <div class="vol-wrap">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="var(--text-3)" stroke-width="1.3">
            <path d="M2 6h3l3-3v10l-3-3H2V6z" stroke-linejoin="round"/>
            <path d="M10.5 5.5a3 3 0 0 1 0 5" stroke-linecap="round"/>
          </svg>
          <div class="vol-track" id="volTrack">
            <div class="vol-fill" id="volFill"></div>
          </div>
        </div>
        <div class="icon-btn">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3">
            <rect x="2" y="2" width="5" height="5" rx="1"/><rect x="9" y="2" width="5" height="5" rx="1"/>
            <rect x="2" y="9" width="5" height="5" rx="1"/><rect x="9" y="9" width="5" height="5" rx="1"/>
          </svg>
        </div>
      </div>
    </footer>`;
}

const Player = (() => {
  const audio = new Audio();
  const preloadAudio = new Audio();
  let queue = [];
  let idx = 0;
  let shuffle = false;
  let repeat = false;
  let volume = 0.7;
  let preloadedSrc = '';

  audio.preload = 'auto';
  audio.volume = volume;
  preloadAudio.preload = 'auto';

  const fmt = (seconds) => {
    const sec = Math.floor(seconds) || 0;
    return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
  };

  const ui = {
    name: () => document.getElementById('playerName'),
    artist: () => document.getElementById('playerArtist'),
    art: () => document.getElementById('playerArt'),
    icon: () => document.getElementById('playIcon'),
    cur: () => document.getElementById('timeCur'),
    dur: () => document.getElementById('timeDur'),
    fill: () => document.getElementById('progressFill'),
    volFill: () => document.getElementById('volFill'),
  };

  const updateUI = (track) => {
    if (!track) return;
    const title = track.track_title || track.title || '—';
    const artist = track.artist_name || '—';
    const cover = track.cover_url || track.album_cover || null;

    if (ui.name()) ui.name().textContent = title;
    if (ui.artist()) ui.artist().textContent = artist;
    if (ui.art()) {
      ui.art().innerHTML = cover
        ? `<img src="${cover}" alt="cover">`
        : `<div class="player-art-inner"></div>`;
    }

    document.title = `${title} — Wave`;
  };

  const setPlayIcon = (playing) => {
    const icon = ui.icon();
    if (!icon) return;
    icon.innerHTML = playing
      ? `<rect x="4" y="3" width="3" height="10" rx="1"/><rect x="9" y="3" width="3" height="10" rx="1"/>`
      : `<path d="M4 3l10 5-10 5V3z"/>`;
  };

  const nextTrackForPreload = () => {
    if (shuffle || !queue.length || idx >= queue.length - 1) return null;
    return queue[idx + 1] || null;
  };

  const warmTrack = (track) => {
    if (!track || !track.audio_url) return;
    if (preloadedSrc === track.audio_url) return;
    if (audio.src && audio.src.includes(track.audio_url)) return;
    preloadAudio.pause();
    preloadAudio.src = track.audio_url;
    preloadAudio.load();
    preloadedSrc = track.audio_url;
  };

  const load = (track) => {
    if (!track || !track.audio_url) {
      showToast('У этого трека нет аудио');
      return;
    }

    updateUI(track);
    audio.pause();
    audio.src = track.audio_url;
    audio.load();
    audio.play().catch(() => showToast('Не удалось воспроизвести трек'));
    preloadedSrc = '';
    warmTrack(nextTrackForPreload());

    if (API.isLoggedIn() && track.track_id) {
      API.tracks.play(track.track_id).catch(() => {});
    }
  };

  audio.addEventListener('play', () => setPlayIcon(true));
  audio.addEventListener('pause', () => setPlayIcon(false));
  audio.addEventListener('timeupdate', () => {
    if (ui.cur()) ui.cur().textContent = fmt(audio.currentTime);
    if (ui.dur()) ui.dur().textContent = fmt(audio.duration);
    if (ui.fill()) {
      ui.fill().style.width = audio.duration
        ? `${(audio.currentTime / audio.duration) * 100}%`
        : '0%';
    }
    if (audio.duration && audio.currentTime >= Math.max(audio.duration - 12, audio.duration * 0.65)) {
      warmTrack(nextTrackForPreload());
    }
  });
  audio.addEventListener('ended', () => {
    if (repeat) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
      return;
    }
    Player.next();
  });
  audio.addEventListener('error', () => showToast('Не удалось загрузить аудио'));

  return {
    setQueue(tracks, startIdx = 0) {
      queue = Array.isArray(tracks) ? tracks : [];
      idx = startIdx;
      if (queue[idx]) load(queue[idx]);
    },
    play(track) {
      queue = [track];
      idx = 0;
      load(track);
    },
    togglePlay() {
      if (!audio.src) return;
      audio.paused ? audio.play().catch(() => {}) : audio.pause();
    },
    next() {
      if (!queue.length) return;
      idx = shuffle
        ? Math.floor(Math.random() * queue.length)
        : (idx + 1) % queue.length;
      load(queue[idx]);
    },
    prev() {
      if (!queue.length) return;
      if (audio.currentTime > 3) {
        audio.currentTime = 0;
        return;
      }
      idx = (idx - 1 + queue.length) % queue.length;
      load(queue[idx]);
    },
    seek(percent) {
      if (audio.duration) audio.currentTime = audio.duration * percent;
    },
    setVolume(percent) {
      volume = percent;
      audio.volume = percent;
      if (ui.volFill()) ui.volFill().style.width = `${percent * 100}%`;
    },
    toggleShuffle() {
      shuffle = !shuffle;
      document.getElementById('btnShuffle')?.classList.toggle('active', shuffle);
    },
    toggleRepeat() {
      repeat = !repeat;
      document.getElementById('btnRepeat')?.classList.toggle('active', repeat);
    },
    preload(track) {
      warmTrack(track);
    },
    current() {
      return queue[idx] || null;
    },
  };
})();

window.Player = Player;

function showToast(message, duration = 3000) {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.className = 'toast-wrap';
    document.body.appendChild(wrap);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  wrap.appendChild(toast);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

window.showToast = showToast;

let favoritesPlaylistIdPromise = null;

function isFavoritesPlaylist(playlist) {
  const name = String(playlist?.playlist_name || '').trim();
  return FAVORITES_ALIASES.has(name) || /избран/i.test(name) || /РР·Р±/i.test(name);
}

async function getFavoritesPlaylistId() {
  if (!API.isLoggedIn()) return null;

  if (!favoritesPlaylistIdPromise) {
    favoritesPlaylistIdPromise = (async () => {
      let playlists = (await API.user.playlists()).playlists || [];
      let favorites = playlists.find(isFavoritesPlaylist);

      if (!favorites) {
        await API.user.createPlaylist(FAVORITES_NAME);
        playlists = (await API.user.playlists()).playlists || [];
        favorites = playlists.find(isFavoritesPlaylist);
      }

      const playlistId = favorites?.playlist_id || null;
      if (!playlistId) {
        favoritesPlaylistIdPromise = null;
      }

      return playlistId;
    })().catch((error) => {
      favoritesPlaylistIdPromise = null;
      throw error;
    });
  }

  return favoritesPlaylistIdPromise;
}

async function addToFavorites(track, event) {
  event?.stopPropagation();

  if (!API.isLoggedIn()) {
    showToast('Сначала войдите в аккаунт');
    window.location.href = '/login.html';
    return;
  }

  try {
    const playlistId = await getFavoritesPlaylistId();
    if (!playlistId) {
      showToast('Не удалось найти плейлист Избранное');
      return;
    }

    const payload = track?.track_id ? { track_id: track.track_id } : { track };
    const result = await API.user.addTrack(playlistId, payload);
    showToast(result.added ? 'Добавлено в Избранное' : 'Трек уже есть в Избранном');
  } catch (error) {
    showToast(error.message || 'Не удалось добавить трек');
  }
}

window.addToFavorites = addToFavorites;

function requireAuth() {
  if (!API.isLoggedIn()) {
    window.location.href = '/login.html';
    return false;
  }
  return true;
}

window.requireAuth = requireAuth;

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  if (!app) return;

  const sidebarHost = document.createElement('div');
  sidebarHost.innerHTML = buildSidebar();
  app.prepend(sidebarHost.firstElementChild);

  const playerHost = document.createElement('div');
  playerHost.innerHTML = buildPlayer();
  app.appendChild(playerHost.firstElementChild);

  document.getElementById('userRowBtn')?.addEventListener('click', () => {
    if (API.isLoggedIn()) {
      if (confirm('Выйти из аккаунта?')) API.auth.logout();
    } else {
      window.location.href = '/login.html';
    }
  });

  document.getElementById('playBtn')?.addEventListener('click', () => Player.togglePlay());
  document.getElementById('btnNext')?.addEventListener('click', () => Player.next());
  document.getElementById('btnPrev')?.addEventListener('click', () => Player.prev());
  document.getElementById('btnShuffle')?.addEventListener('click', () => Player.toggleShuffle());
  document.getElementById('btnRepeat')?.addEventListener('click', () => Player.toggleRepeat());

  document.getElementById('progressTrack')?.addEventListener('click', (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    Player.seek((event.clientX - rect.left) / rect.width);
  });

  document.getElementById('volTrack')?.addEventListener('click', (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    Player.setVolume((event.clientX - rect.left) / rect.width);
  });

  Player.setVolume(0.7);
});
