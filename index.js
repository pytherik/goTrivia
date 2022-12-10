const express = require('express');
const app = express();
const session = require('express-session');
const Quest = require('./models/questSchema');
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
  const user = req.session.user;
  const questions = await Quest.find({});
  if (questions.length == 0) {
    const message = { message: 'Es gibt noch nichts zu raten!' };
    return res.render('create', message);
  }
  res.render('index', user);
});

app.listen(PORT, () => console.log('Listening on Port:', PORT));

