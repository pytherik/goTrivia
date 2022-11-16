const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('../../models/userSchema');
const Quest = require('../../models/questSchema');

app.use(bodyParser.urlencoded({ extended: false }));

router.get('/', async (req, res) => {
  const questions = await Quest.find({}).lean();
  const num = Math.floor(Math.random() * questions.length);
  const randomQuest = questions[num];
  randomQuest.isAuthor = req.session.user._id == randomQuest.author;
  console.log(randomQuest.isAuthor)
  res.send(randomQuest);
})

module.exports = router;