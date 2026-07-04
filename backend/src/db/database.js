const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../../database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    console.log('Connected to the SQLite database at:', dbPath);
    initializeDatabase();
  }
});

function initializeDatabase() {
  db.serialize(() => {
    // Create Users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL
      )
    `);

    // Create Menus table
    db.run(`
      CREATE TABLE IF NOT EXISTS menus (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        price INTEGER NOT NULL,
        image_url TEXT,
        bgm_title TEXT,
        bgm_artist TEXT,
        bgm_url TEXT
      )
    `, () => {
      // Seed Menus if empty
      db.get('SELECT COUNT(*) as count FROM menus', (err, row) => {
        if (!err && row.count === 0) {
          const insertStmt = db.prepare(`
            INSERT INTO menus (name, description, price, image_url, bgm_title, bgm_artist, bgm_url)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `);

          // Salt Bread (소금빵)
          insertStmt.run(
            '소금빵',
            '겉은 바삭하고 속은 촉촉하며 버터의 풍미와 짭조름한 소금이 어우러진 시그니처 메뉴',
            3200,
            'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600&auto=format&fit=crop',
            '피아노 소나타 11번 (Piano Sonata No.11)',
            '모차르트 (Mozart)',
            'https://upload.wikimedia.org/wikipedia/commons/2/24/Mozart_-_Piano_Sonata_No._11_in_A_major%2C_K._331_-_I._Andante_grazioso.mp3'
          );

          // Strawberry Cake (조각 딸기케이크)
          insertStmt.run(
            '조각 딸기케이크',
            '신선한 생딸기와 부드러운 마스카포네 크림이 겹겹이 샌드된 달콤한 케이크',
            7500,
            'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=600&auto=format&fit=crop',
            '미뉴에트 G장조 (Minuet in G major)',
            '바흐 (Bach)',
            'https://upload.wikimedia.org/wikipedia/commons/d/d5/Bach_-_Minuet_in_G_major%2C_BWV_Anh._114.mp3'
          );

          // Red Bean Bread (단팥빵)
          insertStmt.run(
            '단팥빵',
            '국산 팥으로 직접 끓여 달지 않고 담백한 앙금이 가득 찬 전통 단팥빵',
            2500,
            'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=600&auto=format&fit=crop',
            "사계 중 '봄' (The Four Seasons - Spring)",
            '비발디 (Vivaldi)',
            'https://upload.wikimedia.org/wikipedia/commons/5/52/01_-_Vivaldi_Spring_mvt_1_Allegro_-_John_Harrison_with_Wichita_State_University_Chamber_Players.mp3'
          );

          insertStmt.finalize();
          console.log('Seed data inserted successfully for menus');
        }
      });
    });

    // Create Reservations table
    db.run(`
      CREATE TABLE IF NOT EXISTS reservations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        items TEXT NOT NULL,
        total_price INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // Create Reviews table
    db.run(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        username TEXT NOT NULL,
        rating INTEGER NOT NULL,
        comment TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `, () => {
      // Add a couple of initial test reviews if empty
      db.get('SELECT COUNT(*) as count FROM reviews', (err, row) => {
        if (!err && row.count === 0) {
          const insertStmt = db.prepare(`
            INSERT INTO reviews (user_id, username, rating, comment, created_at)
            VALUES (?, ?, ?, ?, ?)
          `);
          insertStmt.run(1, '초코러버', 5, '소금빵 먹으면서 모차르트 들으니까 마음이 정말 편안해지네요! 빵도 엄청 맛있어요.', new Date().toISOString());
          insertStmt.run(2, '빵지순례', 4, '조각 딸기케이크에 바흐 미뉴에트는 최고의 조합입니다. 매장 인테리어도 너무 예쁠 것 같아요.', new Date().toISOString());
          insertStmt.finalize();
          console.log('Seed data inserted successfully for reviews');
        }
      });
    });
  });
}

module.exports = db;
