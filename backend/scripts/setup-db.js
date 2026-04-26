const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const sqlFiles = [
  '01_add_artist_album.sql',
  '02_views.sql',
  '03_functions.sql',
  '04_triggers.sql',
  '05_roles.sql',
];

function getEnv(name, fallback) {
  return process.env[name] || process.env[fallback];
}

async function main() {
  const config = {
    host: getEnv('DB_SETUP_HOST', 'DB_HOST'),
    port: Number(getEnv('DB_SETUP_PORT', 'DB_PORT') || 5432),
    database: getEnv('DB_SETUP_NAME', 'DB_NAME'),
    user: getEnv('DB_SETUP_USER', 'DB_USER'),
    password: getEnv('DB_SETUP_PASSWORD', 'DB_PASSWORD'),
  };
  const client = new Client(config);

  const databaseDir = path.resolve(__dirname, '..', '..', 'database');

  console.log('Connecting to PostgreSQL...');
  await client.connect();
  console.log(`Connected to database "${config.database}" as "${config.user}"`);

  try {
    for (const fileName of sqlFiles) {
      const filePath = path.join(databaseDir, fileName);
      const sql = fs.readFileSync(filePath, 'utf8');

      console.log(`Running ${fileName}...`);
      await client.query(sql);
      console.log(`Done: ${fileName}`);
    }

    console.log('Database setup finished successfully.');
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error('Database setup failed.');
  console.error(error.message);
  process.exit(1);
});
