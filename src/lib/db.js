import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Create data directory if it doesn't exist
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'content.db');

// Initialize database
function initializeDatabase() {
  const db = new Database(dbPath);
  
  // Create table if it doesn't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS content (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      maleFirstName TEXT DEFAULT 'Ahmed',
      femaleFirstName TEXT DEFAULT 'Mai',
      tagline TEXT DEFAULT '',
      loveMessage TEXT DEFAULT '',
      images TEXT DEFAULT '[]',
      song TEXT DEFAULT '{}',
      songCover TEXT DEFAULT '{}',
      startDate TEXT DEFAULT '',
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);
  
  // Ensure we have exactly one row
  const count = db.prepare('SELECT COUNT(*) as count FROM content').get();
  if (count.count === 0) {
    db.prepare(`
      INSERT INTO content (
        id, maleFirstName, femaleFirstName, tagline, loveMessage, 
        images, song, songCover, startDate, createdAt, updatedAt
      ) VALUES (
        1, 'Ahmed', 'Mai', 
        'Our love story began with a glance and turned into a lifetime of longing.',
        'I love you more than words can express. You are my forever.',
        '[]', '{}', '{}', '2024-01-01', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      )
    `).run();
  }
  
  return db;
}

// Get database connection
export function getDb() {
  return new Database(dbPath);
}

// Get content
export function getContent() {
  const db = getDb();
  try {
    const row = db.prepare('SELECT * FROM content WHERE id = 1').get();
    
    if (!row) {
      return null;
    }
    
    // Parse JSON fields
    return {
      ...row,
      images: JSON.parse(row.images || '[]'),
      song: JSON.parse(row.song || '{}'),
      songCover: JSON.parse(row.songCover || '{}'),
    };
  } finally {
    db.close();
  }
}

// Update content
export function updateContent(data) {
  const db = getDb();
  try {
    const updates = [];
    const values = [];
    
    // Build dynamic update query
    if (data.maleFirstName !== undefined) {
      updates.push('maleFirstName = ?');
      values.push(data.maleFirstName);
    }
    if (data.femaleFirstName !== undefined) {
      updates.push('femaleFirstName = ?');
      values.push(data.femaleFirstName);
    }
    if (data.tagline !== undefined) {
      updates.push('tagline = ?');
      values.push(data.tagline);
    }
    if (data.loveMessage !== undefined) {
      updates.push('loveMessage = ?');
      values.push(data.loveMessage);
    }
    if (data.images !== undefined) {
      updates.push('images = ?');
      values.push(JSON.stringify(data.images));
    }
    if (data.song !== undefined) {
      updates.push('song = ?');
      values.push(JSON.stringify(data.song));
    }
    if (data.songCover !== undefined) {
      updates.push('songCover = ?');
      values.push(JSON.stringify(data.songCover));
    }
    if (data.startDate !== undefined) {
      updates.push('startDate = ?');
      values.push(data.startDate);
    }
    
    // Always update updatedAt
    updates.push('updatedAt = CURRENT_TIMESTAMP');
    
    // Add id to values for WHERE clause
    values.push(1);
    
    const query = `UPDATE content SET ${updates.join(', ')} WHERE id = ?`;
    const stmt = db.prepare(query);
    const result = stmt.run(...values);
    
    console.log('[updateContent] ✅ Updated:', {
      changes: result.changes,
      maleFirstName: data.maleFirstName,
      femaleFirstName: data.femaleFirstName,
    });
    
    return result;
  } finally {
    db.close();
  }
}

// Initialize database on module load
initializeDatabase();
