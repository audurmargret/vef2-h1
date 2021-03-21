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

export async function getGenreByName(name) {
    const q = `SELECT * FROM TVgenre WHERE type_name = $1;`
    try{
        const result = await query(q, [name]);
        return result.rows;
    } catch (e) {
        console.error('Gat ekki fundið genres eftir nafni',e)
        return null;
    }
}

export async function getInfoGenres(id) {
    const q = `SELECT type_name FROM TVgenre WHERE id IN (SELECT tvgenre_id FROM TVconnect WHERE tvseries_id = $1);`
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
        TVgenre (type_name)
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