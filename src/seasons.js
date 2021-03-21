import { query, uploadImage } from './db.js';
import fs from 'fs/promises';

export async function allSeasons(seriesId, limit = 10, offset = 0) {
  const q = 'SELECT * FROM TVseasons WHERE seriesId = $1 LIMIT $2 OFFSET $3;';
  try {
    const result = await query(q, [seriesId, limit, offset]);
    return result.rows;
  } catch (e) {
    console.error('Gat ekki sótt seríur', e);
    return null;
  }
}

export async function addSeason(body, seriesId, imagePath) {
  const q = `INSERT INTO TVseasons (showName, seasonNum, releaseDate, about, photo, seriesId)
               VALUES ($1,$2,$3,$4,$5,$6) RETURNING *;`;
  var imageUrl;
  if (imagePath) {
    imageUrl = await uploadImage(imagePath);
    await fs.rm(imagePath);
  }
  console.log(typeof(seriesId))
  const values = [
    body.showName,
    body.seasonNum,
    body.releaseDate,
    body.about,
    imageUrl,
    seriesId];
  try {
    await query(q, values);
    return true;
  } catch (e) {
    console.error('Gat ekki bætt við seríu', e);
    return false;
  }
}

export async function findSeason(seriesId, seasonId) {
  const q = 'SELECT * FROM TVseasons WHERE seriesId = $1 and seasonNum = $2;';
  const values = [seriesId, seasonId];
  try {
    const season = await query(q, values);
    if (season.rowCount === 1) {
      return season.rows[0];
    }
    console.error('Fann ekki seríu');
    return null;
  } catch (e) {
    console.error('Villa við að finna seríu', e);
    return null;
  }
}

export async function deleteSeason(seriesId, seasonId) {
  const q = 'DELETE FROM TVseasons WHERE seriesId = $1 and seasonNum = $2;';
  try {
    await query(q, [
      seriesId,
      seasonId,
    ]);
    return true;
  } catch (e) {
    console.error('Gat ekki eytt seríu', e);
    return false;
  }
}
