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

const ACCOUNTS = {
  [process.env.ADMIN_EMAIL || 'dhiraj86@gmail.com']: process.env.ADMIN_PASSWORD || 'Ro@45',
  'sonali21@gmail.com': 'Sd@21'
};

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const email = Object.keys(ACCOUNTS).find(k => ACCOUNTS[k] === token);
    if (email) {
      req.userEmail = email;
      return next();
    }
  }
  res.status(401).json({ error: 'Unauthorized' });
};

// Login Route
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (ACCOUNTS[email] && ACCOUNTS[email] === password) {
    res.json({ success: true });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Helper to verify user ownership of documents
const hasAccess = (docOwner, userEmail) => {
  const defaultAdmin = process.env.ADMIN_EMAIL || 'dhiraj86@gmail.com';
  return docOwner ? docOwner === userEmail : userEmail === defaultAdmin;
};

// Dual Database Adapter (Cloud MongoDB vs Local SQLite)
let dbAdapter = {};

if (process.env.MONGODB_URI) {
  const mongoose = require('mongoose');
  mongoose.connect(process.env.MONGODB_URI).then(() => console.log('Connected to Cloud MongoDB'));
  
  const docSchema = new mongoose.Schema({ 
    id: String, 
    title: String, 
    content: String, 
    owner: String, 
    fontSize: { type: Number, default: 18 } 
  });
  const Document = mongoose.model('Document', docSchema);
  
  dbAdapter = {
    create: async (id, title, content, owner) => await Document.create({ id, title, content, owner, fontSize: 18 }),
    get: async (id) => await Document.findOne({ id }),
    updateTitle: async (id, title) => await Document.updateOne({ id }, { title }),
    updateContent: async (id, content) => await Document.updateOne({ id }, { content }),
    updateFontSize: async (id, fontSize) => await Document.updateOne({ id }, { fontSize }),
    list: async (owner) => {
      const query = {
        $or: [
          { owner },
          ...(owner === (process.env.ADMIN_EMAIL || 'dhiraj86@gmail.com') ? [{ owner: null }, { owner: { $exists: false } }] : [])
        ]
      };
      return await Document.find(query, 'id title').sort({ _id: -1 });
    },
    delete: async (id) => await Document.deleteOne({ id })
  };
} else {
  const db = require('./db');
  console.log('Using Local SQLite Database');
  dbAdapter = {
    create: (id, title, content, owner) => new Promise((res, rej) => db.run('INSERT INTO documents (id, title, content, owner, font_size) VALUES (?, ?, ?, ?, 18)', [id, title, content, owner], err => err ? rej(err) : res())),
    get: (id) => new Promise((res, rej) => db.get('SELECT id, title, content, owner, font_size AS fontSize FROM documents WHERE id = ?', [id], (err, row) => err ? rej(err) : res(row))),
    updateTitle: (id, title) => new Promise((res, rej) => db.run('UPDATE documents SET title = ? WHERE id = ?', [title, id], err => err ? rej(err) : res())),
    updateContent: (id, content) => new Promise((res, rej) => db.run('UPDATE documents SET content = ? WHERE id = ?', [content, id], err => err ? rej(err) : res())),
    updateFontSize: (id, fontSize) => new Promise((res, rej) => db.run('UPDATE documents SET font_size = ? WHERE id = ?', [fontSize, id], err => err ? rej(err) : res())),
    list: (owner) => new Promise((res, rej) => db.all('SELECT id, title FROM documents WHERE owner = ? OR (owner IS NULL AND ? = ?) ORDER BY rowid DESC', [owner, owner, process.env.ADMIN_EMAIL || 'dhiraj86@gmail.com'], (err, rows) => err ? rej(err) : res(rows))),
    delete: (id) => new Promise((res, rej) => db.run('DELETE FROM documents WHERE id = ?', [id], err => err ? rej(err) : res()))
  };
}

// Routes
app.post('/api/documents', authMiddleware, async (req, res) => {
  const id = Math.random().toString(36).substring(2, 10);
  const title = req.body.title || 'Untitled Document';
  try {
    await dbAdapter.create(id, title, '', req.userEmail);
    res.json({ id, title, content: '' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/documents/:id', authMiddleware, async (req, res) => {
  try {
    const doc = await dbAdapter.get(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Document not found' });
    if (!hasAccess(doc.owner, req.userEmail)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    await dbAdapter.updateTitle(req.params.id, req.body.title);
    res.json({ id: req.params.id, title: req.body.title });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/documents', authMiddleware, async (req, res) => {
  try {
    const list = await dbAdapter.list(req.userEmail);
    res.json(list);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/documents/:id', authMiddleware, async (req, res) => {
  try {
    const doc = await dbAdapter.get(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Document not found' });
    if (!hasAccess(doc.owner, req.userEmail)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
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
  socket.on('edit-document', async ({ documentId, content, fontSize, password }) => {
    const email = Object.keys(ACCOUNTS).find(k => ACCOUNTS[k] === password);
    if (!email) return;
    try {
      const doc = await dbAdapter.get(documentId);
      if (!doc) return;
      if (!hasAccess(doc.owner, email)) return;
      
      const updates = {};
      if (content !== undefined) {
        await dbAdapter.updateContent(documentId, content);
        updates.content = content;
      }
      if (fontSize !== undefined) {
        await dbAdapter.updateFontSize(documentId, fontSize);
        updates.fontSize = fontSize;
      }
      socket.to(documentId).emit('document-updated', updates);
    } catch (err) { console.error(err); }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
