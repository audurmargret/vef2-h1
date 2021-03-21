import { query } from './db.js';
import express from 'express';
import { requireAuthentication, checkUserIsAdmin } from "./login.js";
import { genreValidations, showErrors } from './validations.js';

export const router = express.Router();

router.get('/', async (req, res) => {
    const {
        limit,
        offset
    } = req.query;
    const genres = await getGenres(limit, offset);
    if(genres) {
        return res.json(genres);
    }
    return res.status(500).json({error: 'Villa að sækja genres'})
});

router.post('/', genreValidations, showErrors, requireAuthentication, checkUserIsAdmin, async (req, res) => {
    const success = await addGenre(req.body.genre);
    if (success) {
        return res.json({ msg: 'Tókst að búa til tegund'});
    }
    return res.status(500).json({ msg: 'Villa við að búa til tegund'});
});

export async function getGenres(limit = 10, offset = 0) {
  const q = 'SELECT * FROM TVgenre LIMIT $1 OFFSET $2;';
  try {
    const result = await query(q, [limit, offset]);
    return result.rows;
  } catch (e) {
    console.error('Gat ekki sótt genres', e);
    return null;
  }
}

export async function getGenreByName(name) {
  const q = 'SELECT * FROM TVgenre WHERE typeName = $1;';
  try {
    const result = await query(q, [name]);
    return result.rows;
  } catch (e) {
    console.error('Gat ekki fundið genres eftir nafni', e);
    return null;
  }
}

export async function getInfoGenres(id) {
  const q = 'SELECT typeName FROM TVgenre WHERE id IN (SELECT tvgenreId FROM TVconnect WHERE tvseriesId = $1);';
  try {
    const result = await query(q, [id]);
    return result.rows;
  } catch (e) {
    console.error('Gat ekki fundið genres', e);
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
  } catch (e) {
    console.error('Gat ekki bætt við genre', e);
    return false;
  }
}
