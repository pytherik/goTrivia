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
  res.send(randomQuest);
})

router.put('/score/:amount', async (req, res) => {
  const userId = req.session.user._id;
  req.session.user = await User.findByIdAndUpdate(userId, { $inc: { score: req.params.amount } });
  res.sendStatus(200);
})


module.exports = router;