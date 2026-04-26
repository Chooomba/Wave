const fetch = require('node-fetch');
require('dotenv').config();
const { upsertArtist, upsertAlbum, upsertTrack } = require('../db/queries');
const pool = require('../db/pool');

const CLIENT_ID = process.env.JAMENDO_CLIENT_ID;
const BASE = process.env.JAMENDO_BASE_URL;
const LIMIT = Math.min(parseInt(process.argv[2], 10) || 100, 200);

async function jamendoGet(endpoint, params = {}) {
  const url = new URL(`${BASE}/${endpoint}/`);
  url.searchParams.set('client_id', CLIENT_ID);
  url.searchParams.set('format', 'json');
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, value);
    }
  });

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Jamendo error: ${res.status}`);
  return res.json();
}

async function main() {
  console.log(`Fetching ${LIMIT} tracks from Jamendo...`);
  const data = await jamendoGet('tracks', {
    limit: LIMIT,
    include: 'musicinfo',
    audioformat: 'mp32',
    imagesize: '200',
  });

  let synced = 0;

  for (const track of data.results || []) {
    const artistId = await upsertArtist(
      String(track.artist_id),
      track.artist_name,
      track.artist_image || null
    );

    const albumId = await upsertAlbum(
      String(track.album_id),
      track.album_name,
      artistId,
      track.album_image || track.image || null,
      track.releasedate || null
    );

    await upsertTrack({
      jamendoId: String(track.id),
      title: track.name,
      artistName: track.artist_name,
      duration: track.duration,
      audioUrl: track.audio,
      coverUrl: track.image,
      genre: track.musicinfo?.tags?.genres?.[0] || null,
      artistId,
      albumId,
    });

    synced += 1;
  }

  console.log(`Synced ${synced} tracks into the database.`);
  await pool.end();
}

main().catch(async (error) => {
  console.error('Music sync failed.');
  console.error(error.message);
  await pool.end().catch(() => {});
  process.exit(1);
});
