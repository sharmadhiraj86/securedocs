require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Expose public installer download for the receiver
app.use('/downloads', express.static(path.join(__dirname, 'public', 'downloads')));

// Expose public React Landing Page and Admin App
app.use(express.static(path.join(__dirname, '../admin-web/dist')));

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'dhiraj86@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Ro@45';
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader === `Bearer ${ADMIN_PASSWORD}`) next();
  else res.status(401).json({ error: 'Unauthorized' });
};

// Login Route
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    res.json({ success: true });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Dual Database Adapter (Cloud MongoDB vs Local SQLite)
let dbAdapter = {};

if (process.env.MONGODB_URI) {
  const mongoose = require('mongoose');
  mongoose.connect(process.env.MONGODB_URI).then(() => console.log('Connected to Cloud MongoDB'));
  
  const docSchema = new mongoose.Schema({ id: String, title: String, content: String });
  const Document = mongoose.model('Document', docSchema);
  
  dbAdapter = {
    create: async (id, title, content) => await Document.create({ id, title, content }),
    get: async (id) => await Document.findOne({ id }),
    updateTitle: async (id, title) => await Document.updateOne({ id }, { title }),
    updateContent: async (id, content) => await Document.updateOne({ id }, { content }),
    list: async () => await Document.find({}, 'id title').sort({ _id: -1 }),
    delete: async (id) => await Document.deleteOne({ id })
  };
} else {
  const db = require('./db');
  console.log('Using Local SQLite Database');
  dbAdapter = {
    create: (id, title, content) => new Promise((res, rej) => db.run('INSERT INTO documents (id, title, content) VALUES (?, ?, ?)', [id, title, content], err => err ? rej(err) : res())),
    get: (id) => new Promise((res, rej) => db.get('SELECT * FROM documents WHERE id = ?', [id], (err, row) => err ? rej(err) : res(row))),
    updateTitle: (id, title) => new Promise((res, rej) => db.run('UPDATE documents SET title = ? WHERE id = ?', [title, id], err => err ? rej(err) : res())),
    updateContent: (id, content) => new Promise((res, rej) => db.run('UPDATE documents SET content = ? WHERE id = ?', [content, id], err => err ? rej(err) : res())),
    list: () => new Promise((res, rej) => db.all('SELECT id, title FROM documents ORDER BY rowid DESC', [], (err, rows) => err ? rej(err) : res(rows))),
    delete: (id) => new Promise((res, rej) => db.run('DELETE FROM documents WHERE id = ?', [id], err => err ? rej(err) : res()))
  };
}

// Routes
app.post('/api/documents', authMiddleware, async (req, res) => {
  const id = Math.random().toString(36).substring(2, 10);
  const title = req.body.title || 'Untitled Document';
  try {
    await dbAdapter.create(id, title, '');
    res.json({ id, title, content: '' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/documents/:id', authMiddleware, async (req, res) => {
  try {
    await dbAdapter.updateTitle(req.params.id, req.body.title);
    res.json({ id: req.params.id, title: req.body.title });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/documents', authMiddleware, async (req, res) => {
  try {
    const list = await dbAdapter.list();
    res.json(list);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/documents/:id', authMiddleware, async (req, res) => {
  try {
    await dbAdapter.delete(req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/documents/:id', async (req, res) => {
  try {
    const doc = await dbAdapter.get(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Document not found' });
    res.json(doc);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// React Catch-All Route (must be below all API routes)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../admin-web/dist/index.html'));
});

io.on('connection', (socket) => {
  socket.on('join-document', (id) => socket.join(id));
  socket.on('edit-document', async ({ documentId, content, password }) => {
    if (password !== ADMIN_PASSWORD) return;
    try {
      await dbAdapter.updateContent(documentId, content);
      socket.to(documentId).emit('document-updated', { content });
    } catch (err) { console.error(err); }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
