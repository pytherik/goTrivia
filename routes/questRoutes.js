const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const Quest = require('../models/questSchema');

app.use(bodyParser.urlencoded({ extended: false }));

router.get('/', async (req, res) => {
  const user = req.session.user;
  const questions = Quest.find({});
  const num = Math.floor(Math.random() * questions.length);
  const randomQuest = questions[num];
  if (randomQuest.isMultiple == true) {
    return res.render('multiple', { user, randomQuest });
  } else {
    return res.render('trueFalse', { user, randomQuest });
  }
})



module.exports = router;
