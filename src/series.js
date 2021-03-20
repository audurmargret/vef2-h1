import { query } from './db.js';

export function findSeries(id) {
    const q = `
        SELECT * FROM TVseries WHERE id = $1
    `;
    const result = await query(q, id);
    return result;
}

export function addSeries(data) {
    const q = `
        INSERT INTO 
          TVseries (
            showName,
            releaseDate,
            stillGoing,
            tagline,
            photo,
            about,
            language,
            channel,
            url)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `;
    try {
        await query(q, [
            data.name,
            data.airDate,
            data.inProduction,
            data.tagline,
            data.image,
            data.description,
            data.language,
            data.network,
            data.homepage
        ]);
        return true;
    } catch(e) {
        return false;
    }
}

export function updateSeries(id, data) {
    const q = `
        UPDATE TVseries SET 
          showName = $1,
          releaseDate = $2,
          stillGoing = $3,
          tagline = $4,
          photo = $5,
          about = $6,
          language = $7,
          channel = $8,
          url = $9
        WHERE id = $10
    `;
    try {
        await query(q, [
            data.name,
            data.airDate,
            data.inProduction,
            data.tagline,
            data.image,
            data.description,
            data.language,
            data.network,
            data.homepage,
            id
        ]);
        return true;
    } catch(e) {
        return false;
    }
}

export function deleteSeries(id) {
    const q = `
        DELETE FROM TVseries WHERE id = $1
    `;
    try {
        await query(q, id);
        return true;
    } catch(e) {
        return false;
    }
}

// Users föll tengd series

export function userconnectExist(series_id, userID) {
    const q = `
        SELECT * FROM userConnect WHERE series_id = $1 AND user_id = $2
    `;
    const result = await query(q, [series_id, userID]);
    if (Object.keys(result).length > 0) return true;
    else return false;
}

export function rateSeries(id, user, rating) {
    if (userconnectExist(id, user)){
        updateSeriesRating(id, user, rating)
    }
    else {
        const q = `
        INSERT INTO 
          userConnect (
            series_id,
            user_id,
            rating)
          VALUES ($1, $2, $3)
        `;
        try {
            await query(q, [
                id,
                user,
                rating
            ]);
            return true;
        } catch(e) {
            return false;
        }
    }
}

export function updateSeriesRating(id, user, rating) {
    const q = `
        UPDATE userConnect SET rating = $1 
        WHERE series_id = $2 AND user_id = $3
        `;
        try {
            await query(q, [
                rating,
                id,
                user
            ]);
            return true;
        } catch(e) {
            return false;
        }
}

export function deleteSeriesRating(id, user) {
    const q = `
        UPDATE userConnect SET rating = NULL 
        WHERE series_id = $1 AND user_id = $2
        `;
        try {
            await query(q, [
                id,
                user
            ]);
            return true;
        } catch(e) {
            return false;
        }
}

export function stateSeries(id, user, state) {
    if (userconnectExist(id, user)){
        updateSeriesState(id, user, state)
    }
    else {
        const q = `
        INSERT INTO 
          userConnect (
            series_id,
            user_id,
            status)
          VALUES ($1, $2, $3)
        `;
        try {
            await query(q, [
                id,
                user,
                state
            ]);
            return true;
        } catch(e) {
            return false;
        }
    }
}

export function updateSeriesState(id, user, state) {
    const q = `
        UPDATE userConnect SET status = $1 
        WHERE series_id = $2 AND user_id = $3
        `;
        try {
            await query(q, [
                state,
                id,
                user
            ]);
            return true;
        } catch(e) {
            return false;
        }
}

export function deleteSeriesState(id, user) {
    const q = `
        UPDATE userConnect SET status = NULL 
        WHERE series_id = $1 AND user_id = $2
        `;
        try {
            await query(q, [
                id,
                user
            ]);
            return true;
        } catch(e) {
            return false;
        }
}