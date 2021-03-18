import bcrypt from 'bcrypt';
import { query } from './db.js';

export async function comparePasswords(password, hash) {
  try {
    return await bcrypt.compare(password, hash);
  } catch (e) {
    console.error('Gat ekki borið saman lykilorð', e);
  }

  return false;
}

export async function findAll() {
  const q = 'SELECT * FROM users;';
  try {
    const result = await query(q);
    return result.rows;
  } catch (e) {
    console.error('Gat ekki fundið alla notendur');
    return null;
  }
}
export async function findByUsername(username) {
  const q = `SELECT * FROM users WHERE username = $1`;
  try {
    const result = await query(q, [username]);
    console.log(result.rowCount)
    if (result.rowCount === 1) {
      
      return result.rows[0];

    }
  } catch (e) {
    console.error('Gat ekki fundið notanda eftir notendanafni');
    return null;
  }

  return false;
}

export async function findById(id) {
  const q = `SELECT * FROM users WHERE id = $1`;

  try {
    const result = await query(q, [id]);
    console.log("ID", result)
    if (result.rowCount === 1) {
      return result.rows[0];
    }
  } catch (e) {
    console.error('Gat ekki fundið notanda eftir id');
  }

  return null;
}

export async function updateAdmin(userID) {
  const user = await findById(userID);
  user.admin = !user.admin;
  const q = `UPDATE users SET admin = $1 WHERE id = $2`;
  const values = [user.admin, userID];
  try {
    const result = await query(q, values);
    return true;
  } catch(e) {
    console.error('Gat ekki uppfært admin réttindi');
  }

  return false;
}

export async function createUser(username, email, password, admin) {
  // Geymum hashað password!
  const hashedPassword = await bcrypt.hash(password, 11);

  const q = `
    INSERT INTO
      users (username, email, password, admin)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;

  try {
    const result = await query(q, [username, email, hashedPassword, admin]);
    return result.rows[0];
  } catch (e) {
    console.error('Gat ekki búið til notanda');
  }

  return null;
}