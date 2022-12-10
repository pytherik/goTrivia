const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const Quest = require('../models/questSchema');
const Veto = require('../models/vetoSchema');

app.use(bodyParser.urlencoded({ extended: false }));

//: Zufallsfrage - multiple.pug
router.get('/', async (req, res) => {
  const user = req.session.user;
  const questions = await Quest.find({}).lean();
  const num = Math.floor(Math.random() * questions.length);
  const randomQuest = questions[num];
  return res.render('multiple', { user, randomQuest });
})

//: Frage erstellen - create.pug
router.get('/create', (req, res) => {
  const message = { message: 'Erstelle eine neue Frage!'}
  return res.render('create', message);
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

//: Editieren - edit.pug
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

//: Löschen - edit.pug
router.delete('/edit/:id', (req, res) => {
  console.log(req.params.id);
  Quest.findByIdAndDelete(req.params.id)
    .then(() => res.redirect('/'))
    .catch((err) => console.log(err))
})

//: Veto - veto.pug
router.get('/veto/:id', async (req, res) => {
  const quest = await Quest.findById(req.params.id);
  const payload = { message: quest.question, current: quest.right_answer, id: req.params.id };
  res.render('veto', payload)
})

router.post('/veto/:id', async (req, res) => {
  const quest = await Quest.findByIdAndUpdate(req.params.id, { $addToSet: { veto: req.session.user._id } }, {new: true} );
  console.log(quest);
  const data = {
    author: req.session.user._id,
    quest_author: quest.author,
    question: quest.question,
    new_answer: req.body.correct,
    comment: req.body.comment
  };
  Veto.create(data);
  res.redirect('/quest');
})

module.exports = router;
