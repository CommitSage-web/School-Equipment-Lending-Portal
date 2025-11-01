// server/init_db.js
const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const dbDir = path.join(__dirname, 'data');
const dbFile = path.join(dbDir, 'app.db');
const migrationFile = path.join(__dirname, 'migrations', 'create_tables.sql');

if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

const db = new sqlite3.Database(dbFile);
const sql = fs.readFileSync(migrationFile, 'utf8');

db.exec(sql, async (err) => {
  if (err) {
    console.error('Migration error:', err);
    process.exit(1);
  }

  db.get("SELECT COUNT(*) as c FROM users", async (e, row) => {
    if (e) { console.error(e); db.close(); return; }
    if (row.c === 0) {
      console.log('Seeding sample data with hashed passwords...');

      const hash = (p) => bcrypt.hashSync(p, 10);

      db.serialize(() => {
        db.run("INSERT INTO users (username,password,name,role,roll_no) VALUES ('admin', ?, 'Admin User', 'admin', '')", [hash('admin123')]);
        db.run("INSERT INTO users (username,password,name,role,roll_no) VALUES ('staff', ?, 'Staff User', 'staff', '')", [hash('staff123')]);
        db.run("INSERT INTO users (username,password,name,role,roll_no) VALUES ('student1', ?, 'Student One', 'student', 'S101')", [hash('student123')]);
        db.run("INSERT INTO users (username,password,name,role,roll_no) VALUES ('student2', ?, 'Student Two', 'student', 'S102')", [hash('student123')]);

        db.run("INSERT INTO equipment (name,category,condition,quantity,available,description) VALUES ('Digital Camera','Electronics','Good',3,3,'Canon DSLR')");
        db.run("INSERT INTO equipment (name,category,condition,quantity,available,description) VALUES ('Microscope','Lab','Excellent',5,5,'Optical microscope')");

        db.run("INSERT INTO contributors (name,roll,contribution) VALUES ('Member A','R001','UI/UX & Design')");
        db.run("INSERT INTO contributors (name,roll,contribution) VALUES ('Member B','R002','Auth & Backend')");
        db.run("INSERT INTO contributors (name,roll,contribution) VALUES ('Member C','R003','Equipment & Requests')");
        db.run("INSERT INTO contributors (name,roll,contribution) VALUES ('Member D','R004','Docs & README')");

        console.log('Database initialized with hashed passwords ✅');
        db.close();
      });
    } else {
      console.log('DB already seeded.');
      db.close();
    }
  });
});
