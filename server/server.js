const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = new sqlite3.Database(path.join(__dirname, 'data', 'app.db'));

// Auth simple
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM users WHERE username=? AND password=?', [username, password], (err, row) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    if (!row) return res.status(401).json({ error: 'Invalid credentials' });
    res.json({ user: { id: row.id, username: row.username, name: row.name, role: row.role } });
  });
});

// Equipment
app.get('/api/equipment', (req, res) => {
  db.all('SELECT * FROM equipment', (err, rows) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json(rows);
  });
});

// Requests
app.post('/api/requests', (req, res) => {
  const { user_id, equipment_id, quantity } = req.body;
  db.run('INSERT INTO requests (user_id,equipment_id,quantity) VALUES (?,?,?)', [user_id, equipment_id, quantity], function(err){
    if (err) return res.status(500).json({ error: 'Insert error' });
    res.json({ id: this.lastID });
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log('Server running on port', PORT));
