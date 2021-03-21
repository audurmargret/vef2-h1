import { query } from './db.js';
import { findSeason } from './seasons.js';

export async function addEpisode(seriesId, seasonId, data) {
  const q = `
    INSERT INTO 
        episodes (episodeName, epiNum, releaseDate, about, season, seriesId)
    VALUES ($1, $2, $3, $4, $5, $6)
    `;
  const seasonNumb = await findSeason(seriesId, seasonId);
  let date = data.releaseDate;
  if (date === '') {
    date = null;
  }
  try {
    await query(q, [
      data.episodeName,
      data.epiNum,
      date,
      data.about,
      seasonNumb.seasonNum,
      seriesId,
    ]);
    return true;
  } catch (e) {
    console.error('Gat ekki bætt við þætti', e);
    return false;
  }
}

export async function findEpisode(seriesId, season, epinumb) {
  const q = 'SELECT * FROM Episodes WHERE seriesId = $1 AND season = $2 AND epiNum = $3';
  let result = '';
  try {
    result = await query(q, [
      seriesId,
      season,
      epinumb,
    ]);
  } catch (e) {
    console.info('Þáttur fannst ekki ', e);
  }
  return result.rows;
}

export async function deleteEpisode(seriesId, season, epinumb) {
  const q = `
    DELETE from episodes WHERE seriesId = $1 AND season = $2 AND epiNum = $3;
    `;
  try {
    await query(q, [
      seriesId,
      season,
      epinumb,
    ]);
    return true;
  } catch (e) {
    return false;
  }
}
