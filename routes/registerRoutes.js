const express = require('express');
const app = express();
const router = express.Router();
const middleware = require('../middleware');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const User = require('../models/userSchema');

app.use(bodyParser.urlencoded({ extended: false }));

router.get('/', middleware.redirectHome, (req, res, next) => {
  res.render('register', { title: 'Hallo Register!' });
}) 

router.post('/', async (req, res) => {
  const formFields = req.body;
  const username = formFields.username;
  const email = formFields.email;
  const pass1 = formFields.pass1;
  const pass2 = formFields.pass2;
  
  if (username && email && pass1 && pass2) {
    if (pass1 != pass2) {
      return res.render('register', {
        username: username,
        email: email,
        passErr: 'Keine Übereinstimmung!'
      });
    }
    const found = await User.findOne({
      $or: [
        { username: username },
        { email: email }
      ]
    });

    if (found == null) {
      // no user found
      
      const password = await bcrypt.hash(pass1, 10);
      const user = { username: username, email: email, password: password }
      User.create(user)
        .then((user) => {
          req.session.user = user;
          return res.redirect("/");
        });
    } else {
      if (found.username == username) {
        return res.render('register', { username: "", email: email, nameErr: "Dieser Name existiert schon!" });
      } else {
        return res.render('register', { username: username, email: "", nameErr: "Diese Email existiert schon!" });
      }
    }
  } else {
    console.log('nich Okay!')
  }
})

module.exports = router;
  