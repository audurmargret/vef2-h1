import express from 'express';
import { findSeriesById } from './series.js';
export const router = express.Router();

router.get('/', (req, res) => {
    res.json({color: 'Bleikur'})
});

router.post('/', (req, res) => {
    if (!req.user.admin) {
        res.json({ error: 'Villa við að búa til sjónvarpsþátt' });
        return;
    }
    res.json({ msg: 'Bætti við þátt'});
})

router.get('/:showId', (req, res) => {
    const {
        showId
    } = req.params;
    const show = findSeriesById(showId);
    res.json(show);
})

router.patch('/:showId', (req, res) => {
    if (!req.user.admin) {
        res.status(401).json({ error: 'Villa við að uppfæra sjónvarpsþátt' });
        return;
    }
    const {
        showId
    } = req.params;
    res.json({showId});
})

router.delete('/:showId', (req, res) => {
    if (!!req.user.admin) {
        res.status(401).json({ error: 'Villa við að eyða sjónvarpsþátt' });
        return;
    }
    const {
        showId
    } = req.params;
    res.json({showId});
})

router.post('/:showId/rate', (req, res) => {
    if (!req.isAuthenticated()) {
        res.status(401).json({ error: 'Villa við gefa einkunn' });
        return;
    }
    const {
        showId
    } = req.params;
    res.json({showId});
})

router.patch('/:showId/rate', (req, res) => {
    if (!req.isAuthenticated()) {
        res.status(401).json({ error: 'Villa við að uppfæra einkunn' });
        return;
    }
    const {
        showId
    } = req.params;
    res.json({showId});
})

router.delete('/:showId/rate', (req, res) => {
    if (!req.isAuthenticated()) {
        res.status(401).json({ error: 'Villa við að eyða einkunn' });
        return;
    }
    const {
        showId
    } = req.params;
    res.json({showId});
})

router.post('/:showId/state', (req, res) => {
    if (!req.isAuthenticated()) {
        res.status(401).json({ error: 'Villa við að skrá stöðu' });
        return;
    }
    const {
        showId
    } = req.params;
    res.json({showId});
})

router.patch('/:showId/state', (req, res) => {
    if (!req.isAuthenticated()) {
        res.status(401).json({ error: 'Villa við að uppfæra stöðu' });
        return;
    }
    const {
        showId
    } = req.params;
    res.json({showId});
})

router.delete('/:showId/state', (req, res) => {
    if (!req.isAuthenticated()) {
        res.status(401).json({ error: 'Villa við að eyða stöðu' });
        return;
    }
    const {
        showId
    } = req.params;
    res.json({showId});
})

router.get('/:showId/season', (req, res) => {
    const {
        showId
    } = req.params;
    res.json({ showId });
})

router.post('/:showId/season', (req, res) => {
    if (!req.user.admin) {
        res.status(401).json({ error: 'Villa við að eyða seríu' });
        return;
    }
    const {
        showId
    } = req.params;
    res.json({ showId });
})

router.get('/:showId/season/:seasonId', (req, res) => {
    const {
        showId,
        seasonId
    } = req.params;
    res.json({ showId, seasonId });
})

router.delete('/:showId/season/:seasonId', (req, res) => {
    if (!req.user.admin) {
        res.status(401).json({ error: 'Villa við að eyða seríu' });
        return;
    }
    const {
        showId,
        seasonId
    } = req.params;
    res.json({ msg: 'DELETE' });
})

router.post('/:showId/season/:seasonId/episode', (req, res) => {
    if (!req.user.admin) {
        res.status(401).json({ error: 'Villa við að búa til nýjan þátt' });
        return;
    }
    const {
        showId,
        seasonId
    } = req.params;
})

router.get('/:showId/season/:seasonId/episode/:episodeId', (req, res) => {
    const {
        showId,
        seasonId,
        episodeId
    } = req.params;
    res.json( { showId, seasonId, episodeId } );
})

router.delete('/:showId/season/:seasonId/episode/:episodeId', (req, res) => {
    if (!req.user.admin) {
        res.status(401).json({ error: 'Villa við að eyða þætti' });
        return;
    }
    const {
        showId,
        seasonId,
        episodeId
    } = req.params;
    res.json({ msg: 'DELETE' });
})
