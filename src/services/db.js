import * as SQLite from 'expo-sqlite';
import { formatDate } from '../utils/date';

let db;

async function getDb() {
  if (!db) {
    db = await SQLite.openDatabaseAsync('coe_attendance.db');
    await db.execAsync('PRAGMA foreign_keys = ON;');
  }
  return db;
}

export async function initDb() {
  const database = await getDb();
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS coes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      incharge TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS attendance (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      coe_id INTEGER NOT NULL REFERENCES coes(id) ON DELETE CASCADE,
      date TEXT NOT NULL,
      present_count INTEGER NOT NULL,
      image_uri TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(coe_id, date)
    );

    CREATE TABLE IF NOT EXISTS pdf_exports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      file_name TEXT NOT NULL,
      file_uri TEXT NOT NULL,
      export_date TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

export async function addCoe(name, incharge) {
  const database = await getDb();
  const result = await database.runAsync(
    'INSERT INTO coes (name, incharge) VALUES (?, ?)',
    [name.trim(), incharge.trim()]
  );
  return result.lastInsertRowId;
}

export async function getCoes() {
  const database = await getDb();
  return database.getAllAsync('SELECT * FROM coes ORDER BY name COLLATE NOCASE ASC');
}

export async function getCoeAttendanceForDate(date = formatDate()) {
  const database = await getDb();
  return database.getAllAsync(
    `SELECT
      coes.id,
      coes.name,
      coes.incharge,
      attendance.present_count,
      attendance.image_uri,
      attendance.date AS attendance_date
    FROM coes
    LEFT JOIN attendance
      ON attendance.coe_id = coes.id AND attendance.date = ?
    ORDER BY coes.name COLLATE NOCASE ASC`,
    [date]
  );
}

export async function getAttendance(coeId, date = formatDate()) {
  const database = await getDb();
  return database.getFirstAsync(
    'SELECT * FROM attendance WHERE coe_id = ? AND date = ?',
    [coeId, date]
  );
}

export async function upsertAttendance(coeId, date, presentCount, imageUri) {
  const database = await getDb();
  await database.runAsync(
    `INSERT INTO attendance (coe_id, date, present_count, image_uri)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(coe_id, date)
     DO UPDATE SET
       present_count = excluded.present_count,
       image_uri = excluded.image_uri,
       created_at = CURRENT_TIMESTAMP`,
    [coeId, date, presentCount, imageUri]
  );
}

export async function addPdfExport(fileName, fileUri, exportDate) {
  const database = await getDb();
  await database.runAsync(
    'INSERT INTO pdf_exports (file_name, file_uri, export_date) VALUES (?, ?, ?)',
    [fileName, fileUri, exportDate]
  );
}

export async function getPdfExports(sortOrder = 'desc') {
  const database = await getDb();
  const direction = sortOrder === 'asc' ? 'ASC' : 'DESC';
  return database.getAllAsync(
    `SELECT * FROM pdf_exports ORDER BY datetime(created_at) ${direction}, id ${direction}`
  );
}
