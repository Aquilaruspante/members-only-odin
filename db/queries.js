const pg = require('pg');

const pool = new pg.Pool({
    connectionString: process.env.CONNECTION_STRING
});

exports.getAllMessages = async function getAllMessages() {
    const { rows } = await pool.query('SELECT * FROM messages;');

    return rows;
};