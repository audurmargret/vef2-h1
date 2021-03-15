import dotenv from 'dotenv';
import fs from 'fs';
import util from 'util';
import pg from 'pg';
import bcrypt from 'bcrypt';

dotenv.config();

const { Client } = pg;
const {
  DATABASE_URL: connectionString,
  NODE_ENV: nodeEnv = 'development',
} = process.env;

if (!connectionString) {
  console.error('Vantar DATABASE_URL');
  process.exit(1);
}

const ssl = nodeEnv !== 'development' ? { rejectUnauthorized: false } : false;

const readFileAsync = util.promisify(fs.readFile);

async function query(q, values = []) {
  const client = new Client({
    connectionString, ssl,
  });

  await client.connect();

  try {
    const result = await client.query(q, values);

    const { rows } = result;
    return rows;
  } finally {
    await client.end();
  }
}

async function main() {
  console.info(`Set upp gagnagrunn á ${connectionString}`);
  // droppa töflu ef til
  await query('DROP TABLE IF EXISTS TVshows');
  await query('DROP TABLE IF EXISTS TVshowType');
  await query('DROP TABLE IF EXISTS TVconnect');
  await query('DROP TABLE IF EXISTS TVseason');
  await query('DROP TABLE IF EXISTS episode');
  await query('DROP TABLE IF EXISTS users');
  await query('DROP TABLE IF EXISTS usersConnect');
  console.info('Töflum eytt');

  // búa til töflu út frá skema
  try {
    const createTable = await readFileAsync('./sql/schema.sql');
    await query(createTable.toString('utf8'));
    console.info('Tafla búin til');
  } catch (e) {
    console.error('Villa við að búa til töflu:', e.message);
    return;
  }

  // bæta færslum við töflu
  try {
    const hashedPW = await bcrypt.hash('123', 11);
    await query('INSERT INTO users (username, email, password, admin) VALUES ($1, $2);', ['admin', 'abc@abc.com', hashedPW, true]);

    console.info('Gögnum bætt við');
  } catch (e) {
    console.error('Villa við að bæta gögnum við:', e.message);
  }
}

main().catch((err) => {
  console.error(err);
});
