const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'documents.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      title TEXT,
      content TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      owner TEXT,
      font_size INTEGER DEFAULT 18
    )
  `);
  db.run(`ALTER TABLE documents ADD COLUMN owner TEXT`, (err) => {
    // Ignore error if column already exists
  });
  db.run(`ALTER TABLE documents ADD COLUMN font_size INTEGER DEFAULT 18`, (err) => {
    // Ignore error if column already exists
  });
});

module.exports = db;
