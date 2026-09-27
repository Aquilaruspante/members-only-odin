const pool = require('./pool');

/*-------------------------- Messages ---------------------------*/

exports.getAllMessages = async function getAllMessages() {
    const { rows } = await pool.query('SELECT * FROM messages;');

    return rows;
};

/*-------------------------- Users ------------------------------*/

exports.userCreate = async function userCreate(firstName, lastName, username, hash, salt) {
    await pool.query(`
        INSERT INTO users (firstname, lastname, username, hashedpassword, salt)
            VALUES
                ($1, $2, $3, $4, $5);
    `, [firstName, lastName, username, hash, salt]);
};

exports.userGetByUsername = async function userGetByUsername(username) {
    const { rows } = await pool.query('SELECT * FROM users WHERE username=$1', [username]);

    return rows[0];
};

exports.userGetById = async function userGetById(id) {
    const { rows } = await pool.query('SELECT * FROM users WHERE id=$1', [id]);

    return rows[0];
};