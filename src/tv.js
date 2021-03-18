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
export const router = express.Router();

router.get('/', (req, res) => {
    res.json({color: 'Bleikur'})
});

router.post('/', (req, res) => {
    /* if (!req.user.admin) {
        res.json({ error: 'Villa við að búa til nýtt series' });
        return;
    } */
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

router.patch('/:seriesId', (req, res) => {
    /* if (!req.user.admin) {
        res.status(401).json({ error: 'Villa við að uppfæra serie' });
        return;
    } */
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

router.delete('/:seriesId', (req, res) => {
    /* if (!req.user.admin) {
        res.status(401).json({ error: 'Villa við að eyða serie' });
        return;
    } */
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

router.post('/:seriesId/rate', (req, res) => {
    /* if (!req.isAuthenticated()) {
        res.status(401).json({ error: 'Villa við að gefa einkunn' });
        return;
    } */
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

router.patch('/:seriesId/rate', (req, res) => {
    if (!req.isAuthenticated()) {
        res.status(401).json({ error: 'Villa við að uppfæra einkunn' });
        return;
    }
    const {
        seriesId
    } = req.params;
    const success = updateSeriesRating(seriesId);
    res.json({success});
})

router.delete('/:seriesId/rate', (req, res) => {
    if (!req.isAuthenticated()) {
        res.status(401).json({ error: 'Villa við að eyða einkunn' });
        return;
    }
    const {
        seriesId
    } = req.params;
    const success = deleteSeriesRating(seriesId);
    res.json({success});
})

router.post('/:seriesId/state', (req, res) => {
    if (!req.isAuthenticated()) {
        res.status(401).json({ error: 'Villa við að skrá stöðu' });
        return;
    }
    const {
        seriesId
    } = req.params;
    const success = stateSeries(seriesId);
    res.json({success});
})

router.patch('/:seriesId/state', (req, res) => {
    if (!req.isAuthenticated()) {
        res.status(401).json({ error: 'Villa við að uppfæra stöðu' });
        return;
    }
    const {
        seriesId
    } = req.params;
    const success = updateSeriesState(seriesId);
    res.json({success});
})

router.delete('/:seriesId/state', (req, res) => {
    if (!req.isAuthenticated()) {
        res.status(401).json({ error: 'Villa við að eyða stöðu' });
        return;
    }
    const {
        seriesId
    } = req.params;
    const success = deleteSeriesState(seriesId);
    res.json({success});
})

router.get('/:seriesId/season', (req, res) => {
    const {
        seriesId
    } = req.params;
    const seasons = allSeasons(seriesId);
    res.json(seasons);
})

router.post('/:seriesId/season', (req, res) => {
    if (!req.user.admin) {
        res.status(401).json({ error: 'Villa við að bæta við season' });
        return;
    }
    const {
        seriesId
    } = req.params;
    const success = addSeason(seriesId);
    res.json({ success });
})

router.get('/:seriesId/season/:seasonId', (req, res) => {
    const {
        seriesId,
        seasonId
    } = req.params;
    const season = findSeason(seriesId, seasonId);
    res.json(season);
})

router.delete('/:seriesId/season/:seasonId', (req, res) => {
    if (!req.user.admin) {
        res.status(401).json({ error: 'Villa við að eyða season' });
        return;
    }
    const {
        seriesId,
        seasonId
    } = req.params;
    const success = deleteSeason(seriesId, seasonId);
    res.json({ success });
})

router.post('/:seriesId/season/:seasonId/episode', (req, res) => {
    if (!req.user.admin) {
        res.status(401).json({ error: 'Villa við að búa til nýjan episode' });
        return;
    }
    const {
        seriesId,
        seasonId
    } = req.params;
    const success = addEpisode(seriesId, seasonId);
    res.json( { success } );
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

router.delete('/:seriesId/season/:seasonId/episode/:episodeId', (req, res) => {
    if (!req.user.admin) {
        res.status(401).json({ error: 'Villa við að eyða episode' });
        return;
    }
    const {
        seriesId,
        seasonId,
        episodeId
    } = req.params;
    const success = deleteEpisode(seriesId, seasonId, episodeId);
    res.json( { success } );
})
