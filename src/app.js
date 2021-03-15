
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import { format } from 'date-fns';

import { router as tvRouter } from './tv.js';

dotenv.config();

const {
  PORT: port = 3000,
  SESSION_SECRET: sessionSecret,
  DATABASE_URL: connectionString,
} = process.env;

if (!connectionString || !sessionSecret) {
  console.error('Vantar gögn í env');
  process.exit(1);
}

const app = express();

const path = dirname(fileURLToPath(import.meta.url));

app.use(express.static(join(path, '../public')));

app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  maxAge: 20 * 1000, // 20 sek
}));

/* app.use(passport.initialize());
app.use(passport.session()); */

app.locals.formatDate = (str) => {
  let date = '';

  try {
    date = format(str || '', 'dd.MM.yyyy');
  } catch {
    return '';
  }

  return date;
};

app.use('/tv', tvRouter);

app.get('/', (req, res) => {
    res.json({"tv":{"series":{"href":"/tv","methods":["GET","POST"]},"serie":{"href":"/tv/{id}","methods":["GET","PATCH","DELETE"]},"rate":{"href":"/tv/{id}/rate","methods":["POST","PATCH","DELETE"]},"state":{"href":"/tv/{id}/state","methods":["POST","PATCH","DELETE"]}},"seasons":{"seasons":{"href":"/tv/{id}/season","methods":["GET","POST"]},"season":{"href":"/tv/{id}/season/{season}","methods":["GET","DELETE"]}},"episodes":{"episodes":{"href":"/tv/{id}/season/{season}/episode","methods":["POST"]},"episode":{"href":"/tv/{id}/season/{season}/episode/{episode}","methods":["GET","DELETE"]}},"genres":{"genres":{"href":"/genres","methods":["GET","POST"]}},"users":{"users":{"href":"/users","methods":["GET"]},"user":{"href":"/users/{id}","methods":["GET","PATCH"]},"register":{"href":"/users/register","methods":["POST"]},"login":{"href":"/users/login","methods":["POST"]},"me":{"href":"/users/me","methods":["GET","PATCH"]}}});
})

/* app.use('/admin', adminRoute);
 */
/**
 * Middleware sem sér um 404 villur.
 *
 * @param {object} req Request hlutur
 * @param {object} res Response hlutur
 * @param {function} next Næsta middleware
 */
// eslint-disable-next-line no-unused-vars
function notFoundHandler(req, res, next) {
  const title = 'Síða fannst ekki';
  res.status(404).json({ error: title });
}

/**
 * Middleware sem sér um villumeðhöndlun.
 *
 * @param {object} err Villa sem kom upp
 * @param {object} req Request hlutur
 * @param {object} res Response hlutur
 * @param {function} next Næsta middleware
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error(err);
  const title = 'Villa kom upp';
  res.status(500).json({ error: title });
}

app.use(notFoundHandler);
app.use(errorHandler);

// Verðum að setja bara *port* svo virki á heroku
app.listen(port, () => {
  console.info(`Server running at http://localhost:${port}/`);
});