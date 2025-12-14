import Database from 'better-sqlite3';
import path from 'path';

const dbPath = process.env.NODE_ENV === 'test' 
  ? ':memory:' 
  : path.join(__dirname, '../../sweet_shop.db');

export const db = new Database(dbPath);

export const initDatabase = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'USER',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS sweets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price REAL NOT NULL,
      stock INTEGER NOT NULL DEFAULT 0,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS purchases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      sweet_id INTEGER NOT NULL,
      quantity INTEGER DEFAULT 1,
      purchase_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (sweet_id) REFERENCES sweets(id)
    );
  `);
};

export const clearDatabase = () => {
  db.exec(`
    DELETE FROM purchases;
    DELETE FROM sweets;
    DELETE FROM users;
  `);
};