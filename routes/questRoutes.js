const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const Quest = require('../models/questSchema');
const Veto = require('../models/vetoSchema');

app.use(bodyParser.urlencoded({ extended: false }));

//: Zufallsfrage - multiple.pug
router.get('/', async (req, res) => {
  console.log(req.body);
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
    Quest.create(payload);
    return res.redirect('/quest/create');
  }
})

//: Editieren - edit.pug
router.get('/edit/:id', async (req, res) => {
  const quest = await Quest.findById(req.params.id);
  res.render('edit', quest);
})

router.put('/edit/:id', async (req, res) => {
  let quest = await Quest.findById(req.params.id);
  quest.category = req.body.category;
  quest.question = req.body.question;
  quest.right_answer = req.body.answer;
  quest.wrong_answers = [req.body.wrong1, req.body.wrong2, req.body.wrong3];
  quest.veto = [];
  try {
    await Veto.findOneAndDelete({ quest_id: quest._id });
    quest = await quest.save();
    return res.redirect("/quest");
  } 
  catch (err) {
    console.log(err);
    res.redirect(`/quest/edit/${req.params.id}`)
  }

})

//: Löschen - edit.pug
router.delete('/edit/:id', (req, res) => {
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
  const data = {
    author: req.session.user._id,
    quest_author: quest.author,
    question: quest.question,
    quest_id: quest._id,
    new_answer: req.body.correct,
    old_answer: quest.right_answer,
    comment: req.body.comment
  };
  Veto.create(data);
  res.redirect('/quest');
})

router.get('/vetos', async (req, res) => {
  const vetos = await Veto.find({ quest_author: req.session.user._id });
  res.render('allVetos', { vetos: vetos } );
})

router.get('/vetoDetails/:id', async (req, res) => {
  const veto = await Veto.findById(req.params.id);
  console.log(veto);
  res.render('vetoDetails', veto);
})

//: Alle Fragen, Kategorien

router.get('/show/:cat', async (req, res) => {
  if (req.params.cat == 'Alles') {
    const allQuests = await Quest.find({});
    res.render('allQuests', { allQuests: allQuests, cat: req.params.cat, user_id: req.session.user._id });
  } else if (req.params.cat == 'Eigene') {
    const allQuests = await Quest.find({ author: req.session.user._id });
    res.render('allQuests', { allQuests: allQuests, cat: req.params.cat, user_id: req.session.user._id });
  } else {
    const allQuests = await Quest.find({ category: req.params.cat });
    res.render('allQuests', { allQuests: allQuests, cat: req.params.cat, user_id: req.session.user._id });
  }
})

router.get('/showDetails/:id', async (req, res) => {
  const details = await Quest.findById(req.params.id);
  console.log(details);
  res.render('showDetails', details);
})





router.put('/cat', async (req, res) => {
  const userId = req.session.user._id;
  console.log('req.body:', req.body);
  // await User.findOneAndUpdate(userId, { cat: req.params.cat });
})

module.exports = router;
