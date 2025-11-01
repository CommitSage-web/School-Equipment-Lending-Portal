const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const dbDir = path.join(__dirname, 'data');
const dbFile = path.join(dbDir, 'app.db');
const migrationFile = path.join(__dirname, 'migrations', 'create_tables.sql');

if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
const db = new sqlite3.Database(dbFile);
const sql = fs.readFileSync(migrationFile, 'utf8');
db.exec(sql, (err) => {
  if (err) throw err;
  console.log('Tables created.');
  db.serialize(() => {
    db.run("INSERT INTO users (username,password,name,role) VALUES ('admin','admin123','Admin','admin'),('student','student123','Student','student');");
    db.run("INSERT INTO equipment (name,category,condition,quantity,available,description) VALUES ('Camera','Electronics','Good',3,3,'Canon DSLR'),('Microscope','Lab','Excellent',5,5,'Optical microscope');");
  });
  console.log('Sample data inserted.');
});
