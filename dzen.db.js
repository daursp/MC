const path = require('node:path');
const fs = require('node:fs');
const { DatabaseSync } = require('node:sqlite');

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

const db = new DatabaseSync(path.join(dataDir, 'dzen.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS services (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    slug        TEXT    NOT NULL UNIQUE,
    title       TEXT    NOT NULL,
    category    TEXT    NOT NULL,
    short_desc  TEXT    NOT NULL,
    description TEXT    NOT NULL,
    price       INTEGER NOT NULL,
    duration    INTEGER NOT NULL,
    level       TEXT    NOT NULL,
    image       TEXT    DEFAULT ''
  );

  CREATE TABLE IF NOT EXISTS teachers (
    id    INTEGER PRIMARY KEY AUTOINCREMENT,
    name  TEXT NOT NULL,
    role  TEXT NOT NULL,
    bio   TEXT NOT NULL,
    image TEXT DEFAULT ''
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id     INTEGER PRIMARY KEY AUTOINCREMENT,
    author TEXT NOT NULL,
    text   TEXT NOT NULL,
    rating INTEGER NOT NULL DEFAULT 5
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    phone      TEXT NOT NULL,
    service_id INTEGER,
    comment    TEXT DEFAULT '',
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS faq (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT    NOT NULL,
    answer   TEXT    NOT NULL,
    sort     INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS plans (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    name     TEXT    NOT NULL,
    visits   INTEGER NOT NULL DEFAULT 1,
    price    INTEGER NOT NULL,
    note     TEXT    DEFAULT '',
    sort     INTEGER NOT NULL DEFAULT 0
  );
`);

module.exports = db;
