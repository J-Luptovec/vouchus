import { Client } from 'pg';
import { execSync } from 'child_process';

const TEST_DB = 'vouchus_test';
const TEST_DB_URL = `postgresql://vouchus:vouchus@localhost:5432/${TEST_DB}`;
const ADMIN_URL = 'postgresql://vouchus:vouchus@localhost:5432/postgres';

export async function setup() {
  const client = new Client({ connectionString: ADMIN_URL });
  await client.connect();

  const { rows } = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [TEST_DB]);
  if (rows.length === 0) {
    await client.query(`CREATE DATABASE ${TEST_DB}`);
  }
  await client.end();

  execSync('npx prisma migrate deploy', {
    env: { ...process.env, DATABASE_URL: TEST_DB_URL },
    stdio: 'inherit',
  });
}
