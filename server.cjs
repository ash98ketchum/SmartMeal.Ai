// server.cjs
const express = require('express');
const fs      = require('fs');
const path    = require('path');
const cors    = require('cors');

const app = express();
const PORT = 4000;

const TODAY_PATH    = path.join(__dirname, 'todaysserving.json');
const MODEL_PATH    = path.join(__dirname, 'dataformodel.json');  // renamed to dataformodel.json

app.use(cors());
app.use(express.json());

function readToday() {
  if (!fs.existsSync(TODAY_PATH)) fs.writeFileSync(TODAY_PATH, '[]');
  return JSON.parse(fs.readFileSync(TODAY_PATH));
}
function writeToday(data) {
  fs.writeFileSync(TODAY_PATH, JSON.stringify(data, null, 2));
}
function readModelData() {
  if (!fs.existsSync(MODEL_PATH)) fs.writeFileSync(MODEL_PATH, '[]');
  return JSON.parse(fs.readFileSync(MODEL_PATH));
}
function writeModelData(data) {
  fs.writeFileSync(MODEL_PATH, JSON.stringify(data, null, 2));
}

// --- CRUD for today’s servings ---
app.get('/api/servings', (req, res) => {
  res.json(readToday());
});
app.post('/api/servings', (req, res) => {
  const today = readToday();
  today.push(req.body);
  writeToday(today);
  res.json({ message: 'Added' });
});
app.delete('/api/servings/:name', (req, res) => {
  const today = readToday().filter(s => s.name !== req.params.name);
  writeToday(today);
  res.json({ message: 'Deleted' });
});

// --- Archive without clearing live data ---
app.post('/api/archive', (req, res) => {
  const todaysData = readToday();
  const dateStamp  = new Date().toISOString().split('T')[0];
  const modelData  = readModelData();
  modelData.push({ date: dateStamp, items: todaysData });
  writeModelData(modelData);
  console.log(`📦 Archived ${todaysData.length} items on ${dateStamp}`);
  res.json({ message: 'Archived for model training' });
});

// --- Midnight reset (clears today’s file) ---
app.post('/api/reset', (_req, res) => {
  writeToday([]);
  console.log(`🔄 Cleared todaysserving.json at midnight.`);
  res.json({ message: 'Today’s data cleared' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
