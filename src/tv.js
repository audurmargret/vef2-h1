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
    getRatingAvg
} from './series.js';
import { 
    allSeasons, 
    addSeason, 
    findSeason, 
    deleteSeason 
} from './seasons.js';
import { addEpisode, findEpisode, deleteEpisode } from './episodes.js';
import { checkUserIsAdmin, halfRequireAuthentication, requireAuthentication } from './login.js';
export const router = express.Router();

router.get('/', (req, res) => {
    res.json({color: 'Bleikur'})
});

router.post('/', requireAuthentication, checkUserIsAdmin, (req, res) => {
    const success = addSeries(req.body);
    if (success) {
        res.json({ msg: 'Bætti við þáttaröð'});
    } else {
        res.status(500).json({ error: 'Villa við að bæta við þáttaröð'});
    }
})

router.get('/:seriesId', halfRequireAuthentication, async (req, res) => {
    const {
        seriesId
    } = req.params;
    let series = await findSeries(seriesId);
    if(req.user) {
        console.log(req.user.id)
        const info = await getStateAndRate(seriesId, req.user)
        console.log(info)
        series = { ...series, userRating: info.rating, userStatus: info.status};
        console.log(series)
    }

    const avg = await getRatingAvg(seriesId)
    series = { ...series, averageRating: avg}


    // TODO: reikna rate
    // TODO: state notanda
    // TODO: rate notanda

    return res.json(series);
})

router.patch('/:seriesId', requireAuthentication, checkUserIsAdmin, async (req, res) => {
    const {
        seriesId
    } = req.params;
    const success = await updateSeries(seriesId, req.body);
    if (success) {
        res.json({ msg: 'Uppfærði þáttaröð'});
    } else {
        res.status(500).json({ error: 'Villa við að uppfæra þáttaröð'});
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
        res.status(500).json({ error: 'Villa við að eyða þáttaröð'});
    }
})

router.post('/:seriesId/rate', requireAuthentication, (req, res) => {
    const {
        seriesId
    } = req.params;
    const success = rateSeries(seriesId, req.user.id, req.body.rate);
    if (success) {
        res.json({ msg: 'Tókst að gefa einkunn'});
    } else {
        res.status(500).json({error: 'Villa við að gefa einkunn'});
    }
})

router.patch('/:seriesId/rate', requireAuthentication, (req, res) => {
    const {
        seriesId
    } = req.params;
    const success = updateSeriesRating(seriesId, req.user.id, req.body);
    if (success) {
        res.json({msg: 'Tókst að uppfæra einkunn'});
    } else {
        res.status(500).json({error: 'Villa við að uppfæra einkunn'});
    }
})

router.delete('/:seriesId/rate', requireAuthentication, (req, res) => {
    const {
        seriesId
    } = req.params;
    const success = deleteSeriesRating(seriesId, req.user.id);
    if (success) {
        res.json({ msg: 'Tókst að eyða einkunn'});
    } else {
        res.status(500).json({error: 'Villa við að eyða einkunn'});
    }
})

router.post('/:seriesId/state', requireAuthentication, async (req, res) => {
    const {
        seriesId
    } = req.params;
    console.log(req.body.state)
    const success = await stateSeries(seriesId, req.user.id, req.body.state );
    if (success) {
        res.json({ msg: 'Tókst að setja stöðu'});
    } else {
        res.status(500).json({error: 'Villa við að setja stöðu'});
    }
})

router.patch('/:seriesId/state', requireAuthentication, (req, res) => {
    const {
        seriesId
    } = req.params;
    const success = updateSeriesState(seriesId);
    if (success) {
        res.json({ msg: 'Tókst að uppfæra stöðu'});
    } else {
        res.status(500).json({ error: 'Villa við að uppfæra stöðu'});
    }
})

router.delete('/:seriesId/state', requireAuthentication, (req, res) => {
    const {
        seriesId
    } = req.params;
    const success = deleteSeriesState(seriesId);
    if (success) {
        res.json({ msg: 'Tókst að eyða stöðu'});
    } else {
        res.status(500).json({ error: 'Villa við að eyða stöðu'});
    }
})

router.get('/:seriesId/season', async (req, res) => {
    const {
        seriesId
    } = req.params;
    const seasons = await allSeasons(seriesId);
    return res.json(seasons);
})

router.post('/:seriesId/season', requireAuthentication, checkUserIsAdmin, async (req, res) => {
    const success = await addSeason(req.body);
    if(success) {
        return res.json({msg: 'Seríu bætt við'});
    }
    return res.json({error: 'Ekki tókst að bæta seríu við'});
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
    return res.json({error: 'Fann ekki seríu'});
})

router.delete('/:seriesId/season/:seasonId', requireAuthentication, checkUserIsAdmin, (req, res) => {
    const {
        seriesId,
        seasonId
    } = req.params;
    const success = deleteSeason(seriesId, seasonId);
    if(success) {
        return res.json({msg: 'Seríu eytt'});
    }
    return res.json({error: 'Gat ekki eytt seríu'});
})

router.post('/:seriesId/season/:seasonId/episode', requireAuthentication, checkUserIsAdmin, async (req, res) => {
    const {
        seriesId,
        seasonId
    } = req.params;
    const success = await addEpisode(seriesId, seasonId, req.body);
    if (success) {
        res.json({ msg: 'Bætti við þætti'});
    } else {
        res.status(500).json({ error: 'Villa við að bæta við þætti'});
    }
})

router.get('/:seriesId/season/:seasonId/episode/:episodeId', async (req, res) => {
    const {
        seriesId,
        seasonId,
        episodeId
    } = req.params;
    const episode = await findEpisode(seriesId, seasonId, episodeId);
    if(episode.length === 0) {
        return res.json({error: 'Þáttur ekki til'});
    }
    return res.json(episode);
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
        res.status(500).json({ error: 'Villa við að eyða þætti'});
    }
})

router.get('/genres', (req, res) => {
    const genres = getGenres();
    res.json(genres);
})

router.post('/genres', requireAuthentication, checkUserIsAdmin, (req, res) => {
    const success = addGenre(req.body.genre);
    if (success) {
        res.json({ msg: 'Tókst að búa til tegund'});
    } else {
        res.status(500).json({ msg: 'Villa við að búa til tegund'});
    }
})