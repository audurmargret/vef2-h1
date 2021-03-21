import { query, uploadImage } from './db.js';
import fs from 'fs/promises';

export async function findAllSeries(limit = 10, offset = 0) {
  const q = 'SELECT * FROM TVseries LIMIT $1 OFFSET $2';
  try {
    const result = await query(q, [limit, offset]);
    return result.rows;
  } catch (e) {
    console.error('Gat ekki sótt þáttaraðir', e);
    return null;
  }
}

export async function findSeries(id) {
  const q = `
        SELECT * FROM TVseries WHERE id = $1
    `;
  try {
    const result = await query(q, [id]);
    if (result.rowCount === 0) {
      console.error('Þáttaröð fannst ekki');
      return null;
    }
    return result.rows[0];
  } catch (e) {
    console.error('Gat ekki sótt þáttaröð');
    return null;
  }
}

export async function addSeries(data, imagePath) {
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
    var imageUrl;
    if (imagePath) {
      imageUrl = await uploadImage(imagePath);
      await fs.rm(imagePath);
    }
    await query(q, [
      data.showName,
      data.releaseDate,
      data.stillGoing,
      data.tagline,
      imageUrl,
      data.about,
      data.language,
      data.channel,
      data.url,
    ]);
    return true;
  } catch (e) {
    console.error('Gat ekki bætt við þáttaröð', e);
    return false;
  }
}

export async function updateSeries(id, data, imagePath) {
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
  var imageUrl;
  if (imagePath) {
    imageUrl = await uploadImage(imagePath);
    await fs.rm(imagePath);
  }
  try {
    await query(q, [
      data.showName,
      data.releaseDate,
      data.stillGoing,
      data.tagline,
      imageUrl,
      data.about,
      data.language,
      data.channel,
      data.url,
      id,
    ]);
    return true;
  } catch (e) {
    console.error('Villa við að uppfæra seríu', e);
    return false;
  }
}

export async function deleteSeries(id) {
  const q = `
        DELETE FROM TVseries WHERE id = $1
    `;
    // TODO: deleta öllu allstaðar sem þessi tvseries kemur fyrir
  try {
    await query(q, [id]);
    return true;
  } catch (e) {
    console.error('Gat ekki eytt þáttaröð', e);
    return false;
  }
}

// Users föll tengd series

export async function userconnectExist(seriesId, userID) {
  const q = `
        SELECT * FROM userConnect WHERE seriesId = $1 AND userId = $2
    `;
  const result = await query(q, [seriesId, userID]);
  if (Object.keys(result.rows).length === 0) return false;
  return true;
}

export async function updateSeriesRating(id, user, rating) {
  const q = `
        UPDATE userConnect SET rating = $1 
        WHERE seriesId = $2 AND userId = $3
        `;
  try {
    await query(q, [
      rating,
      id,
      user,
    ]);
    return true;
  } catch (e) {
    return false;
  }
}

export async function rateSeries(id, user, rating) {
  if (await userconnectExist(id, user)) {
    return updateSeriesRating(id, user, rating);
  }
  const q = `
        INSERT INTO 
          userConnect (
            seriesId,
            userId,
            rating)
          VALUES ($1, $2, $3)
        `;
  try {
    await query(q, [
      id,
      user,
      rating,
    ]);
    return true;
  } catch (e) {
    return false;
  }
}

export async function deleteSeriesRating(id, user) {
  const q = `
        UPDATE userConnect SET rating = NULL 
        WHERE seriesId = $1 AND userId = $2
        `;
  try {
    await query(q, [
      id,
      user,
    ]);
    return true;
  } catch (e) {
    return false;
  }
}

export async function updateSeriesState(id, user, state) {
  const q = `
        UPDATE userConnect SET status = $1 
        WHERE seriesId = $2 AND userId = $3
        `;
  try {
    await query(q, [
      state,
      id,
      user,
    ]);
    return true;
  } catch (e) {
    return false;
  }
}

export async function stateSeries(id, user, state) {
  if (await userconnectExist(id, user)) {
    return updateSeriesState(id, user, state);
  }
  const q = `
        INSERT INTO 
          userConnect (
            seriesId,
            userId,
            status)
          VALUES ($1, $2, $3)
        `;
  try {
    await query(q, [
      id,
      user,
      state,
    ]);
    return true;
  } catch (e) {
    console.error('Gat ekki bætt við stöðu', e);
    return false;
  }
}

export async function deleteSeriesState(id, user) {
  const q = `
        UPDATE userConnect SET status = NULL 
        WHERE seriesId = $1 AND userId = $2
        `;
  try {
    await query(q, [
      id,
      user,
    ]);
    return true;
  } catch (e) {
    console.error('Gat ekki eytt stöðu', e);
    return false;
  }
}

export async function getStateAndRate(id, user) {
  const q = 'SELECT * FROM userConnect WHERE seriesId = $1 AND userId = $2';
  const values = [id, user.id];
  try {
    const result = await query(q, values);

    if (result.rowCount > 0) {
      return result.rows[0];
    }
    return null;
  } catch (e) {
    console.error('Villa við að sækja stöðu og einkunn', e);
    return null;
  }
}

export async function getInfo(id) {
  const q = 'SELECT * FROM userConnect WHERE seriesId = $1';
  let sum = 0;
  let counter = 0;

  try {
    const result = await query(q, [id]);
    for (let i = 0; i < result.rowCount; i += 1) {
      sum += result.rows[i].rating;
      if (result.rows[i].rating !== null) {
        counter += 1;
      }
    }
    const avg = sum / counter;
    return { avg, counter };
  } catch (e) {
    return null;
  }
}
