import dotenv from 'dotenv';
import fs from 'fs';
import util from 'util';
import pg from 'pg';
import bcrypt from 'bcrypt';
import csv from 'csv-parser';
import { connectGenre, createEpisodes, createGenre, createSeasons, createSeries } from './db.js';

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

async function insertSeries(file) {
  fs.createReadStream(file)
  .pipe(csv())
  .on('data', async (row) => {
    await createSeries(row);
    await createGenre(row);
    await connectGenre(row);
  })
  .on('end', () => {
    console.log('series.csv importað');
  })
}

async function insertSeasons(file) {
  fs.createReadStream(file)
  .pipe(csv())
  .on('data', async (row) => {
    await createSeasons(row);
  })
  .on('end', () => {
    console.log('seasons.csv importað');
  })
}

async function insertEpisodes(file) {
  fs.createReadStream(file)
  .pipe(csv())
  .on('data', async (row) => {
    await createEpisodes(row);
  })
  .on('end', () => {
    console.log('episodes.csv importað');
  })
}

async function main() {
  console.info(`Set upp gagnagrunn á ${connectionString}`);
  // droppa töflu ef til
  await query('DROP TABLE IF EXISTS TVseries cascade');
  await query('DROP TABLE IF EXISTS TVgenre cascade');
  await query('DROP TABLE IF EXISTS TVconnect');
  await query('DROP TABLE IF EXISTS TVseasons cascade');
  await query('DROP TABLE IF EXISTS episodes cascade');
  await query('DROP TABLE IF EXISTS users cascade');
  await query('DROP TABLE IF EXISTS usersConnect');
  console.info('Töflum eytt');

  // búa til töflu út frá skema
  try {
    const createTable = await readFileAsync('./sql/schema.sql');
    await query(createTable.toString('utf8'));
    console.info('Töflur búnar til');
  } catch (e) {
    console.error('Villa við að búa til töflu:', e.message);
    return;
  }

  // bæta færslum við töflu
  try {
    const hashedPW = await bcrypt.hash('123', 11);
    const hashedPW2 = await bcrypt.hash('321', 11);
    await query('INSERT INTO users (username, email, password, admin) VALUES ($1, $2, $3, $4);', ['admin', 'abc@abc.com', hashedPW, true]);
    await query('INSERT INTO users (username, email, password, admin) VALUES ($1, $2, $3, $4);', ['notandi', 'cba@abc.com', hashedPW2, false]);

    // TODO: Bæta við gögnum úr data möppunni
    
    
    await insertSeries('./data/series.csv');
    await insertSeasons('./data/seasons.csv');
    await insertEpisodes('./data/episodes.csv');
    //console.log(csvSeasons);

    console.info('Gögnum bætt við');
  } catch (e) {
    console.error('Villa við að bæta gögnum við:', e.message);
  }
}

main().catch((err) => {
  console.error(err);
});
