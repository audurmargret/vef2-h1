import { query } from './db.js';

export async function getGenres() {
    const q = `SELECT * FROM TVgenre;`;
    try{
        const result = await query(q);
        console.log(result.rows)
        return result.rows;
    }
    catch (e) {
        console.error('Gat ekki sótt genres', e)
        return null;
    }
}

export async function getInfoGenres(id) {
    const q = `SELECT typeName FROM TVgenre WHERE id IN (SELECT tvgenre_id FROM TVconnect WHERE tvseries_id = $1);`
    try{
        const result = await query(q, [id]);
        return result.rows;
    } catch (e) {
        console.error('Gat ekki fundið genres',e)
        return null;
    }
}

export async function addGenre(genre) {
    const q = `
    INSERT INTO
        TVgenre (typeName)
        VALUES ($1)
    `;
    try {
        await query(q, [genre]);
        return true;
    } catch(e) {
        console.error('Gat ekki bætt við genre', e)
        return false;
    }
}