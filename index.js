const express = require('express');
const app = express();
const session = require('express-session');
const mongoose = require('./connectDB');
// const pug = require('pug');


const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const middleware = require('./middleware');

const TWO_HOURS = 1000 * 60 * 60 * 2;

const {
  PORT = 3000,
  NODE_ENV = 'developement',
  SESS_NAME = 'sid',
  SESS_SECRET = 'geheim!',
  SESS_LIFETIME = TWO_HOURS
} = process.env

const IN_PROD = NODE_ENV === 'production'

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

app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: false }));

app.set(path.join(__dirname, './views'));
app.set('view engine', 'pug');

app.get('/', middleware.redirectLogin, (req, res, next) => {
	res.render('index', {title: `Hallo ${req.session.user.username}`});
});

const loginRouter = require('./routes/loginRoutes');
const registerRouter = require('./routes/registerRoutes');
const logoutRouter = require('./routes/logoutRoute');

app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/logout', logoutRouter);

app.listen(PORT, () => console.log('Listening on Port:', PORT));

