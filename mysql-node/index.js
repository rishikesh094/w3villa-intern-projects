const db = require('./db');

const user = { name: 'Ravi Kumar', email: 'ravi@example.com' };

const sql = 'INSERT INTO users SET ?';

db.query(sql, user, (err, result) => {
    if (err) throw err;
    console.log('Data inserted, ID:', result.insertId);
});
