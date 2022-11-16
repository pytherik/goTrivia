const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const Quest = require('../models/questSchema');

app.use(bodyParser.urlencoded({ extended: false }));

router.get('/', async (req, res) => {
  const user = req.session.user;
  const questions = await Quest.find({}).lean();
  const num = Math.floor(Math.random() * questions.length);
  const randomQuest = questions[num];
  return res.render('multiple', { user, randomQuest });
})

router.get('/create', (req, res) => {
  return res.render('create');
})

router.post('/', async (req, res) => {
  const quest = req.body;
  const payload = { author: req.session.user._id }
  payload.isMultiple = true;
  if (quest.category && quest.question && quest.answer && quest.wrong1 && quest.wrong2) {
    payload.category = quest.category;
    payload.question = quest.question;
    payload.right_answer = quest.answer;
    payload.wrong_answers = [ quest.wrong1, quest.wrong2, quest.wrong3 ]
    console.log(payload);
    Quest.create(payload);
    return res.redirect('/');
  }
})


module.exports = router;
