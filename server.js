const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const Question = require('./models/Question');

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


// Password check route
app.post('/check-password', (req, res) => {
  const { password } = req.body;
  const correctPassword = process.env.APP_PASSWORD;
  res.json({ success: password === correctPassword });
});

// Add new question
app.post('/add', async (req, res) => {
  const { question, doneDate } = req.body;
  const q = new Question({ question, doneDate });
  await q.save();
  res.sendStatus(200);
});

// Get all questions
app.get('/questions', async (req, res) => {
  const data = await Question.find();
  res.json(data);
});

// Mark a review as completed
app.post('/mark', async (req, res) => {
  const { id, day } = req.body;
  await Question.updateOne({ _id: id }, { $set: { [`status.${day}`]: true } });
  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log("✅ Server running at http://localhost:3000");
});
