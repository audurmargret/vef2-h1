import express from 'express';
import jwt from 'jsonwebtoken';


import { requireAuthentication, checkUserIsAdmin, jwtOptions, tokenLifeTime } from './login.js';
import { comparePasswords, findById, findByUsername, updateAdmin, createUser, findAll, updatePassword, updateEmail } from './users.js';
import { catchErrors } from './utils.js';

export const router = express.Router();
router.use(express.json());

async function index(req, res) {
  // TODO:  paging
  const string = 'SELECT * FROM users;';
  const userList = await findAll();
  const length = Object.keys(userList).length;
  for(let i = 0; i < length; i++){
      delete userList[i].password;
  }

  return res.json({userList});
}

async function login(req, res) {
  const {username, password = ''} = req.body;
  const user = await findByUsername(username);

  if (!user) {
    return res.status(401).json({error: 'Enginn notandi skráður á þessu notendanafni'});
  }
  const passwordIsCorrect = await comparePasswords(password, user.password);

  if(passwordIsCorrect) {
    const payload = { id: user.id };
    const tokenOptions = { expiresIn: tokenLifeTime };
    const token = jwt.sign(payload, jwtOptions.secretOrKey, tokenOptions);
    return res.json({ token });
  }
  return res.json({ error: 'Vitlaust lykilorð' });
}

async function register(req, res) {
  const {username, email, password = ''} = req.body;

  const user = await findByUsername(username);
  if(user) {
    return res.status(401).json({error: 'Þessi notandi er þegar til'})
  }

  await createUser(username, email, password, false);
  const newUser = await findByUsername(username);
  delete newUser.password;

  return res.json(newUser);
}

async function meGET(req, res) {
  const user = await findById(req.user.id);
  delete user.password;
  return res.json(user);
}

async function mePATCH(req, res) {
  const {email, password = ''} = req.body;
  const userID = req.user.id;
  if(password !== '') {
    updatePassword(userID, password);
  }
  if(email !== '') {
    updateEmail(userID, email);
  }
  const user = await findById(userID);
  delete user.password;
  return res.json(user);
}

async function userGET(req, res) {
  const {
    id: userID
  } = req.params;
  const user = await findById(userID);
  if(user){
    delete user.password;
    return res.json({user});
  }
  return res.json('Engin notandi með þetta auðkenni')
}

async function userPATCH(req, res) {
  const {
    id: userID
  } = req.params;

  if(parseInt(userID) === req.user.id){
    return res.json('Ekki hægt að breyta sjálfum sér');
  }

  const user = await findById(userID)
  const update = await updateAdmin(userID);
  
  if(update) {
    return res.json({ 
      id: userID, 
      user: user,
    });
  }
  return res.json('Gat ekki uppfært notanda');
}

router.get('/', requireAuthentication, checkUserIsAdmin, catchErrors(index));
router.get('/me', requireAuthentication, catchErrors(meGET));
router.get('/:id', requireAuthentication, checkUserIsAdmin, catchErrors(userGET));

router.post('/login', catchErrors(login));
router.post('/register', catchErrors(register));

router.patch('/me',requireAuthentication, catchErrors(mePATCH));
router.patch('/:id', requireAuthentication, checkUserIsAdmin, catchErrors(userPATCH));
