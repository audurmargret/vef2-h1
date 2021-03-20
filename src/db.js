import pg from 'pg';
import dotenv from 'dotenv';
import cloudinary from 'cloudinary';
import { join, dirname, extname } from 'path';
import { fileURLToPath } from 'url';
import { readdir } from 'fs/promises';

dotenv.config();

const {
  DATABASE_URL: connectionString,
  NODE_ENV: nodeEnv = 'development',
} = process.env;

// Notum SSL tengingu við gagnagrunn ef við erum *ekki* í development mode, þ.e.a.s. á local vél
const ssl = nodeEnv !== 'development' ? { rejectUnauthorized: false } : false;

const pool = new pg.Pool({ connectionString, ssl });

cloudinary.config({ 
  cloud_name: 'dwx7hyahv', 
  api_key: '377459241788154', 
  api_secret: 'oBO1nzGak8XIuTpR4q0PfI98yY0' 
});

const imageUploader = cloudinary.v2; 
const path = dirname(fileURLToPath(import.meta.url));
const imageUrlMap = new Map();

pool.on('error', (err) => {
  console.error('Villa í tengingu við gagnagrunn, forrit hættir', err);
  process.exit(-1);
});

export async function query(_query, values = []) {
  const client = await pool.connect();

  try {
    const result = await client.query(_query, values);
    return result;
  } finally {
    client.release();
  }
}

/**
 * Insert a single registration into the registration table.
 *
 * @param {string} entry.name – Name of registrant
 * @param {string} entry.nationalId – National ID of registrant
 * @param {string} entry.comment – Comment, if any from registrant
 * @param {boolean} entry.anonymous – If the registrants name should be displayed or not
 * @returns {Promise<boolean>} Promise, resolved as true if inserted, otherwise false
 */
export async function insert({
  name, nationalId, comment, anonymous,
} = {}) {
  let success = true;

  const q = `
    INSERT INTO signatures
      (name, nationalId, comment, anonymous)
    VALUES
      ($1, $2, $3, $4);
  `;
  const values = [name, nationalId, comment, anonymous === 'on'];

  try {
    await query(q, values);
  } catch (e) {
    console.error('Error inserting signature', e);
    success = false;
  }

  return success;
}

export async function uploadImage(imageId) {
  return new Promise((resolve, reject) => {
    if (imageId){
      imageUploader.uploader.upload('./data/img/' + imageId, {
        use_filename: true, 
        unique_filename: false, 
        overwrite: false
      },(error, result) => {
        if (error) {
          console.error("Villa við að hlaða upp mynd: " + error);
          reject(null);
        }
        else {
          resolve(result.url);
        }
      })
    }
    else resolve();
  })
}

async function getLocalImages(path) {
  var localImages = [];
  try {
    localImages = readdir(path)
  } catch (e) {
    console.error(e);
  }
  return localImages
}

export async function allImages() {
  const localImages = await getLocalImages(join(path, './../data/img'));
  return Promise.all(localImages.map(async (file) => {
    const imageUrl = await uploadImage(file);
    imageUrlMap.set(file, imageUrl);
  }));
}

export async function createSeries(data){
    const q = `
        INSERT INTO 
          TVseries (
            id,
            showName,
            releaseDate,
            stillGoing,
            tagline,
            photo,
            about,
            language,
            channel,
            url)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `;
    const imageUrl = imageUrlMap.get(data.image);
    try {
        await query(q, [
            data.id,
            data.name,
            data.airDate,
            data.inProduction,
            data.tagline,
            imageUrl,
            data.description,
            data.language,
            data.network,
            data.homepage
        ]);
    } catch(e) {
        console.info('Villa við að setja inn series', e);
    }
}

export async function createGenre(data){
    const q = `
        INSERT INTO
          TVgenre (
            typeName)
          VALUES ($1) ON CONFLICT (typeName)
          DO NOTHING;
    `;
    const genres = data.genres.split(',');
        try {
            for (let i = 0; i < genres.length; i++){
                await query(q, [
                    genres[i]
                ]);
            }
        } catch(e) {
            console.info('Villa við að setja inn genre', e);
        }
}

async function getGenreId(genre){
    const q = `
        SELECT id FROM TVgenre WHERE typeName = $1
    `;
    const value = [genre];
    const result = await query(q, value);

    return result.rows[0].id;
}

export async function connectGenre(data) {
    const q = `
        INSERT INTO
          TVconnect (
            tvseries_id,
            tvgenre_id)
          VALUES ($1, $2);
    `;
    const genres = data.genres.split(',');
    let genre_id = [];
    for (let i = 0; i < genres.length; i++){
        const id = await getGenreId(genres[i]);
        genre_id.push(id);
    }
    try {
        for (let i = 0; i < genres.length; i++){
            await query(q, [
                data.id,
                genre_id[i]
            ]);
        }
        
    } catch(e) {
        console.info('Villa við að tengja genre', e);
    }
}

export async function createSeasons(data) {
    const q = `
        INSERT INTO
          TVseasons (
            showName,
            season_num,
            releaseDate,
            about,
            photo,
            series_id)
          VALUES ($1, $2, $3, $4, $5, $6)
    `;
    let date = data.airDate;
    if (date == ''){
        date = null;
    }
    const imageUrl = imageUrlMap.get(data.poster);
    try {
        await query(q, [
            data.name,
            data.number,
            date,
            data.overview,
            imageUrl,
            data.serieId
        ]);
    } catch(e) {
        console.info('Villa við að setja inn seasons', e);
    }
}

export async function createEpisodes(data){
    const q = `
        INSERT INTO
          episodes (episodeName, epi_num, releaseDate, about, season, series_id)
        VALUES ($1, $2, $3, $4, $5, $6)
    `;
    let date = data.airDate;
    if (date == ''){
        date = null;
    }
    try {
        await query(q, [
            data.name,
            data.number,
            date,
            data.overview,
            data.season,
            data.serieId
        ]);
    } catch(e) {
        console.info('Villa við að setja inn episodes', e);
    }
}

/**
 * List all registrations from the registration table.
 *
 * @returns {Promise<Array<list>>} Promise, resolved to array of all registrations.
 */
export async function list(offset = 0, limit = 10, search = '') {
  const values = [offset, limit];

  let searchPart = '';
  if (search) {
    searchPart = `
      WHERE
      to_tsvector('english', name) @@ plainto_tsquery('english', $3)
      OR
      to_tsvector('english', comment) @@ plainto_tsquery('english', $3)
    `;
    values.push(search);
  }

  let result = [];

  try {
    const q = `
      SELECT
        id, name, nationalId, comment, anonymous, signed
      FROM
        signatures
      ${searchPart}
      ORDER BY signed DESC
      OFFSET $1 LIMIT $2
    `;

    const queryResult = await query(q, values);

    if (queryResult && queryResult.rows) {
      result = queryResult.rows;
    }
  } catch (e) {
    console.error('Error selecting signatures', e);
  }

  return result;
}

export async function total(search) {
  let searchPart = '';
  if (search) {
    searchPart = `
      WHERE
      to_tsvector('english', name) @@ plainto_tsquery('english', $3)
      OR
      to_tsvector('english', comment) @@ plainto_tsquery('english', $3)
    `;
  }

  try {
    const result = await query(
      `SELECT COUNT(*) AS count FROM signatures ${searchPart}`,
      search ? [search] : [],
    );
    return (result.rows && result.rows[0] && result.rows[0].count) || 0;
  } catch (e) {
    console.error('Error counting signatures', e);
  }

  return 0;
}

export async function deleteRow(id) {
  let result = [];
  try {
    const queryResult = await query(
      'DELETE FROM signatures WHERE id = $1',
      [id],
    );

    if (queryResult && queryResult.rows) {
      result = queryResult.rows;
    }
  } catch (e) {
    console.error('Error selecting signatures', e);
  }

  return result;
}

// Helper to remove pg from the event loop
export async function end() {
  await pool.end();
}