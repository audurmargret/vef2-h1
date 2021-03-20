import { query } from "./db";
import { findSeason } from "./seasons";

export function addEpisode(seriesId, seasonId, data) {
    const q = `
    INSERT INTO 
        episodes (episodeName, epi_num, releaseDate, about, season, series_id)
    VALUES ($1, $2, $3, $4, $5, $6)
    `;
    const season_numb = findSeason(seriesId, seasonId);
    let date = data.releaseDate;
    if (date == '') {
        date = null;
    }
    try {
        await query(q, [
            data.name,
            data.epinumb,
            date,
            data.about,
            season_numb.rows[0].season,
            seriesId
        ]);
        return true;
    } catch(e) {
        return false;
    }
}

export function findEpisode(seriesId, season, epinumb) {
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

export function deleteEpisode(seriesId, season, epinumb) {
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