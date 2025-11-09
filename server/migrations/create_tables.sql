PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     username TEXT UNIQUE NOT NULL,
     password TEXT NOT NULL,
     name TEXT,
     role TEXT NOT NULL,
     roll_no TEXT,
     created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS equipment (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     name TEXT NOT NULL,
     category TEXT,
     condition TEXT,
     quantity INTEGER DEFAULT 1,
     available INTEGER DEFAULT 1,
     description TEXT,
     image TEXT,
     created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    equipment_id INTEGER NOT NULL,
    quantity INTEGER DEFAULT 1,
    borrow_from TEXT,
    borrow_to TEXT,
    notes TEXT,
    status TEXT DEFAULT 'pending',
    acted_by INTEGER,
    acted_at TEXT,
    returned_at TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(equipment_id) REFERENCES equipment(id)
);

CREATE TABLE IF NOT EXISTS contributors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    roll TEXT,
    contribution TEXT
);

CREATE TABLE IF NOT EXISTS repair_logs (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   equipment_id INTEGER,
   issue TEXT,
   diagnosis TEXT,
   actions_taken TEXT,
   cost REAL,
   repaired_by TEXT,
   created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS request_history (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   request_id INTEGER,
   action TEXT,
   by_user TEXT,
   note TEXT,
   timestamp TEXT DEFAULT CURRENT_TIMESTAMP
);
