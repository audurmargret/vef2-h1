import { query } from './db.js';
import { findSeason } from './seasons.js';

export async function addEpisode(seriesId, seasonId, data) {
    const q = `
    INSERT INTO 
        episodes (episode_name, epi_num, release_date, about, season, series_id)
    VALUES ($1, $2, $3, $4, $5, $6)
    `;
    const season_numb = await findSeason(seriesId, seasonId);
    let date = data.release_date;
    if (date == '') {
        date = null;
    }
    console.log("season_num", season_numb.season_num)
    try {
        await query(q, [
            data.episode_name,
            data.epi_num,
            date,
            data.about,
            season_numb.season_num,
            seriesId
        ]);
        return true;
    } catch(e) {
        console.error('Gat ekki bætt við þætti',e)
        return false;
    }
}

export async function findEpisode(seriesId, season, epinumb) {
    const q = 'SELECT * FROM Episodes WHERE series_id = $1 AND season = $2 AND epi_num = $3';
    let result = '';
    try {
        result = await query(q, [
            seriesId,
            season,
            epinumb
        ]);
    } catch(e) {
        console.info('Þáttur fannst ekki ', e);
    }
    return result.rows;
}

export async function deleteEpisode(seriesId, season, epinumb) {
    const q = `
    DELETE from episodes WHERE series_id = $1 AND season = $2 AND epi_num = $3;
    `;
    try {
        await query(q, [
            seriesId,
            season,
            epinumb
        ]);
        return true;
    } catch(e) {
        return false;
    }
}