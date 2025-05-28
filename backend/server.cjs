// backend/server.cjs

const express  = require('express');
const fs       = require('fs');
const path     = require('path');
const cors     = require('cors');
const cron     = require('node-cron');
const { exec } = require('child_process');

const app = express();
const PORT = 4000;

// File paths
const TODAY_PATH        = path.join(__dirname, 'todaysserving.json');
const MODEL_DATA        = path.join(__dirname, 'dataformodel.json');
const EVENTS_PATH       = path.join(__dirname, 'events.json');
const PREDICTED_WEEKLY  = path.join(__dirname, 'predicted_weekly.json');
const PREDICTED_MONTHLY = path.join(__dirname, 'predicted_monthly.json');
const METRICS_WEEKLY    = path.join(__dirname, 'metrics_weekly.json');
const METRICS_MONTHLY   = path.join(__dirname, 'metrics_monthly.json');

app.use(cors());
app.use(express.json());

// Helpers
function readJson(filePath) {
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, '[]');
  return JSON.parse(fs.readFileSync(filePath));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Read a single summary object (or first element if array)
function readSummary(filePath) {
  const raw = readJson(filePath);
  if (Array.isArray(raw)) {
    return raw[0] || {};
  }
  return raw || {};
}

// Archive helper for dataformodel.json
function getSeries(period) {
  const raw = readJson(MODEL_DATA);
  raw.sort((a, b) => new Date(a.date) - new Date(b.date));
  const count = period === 'monthly' ? 30 : 7;
  return raw.slice(-count).map(day => ({
    date: day.date,
    // total actual servings per day
    actual: day.items.reduce((sum, s) => sum + (s.totalPlates || 0), 0),
    // total actual earnings per day
    actualEarning: parseFloat(
      day.items.reduce((sum, s) => sum + (s.totalEarning || 0), 0)
      .toFixed(2)
    )
  }));
}

// ─── CRUD Today's Servings ─────────────────────────────────────────
app.get('/api/servings', (_req, res) => {
  res.json(readJson(TODAY_PATH));
});

app.post('/api/servings', (req, res) => {
  const arr = readJson(TODAY_PATH);
  arr.push(req.body);
  writeJson(TODAY_PATH, arr);
  res.json({ message: 'Added' });
});

app.delete('/api/servings/:name', (req, res) => {
  const filtered = readJson(TODAY_PATH).filter(s => s.name !== req.params.name);
  writeJson(TODAY_PATH, filtered);
  res.json({ message: 'Deleted' });
});

// ─── Archive Endpoint ───────────────────────────────────────────────
app.post('/api/archive', (_req, res) => {
  const today = readJson(TODAY_PATH);
  const modelData = readJson(MODEL_DATA);
  const dateStamp = new Date().toISOString().split('T')[0];
  modelData.push({ date: dateStamp, items: today });
  writeJson(MODEL_DATA, modelData);
  res.json({ message: 'Archived' });
});

// ─── Reset Today's Servings ─────────────────────────────────────────
app.post('/api/reset', (_req, res) => {
  writeJson(TODAY_PATH, []);
  res.json({ message: 'Cleared' });
});

// ─── Chart Data: Actual ─────────────────────────────────────────────
app.get('/api/dataformodel/:period', (req, res) => {
  const p = req.params.period;
  if (!['weekly','monthly'].includes(p)) {
    return res.status(400).json({ error: 'Invalid period' });
  }
  res.json(getSeries(p));
});

// ─── Chart Data: Predicted ──────────────────────────────────────────
app.get('/api/predicted/:period', (req, res) => {
  const p = req.params.period;
  if (!['weekly','monthly'].includes(p)) {
    return res.status(400).json({ error: 'Invalid period' });
  }

  const modelData = readJson(MODEL_DATA);
  modelData.sort((a, b) => new Date(a.date) - new Date(b.date));
  const count = p === 'monthly' ? 30 : 7;
  const slice = modelData.slice(-count);

  const predictedSeries = slice.map(day => {
    const totalServings = day.items.reduce((sum, s) => sum + (s.totalPlates || 0), 0);
    const totalEarning  = parseFloat(
      day.items.reduce((sum, s) => sum + (s.totalEarning || 0), 0)
      .toFixed(2)
    );
    return {
      date: day.date,
      predicted: totalServings,
      predictedEarning: totalEarning
    };
  });

  res.json(predictedSeries);
});

// ─── Metrics Endpoints ──────────────────────────────────────────────
app.get('/api/metrics/weekly', (_req, res) => {
  const summary = readSummary(METRICS_WEEKLY);
  res.json(summary);
});

app.get('/api/metrics/monthly', (_req, res) => {
  const summary = readSummary(METRICS_MONTHLY);
  res.json(summary);
});

// ─── Events CRUD ───────────────────────────────────────────────────
app.get('/api/events', (_req, res) => {
  res.json(readJson(EVENTS_PATH));
});

app.post('/api/events', (req, res) => {
  const evts = readJson(EVENTS_PATH);
  evts.push(req.body);
  writeJson(EVENTS_PATH, evts);
  res.json({ message: 'Event added' });
});

app.delete('/api/events/:id', (req, res) => {
  const filtered = readJson(EVENTS_PATH).filter(e => e.id !== req.params.id);
  writeJson(EVENTS_PATH, filtered);
  res.json({ message: 'Event deleted' });
});

// ─── Recalibrate Model ─────────────────────────────────────────────
app.post('/api/recalibrate', (_req, res) => {
  exec('python train_model.py', (err, stdout) => {
    if (err) {
      return res.status(500).json({ message: 'Recalibration failed', error: err.message });
    }
    res.json({ message: 'Recalibration complete', output: stdout });
  });
});

// ─── Nightly Cron: archive & reset ─────────────────────────────────
cron.schedule('0 0 * * *', () => {
  const today = readJson(TODAY_PATH);
  const modelData = readJson(MODEL_DATA);
  const dateStamp = new Date().toISOString().split('T')[0];
  modelData.push({ date: dateStamp, items: today });
  writeJson(MODEL_DATA, modelData);
  writeJson(TODAY_PATH, []);
  exec('python train_model.py', err => {
    if (err) console.error('Cron recalibration failed', err);
  });
});

// ─── Serve Frontend ────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, '../frontend')));
app.get(/.*/, (_req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// ─── Start Server ─────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
