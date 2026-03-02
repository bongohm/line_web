const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// -----------------------------------------------------------------------------
// MongoDB setup
// -----------------------------------------------------------------------------
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/lineweb';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('Mongo connection error:', err);
    process.exit(1);
  });

// simple note schema: each record belongs to a category/subgroup
const noteSchema = new mongoose.Schema({
  cat: { type: String, required: true },
  sub: { type: String, default: '' },
  note: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
const Note = mongoose.model('Note', noteSchema);

// -----------------------------------------------------------------------------
// static files
// -----------------------------------------------------------------------------
app.use(express.static(path.join(__dirname)));

// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------
app.get('/api/dashboard', async (req, res) => {
  try {
    const docs = await Note.find({}).lean();
    // restructure into { cat: { sub: [notes...] } }
    const result = {};
    docs.forEach(d => {
      result[d.cat] = result[d.cat] || {};
      const key = d.sub || 'ทั่วไป';
      result[d.cat][key] = result[d.cat][key] || [];
      result[d.cat][key].push(d.note);
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/dashboard', async (req, res) => {
  const { cat, sub, note } = req.body;
  if (!cat || !note) {
    return res.status(400).json({ error: 'cat and note are required' });
  }

  try {
    await Note.create({ cat, sub: sub || '', note });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// catchall to serve the frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'EliteHub.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
