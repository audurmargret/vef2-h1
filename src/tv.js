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
    addSeries
} from './series.js';
import { 
    allSeasons, 
    addSeason, 
    findSeason, 
    deleteSeason 
} from './seasons.js';
import { addEpisode, findEpisode, deleteEpisode } from './episodes.js';
import { checkUserIsAdmin, requireAuthentication } from './login.js';
export const router = express.Router();

router.get('/', (req, res) => {
    res.json({color: 'Bleikur'})
});

router.post('/', requireAuthentication, checkUserIsAdmin, (req, res) => {
    const success = addSeries(req.body);
    if (success) {
        res.json({ msg: 'Bætti við þáttaröð'});
    } else {
        res.status(500).json({ msg: 'Villa við að bæta við þáttaröð'});
    }
})

router.get('/:seriesId', (req, res) => {
    const {
        seriesId
    } = req.params;
    const series = findSeries(seriesId);
    res.json(series);
})

router.patch('/:seriesId', requireAuthentication, checkUserIsAdmin, (req, res) => {
    const {
        seriesId
    } = req.params;
    const success = updateSeries(seriesId, req.body);
    if (success) {
        res.json({ msg: 'Uppfærði þáttaröð'});
    } else {
        res.status(500).json({ msg: 'Villa við að uppfæra þáttaröð'});
    }
})

router.delete('/:seriesId', requireAuthentication, checkUserIsAdmin, (req, res) => {
    const {
        seriesId
    } = req.params;
    const success = deleteSeries(seriesId);
    if (success) {
        res.json({ msg: 'Eyddi þáttaröð'});
    } else {
        res.status(500).json({ msg: 'Villa við að eyða þáttaröð'});
    }
})

router.post('/:seriesId/rate', requireAuthentication, (req, res) => {
    const {
        seriesId
    } = req.params;
    const success = rateSeries(seriesId, req.body);
    if (success) {
        res.json({ msg: 'Tókst að gefa einkunn'});
    } else {
        res.status(500).json({ msg: 'Villa við að gefa einkunn'});
    }
})

router.patch('/:seriesId/rate', requireAuthentication, (req, res) => {
    const {
        seriesId
    } = req.params;
    const success = updateSeriesRating(seriesId);
    res.json({success});
})

router.delete('/:seriesId/rate', requireAuthentication, (req, res) => {
    const {
        seriesId
    } = req.params;
    const success = deleteSeriesRating(seriesId);
    res.json({success});
})

router.post('/:seriesId/state', requireAuthentication, (req, res) => {
    const {
        seriesId
    } = req.params;
    const success = stateSeries(seriesId);
    res.json({success});
})

router.patch('/:seriesId/state', requireAuthentication, (req, res) => {
    const {
        seriesId
    } = req.params;
    const success = updateSeriesState(seriesId);
    res.json({success});
})

router.delete('/:seriesId/state', requireAuthentication, (req, res) => {
    const {
        seriesId
    } = req.params;
    const success = deleteSeriesState(seriesId);
    res.json({success});
})

router.get('/:seriesId/season', async (req, res) => {
    const {
        seriesId
    } = req.params;
    const seasons = await allSeasons(seriesId);
    return res.json(seasons);
})

router.post('/:seriesId/season', requireAuthentication, checkUserIsAdmin, async (req, res) => {
    const {
        seriesId
    } = req.params;
    const {
      showName,
      season_num,
      releaseDate,
      about,
      photo,
      series_id,
    } = req.body
    console.log(req.body)
    const success = await addSeason(req.body);
    if(success) {
        return res.json('Seríu bætt við')
    }
    return res.json('Ekki tókst að bæta seríu við');
})

router.get('/:seriesId/season/:seasonId', async (req, res) => {
    const {
        seriesId,
        seasonId
    } = req.params;
    const season =  await findSeason(seriesId, seasonId);
    if(season) {
        return res.json(season);
    }
    return res.json('Fann ekki seríu')
})

router.delete('/:seriesId/season/:seasonId', requireAuthentication, checkUserIsAdmin, (req, res) => {
    const {
        seriesId,
        seasonId
    } = req.params;
    const success = deleteSeason(seriesId, seasonId);
    if(success) {
        return res.json('Seríu eytt')
    }
    return res.json('Gat ekki eytt seríu');
})

router.post('/:seriesId/season/:seasonId/episode', requireAuthentication, checkUserIsAdmin, (req, res) => {
    const {
        seriesId,
        seasonId
    } = req.params;
    const success = addEpisode(seriesId, seasonId, req.body);
    if (success) {
        res.json({ msg: 'Bætti við þætti'});
    } else {
        res.status(500).json({ msg: 'Villa við að bæta við þætti'});
    }
})

router.get('/:seriesId/season/:seasonId/episode/:episodeId', (req, res) => {
    const {
        seriesId,
        seasonId,
        episodeId
    } = req.params;
    const episode = findEpisode(seriesId, seasonId, episodeId);
    res.json(episode);
})

router.delete('/:seriesId/season/:seasonId/episode/:episodeId', requireAuthentication, checkUserIsAdmin, (req, res) => {
    const {
        seriesId,
        seasonId,
        episodeId
    } = req.params;
    const success = deleteEpisode(seriesId, seasonId, episodeId);
    if (success) {
        res.json({ msg: 'Eyddi þætti'});
    } else {
        res.status(500).json({ msg: 'Villa við að eyða þætti'});
    }
})