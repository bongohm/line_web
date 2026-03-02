const express = require('express');
const path = require('path');
const fs = require('fs').promises;

const app = express();
app.use(express.json());

// path to the JSON data store (application-specific rather than the original codes file)
const APP_DATA_FILE = path.join(__dirname, 'app_data.json');

async function readAppData() {
  try {
    const txt = await fs.readFile(APP_DATA_FILE, 'utf8');
    return JSON.parse(txt || '{}');
  } catch (e) {
    if (e.code === 'ENOENT') {
      await fs.writeFile(APP_DATA_FILE, '{}', 'utf8');
      return {};
    }
    throw e;
  }
}

async function writeAppData(obj) {
  await fs.writeFile(APP_DATA_FILE, JSON.stringify(obj, null, 2), 'utf8');
}

// serve static files from root (including EliteHub.html)
app.use(express.static(path.join(__dirname)));

// simple REST API
app.get('/api/dashboard', async (req, res) => {
  try {
    const data = await readAppData();
    res.json(data);
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
    const data = await readAppData();
    if (!data[cat]) data[cat] = {};
    if (!data[cat][sub]) data[cat][sub] = [];
    data[cat][sub].push(note);
    await writeAppData(data);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// fallback to serve EliteHub.html for all other routes (SPA style)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'EliteHub.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
