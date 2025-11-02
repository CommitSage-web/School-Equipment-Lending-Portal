// server/server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const db = require('./db');
const path = require('path');

const SECRET = 'dev-secret-token-change-this';

const app = express();
app.use(cors());
app.use(bodyParser.json());

// create JWT
// LOGIN with bcrypt password comparison
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  if(!username || !password) return res.status(400).json({ error: 'Username and password required' });
  try {
    const user = await db.getUserByUsername(username);
    if(!user) return res.status(401).json({ error: 'Invalid credentials' });
    // compare bcrypt hash
    const bcrypt = require('bcryptjs');
    const match = bcrypt.compareSync(password, user.password);
    if(!match) return res.status(401).json({ error: 'Invalid credentials' });

    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role, name: user.name }, SECRET, { expiresIn: '8h' });
    return res.json({ token, user: { id: user.id, username: user.username, role: user.role, name: user.name }});
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// auth middleware: verifies token and attaches payload to req.user
function auth(requiredRole){ // requiredRole optional: 'admin' or 'staff' etc
  return (req, res, next) => {
    const header = req.headers['authorization'];
    if(!header) return res.status(401).json({ error: 'Missing authorization header' });
    const token = header.replace('Bearer ', '');
    try{
      const payload = jwt.verify(token, SECRET);
      req.user = payload;
      if(requiredRole){
        if(Array.isArray(requiredRole)){
          if(!requiredRole.includes(payload.role)) return res.status(403).json({ error: 'Forbidden' });
        } else {
          if(payload.role !== requiredRole) return res.status(403).json({ error: 'Forbidden' });
        }
      }
      next();
    }catch(e){
      return res.status(401).json({ error: 'Invalid token' });
    }
  }
}

// Public equipment list
// SIGNUP endpoint — logs email to console instead of sending real mail
app.post('/api/auth/signup', async (req, res) => {
  const { name, username, password, role, roll_no } = req.body;
  if (!username || !password || !role)
    return res.status(400).json({ error: 'username, password and role required' });

  try {
    // Check if user exists
    const existing = await db.getUserByUsername(username);
    if (existing) return res.status(409).json({ error: 'User already exists' });

    // Hash password
    const bcrypt = require('bcryptjs');
    const hashed = bcrypt.hashSync(password, 10);

    // Insert user
    const created = await db.createUser({
      username,
      password: hashed,
      name,
      role,
      roll_no,
    });

    // Log the “email” in console (for demo)
    console.log(`
      --------------------------
      📧 Simulated Signup Email
      To: ${username}
      Subject: Your School Portal Account
      Message:
      Hello ${name || username},
      
      Your account for the School Equipment Portal has been created.
      
      Username: ${username}
      Password: ${password}
      Role: ${role}
      
      (Email sending is disabled in demo mode.)
      --------------------------
      `);

    res.json({
      success: true,
      user: { id: created.id, username, role, name },
      message: 'Account created. Check server console for email log.',
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/equipment', async (req, res) => {
  const items = await db.getAllEquipment();
  res.json(items);
});
app.get('/api/equipment/:id', async (req, res) => {
  const item = await db.getEquipmentById(Number(req.params.id));
  if(!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
});
// Admin-only equipment modifications
app.post('/api/equipment', auth('admin'), async (req, res) => {
  const inserted = await db.createEquipment(req.body);
  res.json(inserted);
});
app.put('/api/equipment/:id', auth('admin'), async (req, res) => {
  const updated = await db.updateEquipment(Number(req.params.id), req.body);
  res.json(updated);
});
app.delete('/api/equipment/:id', auth('admin'), async (req, res) => {
  await db.deleteEquipment(Number(req.params.id));
  res.json({ success: true });
});

// Requests: students create, staff/admin view & act
app.post('/api/requests', auth(), async (req, res) => {
  const { equipment_id, quantity, borrow_from, borrow_to, notes } = req.body;
  const id = await db.createRequest({ user_id: req.user.id, equipment_id, quantity, borrow_from, borrow_to, notes });
  res.json({ id });
});
app.get('/api/requests', auth(), async (req, res) => {
  if(req.user.role === 'admin' || req.user.role === 'staff'){
    const all = await db.getAllRequests();
    res.json(all);
  } else {
    const own = await db.getRequestsByUser(req.user.id);
    res.json(own);
  }
});
app.put('/api/requests/:id/approve', auth(['admin','staff']), async (req, res) => {
  const r = await db.updateRequestStatus(Number(req.params.id), 'approved', req.user.id);
  res.json(r);
});
app.put('/api/requests/:id/reject', auth(['admin','staff']), async (req, res) => {
  const r = await db.updateRequestStatus(Number(req.params.id), 'rejected', req.user.id);
  res.json(r);
});
app.put('/api/requests/:id/return', auth(), async (req, res) => {
  const r = await db.updateRequestStatus(Number(req.params.id), 'returned', req.user.id);
  res.json(r);
});

// Contributors
app.get('/api/contributors', async (req, res) => {
  const list = await db.getContributors();
  res.json(list);
});
app.put('/api/contributors', auth(['admin','staff']), async (req, res) => {
  const updated = await db.updateContributors(req.body || []);
  res.json(updated);
});

// Optionally serve frontend build (if you place build output into frontend/build)
app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log('Server listening on', PORT));
