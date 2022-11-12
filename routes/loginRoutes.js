const express = require('express');
const app = express();
const router = express.Router();
const bcrypt = require('bcrypt');
const middleware = require('../middleware');
const bodyParser = require('body-parser');
const User = require('../models/userSchema');

app.use(bodyParser.urlencoded({ extended: false }));

router.get('/', middleware.redirectHome, (req, res, next) => {
  res.render('login', { title: 'Hallo login!' });
}) 

router.post('/', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const user = await User.findOne({ $or: [{ username: username }, { email: username }] });
  if (user) {
    const result = await bcrypt.compare(password, user.password);
    if (result == true) {
      req.session.user = user;
      return res.redirect('/');
    } else {
      return res.render('login', { passErr: "Passwort falsch!", username: username })
    }
  } else {
    return res.render('login', { nameErr: "Hier stimmt was nicht", username: username })
  }
})

module.exports = router;
  