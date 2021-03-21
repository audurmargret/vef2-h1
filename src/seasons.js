import { query } from './db.js';

export async function allSeasons(seriesId) {
    const q = `SELECT * FROM TVseasons WHERE series_id = $1;`;
    try {
        const result = await query(q,[seriesId]);
        return result.rows;
    }
    catch (e) {
      console.error('Gat ekki sótt seríur', e);
      return null;
    }
}

export async function addSeason(body) {
    const q = `INSERT INTO TVseasons (show_name, season_num, release_date, about, photo, series_id)
               VALUES ($1,$2,$3,$4,$5,$6) RETURNING *;`;
    const values = [body.show_name, body.season_num, body.release_date, body.about, body.photo, body.series_id]
    try{
        await query(q, values);
        return true;
    }
    catch (e) {
        console.error('Gat ekki bætt við seríu', e)
        return false;
    }
}

export async function findSeason(seriesId, seasonId) {
    const q = `SELECT * FROM TVseasons WHERE series_id = $1 and season_num = $2;`;
    const values = [seriesId, seasonId]
    try{
        const season = await query(q, values);
        if(season.rowCount === 1){
            return season.rows[0];
        }
        console.error('Fann ekki seríu');
        return null;
    }
    catch (e) {
        console.error('Villa við að finna seríu', e)
        return null;
    }
}

export async function deleteSeason(seriesId, seasonId) {
    const q = `DELETE FROM TVseasons WHERE series_id = $1 and season_num = $2;`;
    try {
        await query(q, [
            seriesId,
            seasonId
        ]);
        return true;
    } catch(e) {
        console.error('Gat ekki eytt seríu', e)
        return false;
    }
}