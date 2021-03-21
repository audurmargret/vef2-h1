import validator from 'express-validator';
import { getGenreByName } from './genres.js';
import { findByUsername, findByEmail } from './users.js';

const { check, validationResult } = validator;

async function validUsername(value) {
  const user = (await findByUsername(value));
  if (user) {
    throw new Error('Notendanfn þegar skráð');
  }
  return true;
}

async function validEmail(value) {
  const user = (await findByEmail(value));
  if (user) {
    throw new Error('Tölvupóstfang þegar skráð');
  }
  return true;
}
async function validTypeName(value) {
  const id = (await getGenreByName(value));
  if (id) {
    throw new Error('Genre er þegar til');
  }
  return true;
}
async function validRate(value) {
  if (value !== 0 || value !== 1 || value !== 2 || value !== 3 || value !== 4 || value !== 5) {
    throw new Error('Einkunn verður að vera heiltala frá og með 0 til og með 5');
  }
  return true;
}
async function validState(value) {
  if (value !== 'Langar að horfa' || value !== 'Er að horfa' || value !== 'Hef horft') {
    throw new Error('Staða verður að vera "Langar að horfa", "Er að horfa" eða "Hef horft"');
  }
  return true;
}

export const seriesValidations = [
  check('showName')
    .isLength({ min: 1 })
    .withMessage('Nafn má ekki vera tómt'),

  check('releaseDate')
    .isDate()
    .withMessage('Ógild dagsetning'),

  check('stillGoing')
    .isBoolean()
    .withMessage('stillGoing verður að vera true eða false'),

  check('url')
    .optional().isUrl()
    .withMessage('Ógildur linkur'),
];

export const genreValidations = [
  check('typeName')
    .isLength({ min: 1 })
    .withMessage('Nafn má ekki vera tómt'),

  check('typeName')
    .custom((val) => validTypeName(val))
    .withMessage('Genre er þegar skráð'),
];

export const rateValidations = [
  check('rate')
    .custom((val) => validRate(val))
    .withMessage('Einkunn verður að vera heiltala frá og með 0 til og með 5'),
];

export const stateValidations = [
  check('status')
    .custom((val) => validState(val))
    .withMessage('Staða verður að vera "Langar að horfa", "Er að horfa" eða "Hef horft"'),
];
export const userValidations = [
  check('username')
    .isLength({ min: 1 })
    .withMessage('Notendanafn má ekki vera tómt'),

  check('email')
    .isLength({ min: 1 })
    .withMessage('Tölvupóstfang má ekki vera tómt'),

  check('email')
    .isEmail()
    .withMessage('Ógilt netfang'),

  check('password')
    .isLength({ min: 1 })
    .withMessage('Lykilorð má ekki vera tómt'),

  check('username')
    .custom((val) => validUsername(val))
    .withMessage('Notendanafn er ekki laust'),

  check('email')
    .custom((val) => validEmail(val))
    .withMessage('Tölvupóstfang er ekki laust'),
];

export const seasonValidations = [
  check('showName')
    .isLength({ min: 1 })
    .withMessage('Nafn má ekki vera tómt'),

  check('seasonNum')
    .isInt()
    .optional().withMessage('Númer seríu verður að vera heiltala'),

  check('releaseDate')
    .isDate()
    .withMessage('Ógild dagsetning'),

  check('seriesId')
    .optional().isInt()
    .withMessage('Series ID verður að vera heiltala'),
];

export const episodeValidations = [
  check('episodeName')
    .isLength({ min: 1 })
    .withMessage('Nafn má ekki vera tómt'),

  check('epiNum')
    .optional().isInt()
    .withMessage('Númer þátts verður að vera heiltala'),

  check('releaseDate')
    .isDate()
    .withMessage('Ógild dagsetning'),

  check('season')
    .optional().isInt()
    .withMessage('Sería verður að vera heiltala'),

  check('seriesId')
    .optional().isInt()
    .withMessage('Series ID verður að vera heiltala'),

];

export async function showErrors(req, res, next) {
  const validation = validationResult(req);

  if (!validation.isEmpty()) {
    const errorMessages = validation.array();
    return res.json({ errorMessages });
  }
  return next();
}
