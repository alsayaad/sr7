// Simple Node.js + Express backend for Sarh Places Directory
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const DATA_DIR = path.join(__dirname, 'data');
const PLACES_FILE = path.join(DATA_DIR, 'places.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
if (!fs.existsSync(PLACES_FILE)) fs.writeFileSync(PLACES_FILE, '[]');
if (!fs.existsSync(SETTINGS_FILE)) fs.writeFileSync(SETTINGS_FILE, '{}');

const readJSON = file => JSON.parse(fs.readFileSync(file));
const writeJSON = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2));

app.get('/api/places', (req, res) => {
  res.json(readJSON(PLACES_FILE));
});

app.post('/api/places', (req, res) => {
  const places = readJSON(PLACES_FILE);
  const newPlace = {
    id: Date.now(),
    name: req.body.name,
    category: req.body.category,
    phone: req.body.phone,
    lat: req.body.lat,
    lng: req.body.lng,
    distance: null
  };
  places.push(newPlace);
  writeJSON(PLACES_FILE, places);
  res.json({ success: true, place: newPlace });
});

app.delete('/api/places', (req, res) => {
  writeJSON(PLACES_FILE, []);
  res.json({ success: true });
});

app.get('/api/settings', (req, res) => {
  res.json(readJSON(SETTINGS_FILE));
});

app.post('/api/settings', (req, res) => {
  writeJSON(SETTINGS_FILE, req.body);
  res.json({ success: true });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
