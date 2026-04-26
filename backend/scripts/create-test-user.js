const bcrypt = require('bcryptjs');
require('dotenv').config();
const pool = require('../db/pool');

const TEST_USER = {
  username: 'testuser',
  email: 'test@wave.local',
  password: '12345678',
};

async function main() {
  const existing = await pool.query(
    'SELECT user_id FROM users WHERE email = $1',
    [TEST_USER.email]
  );

  let userId;

  if (existing.rows.length) {
    userId = existing.rows[0].user_id;
  } else {
    const hash = await bcrypt.hash(TEST_USER.password, 10);
    const created = await pool.query(
      `INSERT INTO users (username, email, password)
       VALUES ($1, $2, $3)
       RETURNING user_id`,
      [TEST_USER.username, TEST_USER.email, hash]
    );
    userId = created.rows[0].user_id;
  }

  const playlist = await pool.query(
    `SELECT playlist_id
     FROM playlist
     WHERE user_id = $1 AND name = $2`,
    [userId, 'Избранное']
  );

  if (!playlist.rows.length) {
    await pool.query('CALL sp_create_playlist($1, $2)', [userId, 'Избранное']);
  }

  console.log('Test user is ready.');
  console.log(`email: ${TEST_USER.email}`);
  console.log(`password: ${TEST_USER.password}`);
  await pool.end();
}

main().catch(async (error) => {
  console.error('Test user creation failed.');
  console.error(error.message);
  await pool.end().catch(() => {});
  process.exit(1);
});
