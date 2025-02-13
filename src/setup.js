import dotenv from 'dotenv';
import fs from 'fs';
import util from 'util';
import pg from 'pg';
import bcrypt from 'bcrypt';
import csv from 'csv-parser';
import {
  allImages,
  connectGenre,
  createEpisodes,
  createGenre,
  createSeasons,
  createSeries,
} from './db.js';
import { rateSeries, stateSeries } from './series.js';

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

async function readCSV(file) {
  return new Promise((resolve, reject) => {
    const data = [];
    fs.createReadStream(file)
      .pipe(csv())
      .on('data', (row) => {
        data.push(row);
      })
      .on('end', () => {
        resolve(data);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

async function insertSeries(file) {
  const data = await readCSV(file);
  data.forEach(async (row) => {
    await createSeries(row);
    await createGenre(row);
    await connectGenre(row);
  });
}

async function insertSeasons(file) {
  const data = await readCSV(file);
  data.forEach(async (row) => {
    await createSeasons(row);
  });
}

async function insertEpisodes(file) {
  const data = await readCSV(file);
  data.forEach(async (row) => {
    await createEpisodes(row);
  });
}

async function resetSerial() {
  const q = `
  SELECT setval('tvseries_id_seq', 20, true);
  `;
  try {
    await query(q);
  } catch (e) {
    console.info('Villa við að breyta serial', e);
  }
}

async function fakeUser() {
  await stateSeries(11, 2, 'Hef horft');
  await stateSeries(1, 2, 'Langar að horfa');
  await stateSeries(18, 2, 'Er að horfa');

  await rateSeries(11, 2, 4);
  await rateSeries(15, 2, 5);
}

async function main() {
  console.info('Set inn local myndir á cloudinary');
  await allImages();
  console.info(`Set upp gagnagrunn á ${connectionString}`);
  // droppa töflu ef til
  await query('DROP TABLE IF EXISTS TVseries cascade');
  await query('DROP TABLE IF EXISTS TVgenre cascade');
  await query('DROP TABLE IF EXISTS TVconnect');
  await query('DROP TABLE IF EXISTS TVseasons cascade');
  await query('DROP TABLE IF EXISTS episodes cascade');
  await query('DROP TABLE IF EXISTS users cascade');
  await query('DROP TABLE IF EXISTS userConnect');
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

    console.info('Set inn series');
    await insertSeries('./data/series.csv');
    await insertSeasons('./data/seasons.csv');
    await insertEpisodes('./data/episodes.csv');
    await resetSerial();

    await fakeUser();

    console.info('Gögnum bætt við');
  } catch (e) {
    console.error('Villa við að bæta gögnum við:', e.message);
  }
}

main().catch((err) => {
  console.error(err);
});
