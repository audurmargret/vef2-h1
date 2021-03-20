import { query } from './db.js';

export async function getGenres(genre) {
    const q = `
        SELECT * FROM TVseries WHERE id IN (SELECT tvseries_id FROM TVconnect WHERE TVgenre_id = $1);
    `;
    const result = await query(q, genre);
    return result;
}

export async function addGenre(genre) {
    const q = `
    INSERT INTO
        TVgenre (typeName)
        VALUES ($1)
    `;
    try {
        await query(q, genre);
        return true;
    } catch(e) {
        return false;
    }
}