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
    return res.redirect('/quest/create');
  }
})

router.get('/edit/:id', async (req, res) => {
  const quest = await Quest.findById(req.params.id);
  console.log(quest.question)
  res.render('edit', quest);
})

router.put('/edit/:id', async (req, res) => {
  let quest = await Quest.findById(req.params.id);
  quest.category = req.body.category;
  quest.question = req.body.question;
  quest.right_answer = req.body.answer;
  quest.wrong_answers = [req.body.wrong1, req.body.wrong2, req.body.wrong3];
  try {
    quest = await quest.save();
    console.log(quest);
    return res.redirect("/quest");
  } 
  catch (err) {
    console.log(err);
    res.redirect(`/quest/edit/${req.params.id}`)
  }

  console.log(quest);
})
module.exports = router;
