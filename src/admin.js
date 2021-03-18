import express from 'express';
import xss from 'xss';
import jwt from 'jsonwebtoken';

import { query } from './db.js';
import passport, { requireAuthentication, checkUserIsAdmin, jwtOptions, tokenLifeTime } from './login.js';
import { comparePasswords, findById, findByUsername, updateAdmin, createUser } from './users.js';
import { catchErrors, pagingInfo, PAGE_SIZE } from './utils.js';

export const router = express.Router();
router.use(express.json());

/**
 * 
 *   if (req.isAuthenticated()) {
        return res.redirect('/');
     }
 */
async function index(req, res) {
    // TODO:  paging
    const string = 'SELECT * FROM users;';
    const userList = await query(string);
    return res.json({userList});
}

async function login(req, res) {
  const {username, password = ''} = req.body;

  const user = await findByUsername(username);
  
  if (!user) {
    return res.status(401).json({error: 'No such user'});
  }
  const passwordIsCorrect = await comparePasswords(password, user.password);
    
  if(passwordIsCorrect) {
    const payload = { id: user.id };
    const tokenOptions = { expiresIn: tokenLifeTime };
    const token = jwt.sign(payload, jwtOptions.secretOrKey, tokenOptions);
    return res.json({ token });
  }
  return res.json({ error: 'Invalid password' });
}
async function register(req, res) {
    const {username, email, password = ''} = req.body;

    const user = await findByUsername(username);
    if(user) {
        return res.status(401).json({error: 'User already exist'})
    }

    await createUser(username, email, password, false);
    const newUser = await findByUsername(username);

    // TODO:  hér á bar að skila auðkenni og netfangi
    return res.json({newUser})
}

function meGET(req, res) {
    // 'GET skilar upplýsingum um notanda sem á token, auðkenni og netfangi, aðeins ef notandi innskráður'

    return res.json({todo: 'GET skilar upplýsingum um notanda sem á token, auðkenni og netfangi, aðeins ef notandi innskráður'})
}

function mePATCH(req, res) {
    // 'PATCH uppfærir netfang, lykilorð eða bæði ef gögn rétt, aðeins ef notandi innskráður'

    return res.json({todo:'PATCH uppfærir netfang, lykilorð eða bæði ef gögn rétt, aðeins ef notandi innskráður' })
}

async function userGET(req, res) {
    //GET skilar notanda, aðeins ef notandi sem framkvæmir er stjórnandi
    const {
        id: userID
    } = req.params;
    const user = await findById(userID);

    // TODO:  erum líka að skila passwordi hér, er það í lagi?
    return res.json({user});
}

async function userPATCH(req, res) {
    // 'PATCH breytir hvort notandi sé stjórnandi eða ekki, aðeins ef notandi sem framkvæmir er stjórnandi og er ekki að breyta sér sjálfum'
    const {
        id: userID
    } = req.params;

    // TODO: við komandi verður að vera admin
    // TODO: ef það er verið að reyna breyta sjálfum sér:

    const user = await findById(userID)

    const update = await updateAdmin(userID);

    return res.json({ 
        id: userID, 
        user: user,
 });
}

//router.get('/', requireAuthentication, checkUserIsAdmin, catchErrors(index));
router.get('/', catchErrors(index));
router.get('/me', meGET);
router.get('/:id', userGET);

router.post('/login', login);
router.post('/register', catchErrors(register));

router.patch('/me', mePATCH);
router.patch('/:id', userPATCH);


/*  TODO: á ekki að vera logout?? 


router.get('/logout', (req, res) => {
  // logout hendir session cookie og session
  req.logout();
  res.redirect('/');
}); 

*/ 