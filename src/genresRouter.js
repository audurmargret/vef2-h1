import express from 'express';
import { requireAuthentication, checkUserIsAdmin } from './login.js';
import { genreValidations, showErrors } from './validations.js';
import { getGenres, addGenre } from './genres.js'

export const router = express.Router();

router.get('/', async (req, res) => {
    const {
      limit,
      offset,
    } = req.query;
    const genres = await getGenres(limit, offset);
    if (genres) {
      return res.json(genres);
    }
    return res.status(500).json({ error: 'Villa að sækja genres' });
  });
  
  router.post('/', genreValidations, showErrors, requireAuthentication, checkUserIsAdmin, async (req, res) => {
    const success = await addGenre(req.body.genre);
    if (success) {
      return res.json({ msg: 'Tókst að búa til tegund' });
    }
    return res.status(500).json({ msg: 'Villa við að búa til tegund' });
  });