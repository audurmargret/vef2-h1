import passport from 'passport';
import jwt from 'jsonwebtoken';
import {
    Strategy as StrategyJWT, ExtractJwt,
  } from 'passport-jwt';
import { comparePasswords, findByUsername, findById } from './users.js';

const {
    JWT_SECRET: jwtSecret,
    TOKEN_LIFETIME: tokenLifeTime = 60 * 60 * 24 * 7
} = process.env;

export { tokenLifeTime };

if (!jwtSecret) {
    console.error('Vantar .env gildi');
    process.exit(1);
}

export const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtSecret,
  };

/**
 * Athugar hvort username og password sé til í notandakerfi.
 * Callback tekur við villu sem fyrsta argument, annað argument er
 * - `false` ef notandi ekki til eða lykilorð vitlaust
 * - Notandahlutur ef rétt
 *
 * @param {string} username Notandanafn til að athuga
 * @param {string} password Lykilorð til að athuga
 * @param {function} done Fall sem kallað er í með niðurstöðu
 */
async function strat(data, done) {
  try {
    const user = await findById(data.id);
    if (!user) {
      return done(null, false);
    }
    return done(null, user);

    /* // Verður annað hvort notanda hlutur ef lykilorð rétt, eða false
    const result = await comparePasswords(password, user.password);
    return done(null, result ? user : false); */
  } catch (err) {
    console.error(err);
    return done(err);
  }
}


// Notum local strategy með „strattinu“ okkar til að leita að notanda
passport.use(new StrategyJWT(jwtOptions, strat));


// getum stillt með því að senda options hlut með
// passport.use(new Strategy({ usernameField: 'email' }, strat));

// Geymum username á notanda í session, það er nóg til að vita hvaða notandi þetta er
passport.serializeUser((user, done) => {
  done(null, user.username);
});

// Sækir notanda út frá username
passport.deserializeUser(async (username, done) => {
  try {
    const user = await findByUsername(username);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Hjálpar middleware sem athugar hvort notandi sé innskráður og hleypir okkur
// þá áfram, annars sendir á /login
function ensureLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.redirect('/users/login');
}

export function requireAuthentication(req, res, next) {
  passport.authenticate(
    'jwt',
    { session: false },
    (err, user, info) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        const error = info?.name === 'TokenExpiredError'
          ? 'expired token' : 'invalid token';

        return res.status(401).json({ error });
      }
      // Látum notanda vera aðgengilegan í rest af middlewares
      req.user = user;
      return next();
    },
  )(req, res, next);
}

  
export function checkUserIsAdmin(req, res, next) {
  if (req.user && req.user.admin) {
    return next();
  }

  return res.status(403).json({ error: 'Forbidden' });
}

export default passport;