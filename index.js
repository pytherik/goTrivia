const express = require('express');
const app = express();
const session = require('express-session');
const Quest = require('./models/questSchema');
const Veto = require('./models/vetoSchema');
const mongoose = require('./connectDB');

const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const middleware = require('./middleware');

const TWO_HOURS = 1000 * 60 * 60 * 2;

//todo Recherche Session, Process-Environment...
const {
  PORT = 3000,
  NODE_ENV = 'developement',
  SESS_NAME = 'sid',
  SESS_SECRET = 'geheim!',
  SESS_LIFETIME = TWO_HOURS
} = process.env;
const IN_PROD = NODE_ENV === 'production';

app.use(session({
  name: SESS_NAME,
  resave: false,
  saveUninitialized: false,
  secret: SESS_SECRET,
  cookie: {
    maxAge: SESS_LIFETIME,
    sameSite: true,
    secure: IN_PROD
  }
}))

//todo —————————————————————————————————————————

app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: false }));

app.set(path.join(__dirname, './views'));
app.set('view engine', 'pug');


//: Routen Login, Register, Logout

const loginRouter = require('./routes/loginRoutes');
app.use('/login', loginRouter);
const registerRouter = require('./routes/registerRoutes');
app.use('/register', registerRouter);
const logoutRouter = require('./routes/logoutRoute');
app.use('/logout', logoutRouter);


//: CRUD Route

const questRouter = require('./routes/questRoutes');
app.use('/quest', questRouter);


//: Route für Ajax Requests

const questsApiRouter = require('./routes/api/quests');
app.use('/api/quests', questsApiRouter);


app.get('/', middleware.redirectLogin, async(req, res, next) => {
  let message = '';
  let has_vetos = false;
  const categories = await Quest.distinct('category', {});
  console.log(categories);
  const user = req.session.user;
  const questions = await Quest.find({});
  const vetos = await Veto.find({ quest_author: user._id });
  if (questions.length == 0) {
    message = { message: 'Es gibt noch nichts zu raten!' };
    return res.render('create', message);
  }
  if (vetos.length == 0) {
    message = 'Keine Einwände zu deinen Fragen!';
  }
  else {
    if (vetos.length == 1) {
      message = 'Eine Frage wurde beanstandet!'
    } else {
      message = `${vetos.length} Fragen wurden beanstandet!`
    }
    has_vetos = true;

  }
  res.render('index', { user: user, message: message, categories, has_vetos});
});

app.listen(PORT, () => console.log('Listening on Port:', PORT));

