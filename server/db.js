import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, 'library.db');

let db = null;

export async function initDB() {
  const SQL = await initSqlJs();
  if (fs.existsSync(DB_PATH)) {
    const buffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }
  db.run('PRAGMA journal_mode=MEMORY');
  return db;
}

export function saveDB() {
  if (!db) return;
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_PATH, buffer);
}

export function getDB() {
  if (!db) throw new Error('Database not initialized');
  return db;
}

export function run(sql, params = []) {
  const stmt = getDB().prepare(sql);
  if (sql.trim().toUpperCase().startsWith('SELECT') || sql.trim().toUpperCase().startsWith('WITH')) {
    const rows = [];
    stmt.bind(params);
    while (stmt.step()) {
      rows.push(stmt.getAsObject());
    }
    stmt.free();
    return rows;
  }
  stmt.run(params);
  stmt.free();
  saveDB();
  return { changes: getDB().getRowsModified() };
}

export function get(sql, params = []) {
  const rows = run(sql, params);
  return rows[0] || null;
}

export function all(sql, params = []) {
  return run(sql, params);
}
