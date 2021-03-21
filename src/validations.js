
import validator from 'express-validator';
import { findByUsername, findByEmail } from './users.js';


const { check } = validator;

async function validUsername(value) {
    const id = (await findByUsername(value));
    if (id) {
      throw new Error('Notendanfn þegar skráð');
    }
    return true;
  }
  async function validEmail(value) {
    const id = (await findByEmail(value));
    if (id) {
      throw new Error('Tölvupóstfang þegar skráð');
    }
    return true;
  }

export const TV_validations = [
    check('show_name')
      .isLength({ min: 1 })
      .withMessage('Nafn má ekki vera tómt'),

    check('release_date')
      .isDate()
      .withMessage('Ógild dagsetning')
  ];


export const user_validations = [
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
      .blacklist('-').custom((val) => validUsername(val))
      .withMessage('Notendanafn er ekki laust'),
    
    check('email')
      .blacklist('-').custom((val) => validEmail(val))
      .withMessage('Tölvupóstfang er ekki laust'),
  ];