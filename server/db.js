// server/db.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbFile = path.join(__dirname, 'data', 'app.db');

const db = new sqlite3.Database(dbFile);

function run(sql, params=[]) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err){
            if(err) reject(err); else resolve(this);
        });
    });
}
function all(sql, params=[]){
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows));
    });
}
function get(sql, params=[]){
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => err ? reject(err) : resolve(row));
    });
}

module.exports = {
    run, all, get,
    // users
    getUserByUsername: async (username) => get('SELECT * FROM users WHERE username = ?', [username]),
    createUser: async (u) => {
        const res = await run('INSERT INTO users (username,password,name,role,roll_no) VALUES (?,?,?,?,?)',
            [u.username, u.password, u.name||'', u.role || 'student', u.roll_no || '']);
        return { id: res.lastID, ...u };
    },

    // equipment
    getAllEquipment: async () => all('SELECT * FROM equipment'),
    getEquipmentById: async (id) => get('SELECT * FROM equipment WHERE id = ?', [id]),
    createEquipment: async (e) => {
        const r = await run('INSERT INTO equipment (name, category, condition, quantity, available, description) VALUES (?, ?, ?, ?, ?, ?)',
            [e.name, e.category, e.condition || 'Good', e.quantity || 1, e.quantity || 1, e.description || '']);
        return { id: r.lastID, ...e };
    },
    updateEquipment: async (id, data) => {
        const item = await get('SELECT * FROM equipment WHERE id = ?', [id]);
        if(!item) throw new Error('Not found');
        const name = data.name || item.name;
        const category = data.category || item.category;
        const condition = data.condition || item.condition;
        const quantity = data.quantity !== undefined ? data.quantity : item.quantity;
        const available = data.available !== undefined ? data.available : item.available;
        const description = data.description || item.description;
        await run('UPDATE equipment SET name=?, category=?, condition=?, quantity=?, available=?, description=? WHERE id=?',
            [name, category, condition, quantity, available, description, id]);
        return await get('SELECT * FROM equipment WHERE id = ?', [id]);
    },
    deleteEquipment: async (id) => run('DELETE FROM equipment WHERE id = ?', [id]),

    // requests
    createRequest: async (r) => {
        const res = await run('INSERT INTO requests (user_id, equipment_id, quantity, borrow_from, borrow_to, notes, status, created_at) VALUES (?, ?, ?, ?, ?, ?, "pending", datetime("now"))',
            [r.user_id, r.equipment_id, r.quantity, r.borrow_from, r.borrow_to, r.notes || '']);
        return res.lastID;
    },
    getAllRequests: async () => all('SELECT r.*, u.username as username, u.name as user_name, e.name as equipment_name FROM requests r JOIN users u ON r.user_id=u.id JOIN equipment e ON r.equipment_id=e.id ORDER BY r.created_at DESC'),
    getRequestsByUser: async (uid) => all('SELECT r.*, e.name as equipment_name FROM requests r JOIN equipment e ON r.equipment_id=e.id WHERE r.user_id=? ORDER BY r.created_at DESC', [uid]),
    updateRequestStatus: async (id, status, acted_by) => {
        await run('UPDATE requests SET status=?, acted_by=?, acted_at=datetime("now") WHERE id=?', [status, acted_by, id]);
        const req = await get('SELECT * FROM requests WHERE id = ?', [id]);
        if(status === 'approved'){
            await run('UPDATE equipment SET available = available - ? WHERE id = ?', [req.quantity, req.equipment_id]);
        } else if(status === 'returned'){
            await run('UPDATE equipment SET available = available + ? WHERE id = ?', [req.quantity, req.equipment_id]);
        }
        return await get('SELECT * FROM requests WHERE id = ?', [id]);
    },

    // contributors
    getContributors: async () => all('SELECT * FROM contributors'),
    updateContributors: async (list) => {
        await run('DELETE FROM contributors');
        for(const c of list){
            await run('INSERT INTO contributors (name, roll, contribution) VALUES (?, ?, ?)', [c.name, c.roll, c.contribution]);
        }
        return await all('SELECT * FROM contributors');
    }
};
