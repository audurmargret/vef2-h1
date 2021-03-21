import express from 'express';
import {
  rateSeries,
  updateSeriesRating,
  deleteSeriesRating,
  stateSeries,
  updateSeriesState,
  deleteSeriesState,
  deleteSeries,
  updateSeries,
  findSeries,
  addSeries,
  getStateAndRate,
  getInfo,
  findAllSeries,
} from './series.js';
import {
  allSeasons,
  addSeason,
  findSeason,
  deleteSeason,
} from './seasons.js';
import {
  addEpisode,
  findEpisode,
  deleteEpisode,
} from './episodes.js';
import {
  checkUserIsAdmin,
  halfRequireAuthentication,
  requireAuthentication,
} from './login.js';
import {
  seriesValidations,
  showErrors,
  rateValidations,
  stateValidations,
  seasonValidations,
  episodeValidations,
} from './validations.js';
import {
  seriesSanitazions,
  rateSanitazions,
  stateSanitazions,
  seasonSanitazions,
  episodeSanitazions,
} from './sanitazions.js';
import {
  getInfoGenres
} from './genres.js'
import multer from 'multer';

export const router = express.Router();

function multerMiddleWare(req, res, next) {
    multer({ dest: './temp' })
    .single('image')(req, res, (err) => {
      if (err) {
        if (err.message === 'Unexpected field') {
          const errors = [{
            field: 'image',
            error: 'Unable to read image',
          }];
          return res.status(400).json({ errors });
        }

        return next(err);
      }

      return next();
    });
}

router.get('/', async (req, res) => {
  const {
    limit,
    offset,
  } = req.query;
  const series = await findAllSeries(limit, offset);
  if (series) {
    return res.json(series);
  }
  return res.status(500).json({ error: 'Villa við að sækja seríur' });
});

router.post('/', multerMiddleWare, seriesValidations, showErrors, seriesSanitazions, requireAuthentication, checkUserIsAdmin, async (req, res) => {
  const success = await addSeries(req.body, req?.file?.path);
  if (success) {
    return res.json({ msg: 'Bætti við þáttaröð' });
  }
  return res.status(500).json({ error: 'Villa við að bæta við þáttaröð' });
});

router.get('/:seriesId', halfRequireAuthentication, async (req, res) => {
  const {
    seriesId,
  } = req.params;
  let series = await findSeries(seriesId);
  if (!series) {
    return res.status(404).json({ error: 'Sería fannst ekki' });
  }
  if (req.user) {
    const info = await getStateAndRate(seriesId, req.user);
    if (info.rating) {
      series = { ...series, userRating: info.rating };
    }
    if (info.status) {
      series = { ...series, userStatus: info.status };
    }
  }

  const avg = await getInfo(seriesId);
  const genres = await getInfoGenres(seriesId);
  const seasons = await allSeasons(seriesId);
  series = {
    ...series, averageRating: avg.avg, totalRatings: avg.counter, genres, seasons,
  };

  return res.json(series);
});

router.patch('/:seriesId', multerMiddleWare, seriesValidations, showErrors, seriesSanitazions, requireAuthentication, checkUserIsAdmin, async (req, res) => {
  const {
    seriesId,
  } = req.params;
  const success = await updateSeries(seriesId, req.body, req?.file?.path);
  if (success) {
    return res.json({ msg: 'Uppfærði þáttaröð' });
  }
  return res.status(500).json({ error: 'Villa við að uppfæra þáttaröð' });
});

router.delete('/:seriesId', requireAuthentication, checkUserIsAdmin, async (req, res) => {
  const {
    seriesId,
  } = req.params;
  const success = await deleteSeries(seriesId);
  if (success) {
    res.json({ msg: 'Eyddi þáttaröð' });
  }
  return res.status(500).json({ error: 'Villa við að eyða þáttaröð' });
});

router.post('/:seriesId/rate', rateValidations, showErrors, rateSanitazions, requireAuthentication, async (req, res) => {
  const {
    seriesId,
  } = req.params;
  const success = await rateSeries(seriesId, req.user.id, req.body.rate);
  if (success) {
    return res.json({ msg: 'Tókst að gefa einkunn' });
  }
  return res.status(500).json({ error: 'Villa við að gefa einkunn' });
});

router.patch('/:seriesId/rate', rateValidations, showErrors, rateSanitazions, requireAuthentication, (req, res) => {
  const {
    seriesId,
  } = req.params;
  const success = updateSeriesRating(seriesId, req.user.id, req.body);
  if (success) {
    return res.json({ msg: 'Tókst að uppfæra einkunn' });
  }
  return res.status(500).json({ error: 'Villa við að uppfæra einkunn' });
});

router.delete('/:seriesId/rate', requireAuthentication, (req, res) => {
  const {
    seriesId,
  } = req.params;
  const success = deleteSeriesRating(seriesId, req.user.id);
  if (success) {
    return res.json({ msg: 'Tókst að eyða einkunn' });
  }
  return res.status(500).json({ error: 'Villa við að eyða einkunn' });
});

router.post('/:seriesId/state', stateValidations, showErrors, stateSanitazions, requireAuthentication, async (req, res) => {
  const {
    seriesId,
  } = req.params;
  const success = await stateSeries(seriesId, req.user.id, req.body.state);
  if (success) {
    return res.json({ msg: 'Tókst að setja stöðu' });
  }
  return res.status(500).json({ error: 'Villa við að setja stöðu' });
});

router.patch('/:seriesId/state', stateValidations, showErrors, stateSanitazions, requireAuthentication, (req, res) => {
  const {
    seriesId,
  } = req.params;
  const success = updateSeriesState(seriesId);
  if (success) {
    return res.json({ msg: 'Tókst að uppfæra stöðu' });
  }
  return res.status(500).json({ error: 'Villa við að uppfæra stöðu' });
});

router.delete('/:seriesId/state', requireAuthentication, (req, res) => {
  const {
    seriesId,
  } = req.params;
  const success = deleteSeriesState(seriesId);
  if (success) {
    return res.json({ msg: 'Tókst að eyða stöðu' });
  }
  return res.status(500).json({ error: 'Villa við að eyða stöðu' });
});

router.get('/:seriesId/season', async (req, res) => {
  const {
    seriesId,
  } = req.params;
  const {
    limit,
    offset,
  } = req.query;
  const seasons = await allSeasons(seriesId, limit, offset);
  if (!seasons) {
    return res.status(404).json({ error: 'Sería fannst ekki' });
  }
  return res.json(seasons);
});

router.post('/:seriesId/season', multerMiddleWare, seasonValidations, showErrors, seasonSanitazions, requireAuthentication, checkUserIsAdmin, async (req, res) => {
  const {
    seriesId,
  } = req.params;
  const success = await addSeason(req.body, seriesId, req?.file?.path);
  if (success) {
    return res.json({ msg: 'Seríu bætt við' });
  }
  return res.json({ error: 'Ekki tókst að bæta seríu við' });
});

router.get('/:seriesId/season/:seasonId', async (req, res) => {
  const {
    seriesId,
    seasonId,
  } = req.params;
  const season = await findSeason(seriesId, seasonId);
  if (season) {
    return res.json(season);
  }
  return res.status(404).json({ error: 'Fann ekki seríu' });
});

router.delete('/:seriesId/season/:seasonId', requireAuthentication, checkUserIsAdmin, (req, res) => {
  const {
    seriesId,
    seasonId,
  } = req.params;
  const success = deleteSeason(seriesId, seasonId);
  if (success) {
    return res.json({ msg: 'Seríu eytt' });
  }
  return res.json({ error: 'Gat ekki eytt seríu' });
});

router.post('/:seriesId/season/:seasonId/episode', episodeValidations, showErrors, episodeSanitazions, requireAuthentication, checkUserIsAdmin, async (req, res) => {
  const {
    seriesId,
    seasonId,
  } = req.params;
  const success = await addEpisode(seriesId, seasonId, req.body);
  if (success) {
    return res.json({ msg: 'Bætti við þætti' });
  }
  return res.status(500).json({ error: 'Villa við að bæta við þætti' });
});

router.get('/:seriesId/season/:seasonId/episode/:episodeId', async (req, res) => {
  const {
    seriesId,
    seasonId,
    episodeId,
  } = req.params;
  const episode = await findEpisode(seriesId, seasonId, episodeId);
  if (episode.length === 0) {
    return res.status(404).json({ error: 'Þáttur ekki til' });
  }
  return res.json(episode);
});

router.delete('/:seriesId/season/:seasonId/episode/:episodeId', requireAuthentication, checkUserIsAdmin, (req, res) => {
  const {
    seriesId,
    seasonId,
    episodeId,
  } = req.params;
  const success = deleteEpisode(seriesId, seasonId, episodeId);
  if (success) {
    return res.json({ msg: 'Eyddi þætti' });
  }
  return res.status(500).json({ error: 'Villa við að eyða þætti' });
});
