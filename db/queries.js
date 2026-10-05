const pool = require('./pool');

/*-------------------------- Messages ---------------------------*/

exports.getAllMessages = async function getAllMessages() {
    const { rows } = await pool.query('SELECT * FROM messages;');

    return rows;
};

exports.messageCreatePost = async function messageCreatePost(body, userId) {
    await pool.query(`
        INSERT INTO messages (body, date, user_id)
            VALUES
                ($1, $2, $3);
    `, [body, new Date(Date.now()).toString(), userId]);
};

/*-------------------------- Users ------------------------------*/

exports.userCreate = async function userCreate(firstName, lastName, username, hash, salt) {
    await pool.query(`
        INSERT INTO users (firstname, lastname, username, hashedpassword, salt, isAdmin, member)
            VALUES
                ($1, $2, $3, $4, $5, FALSE, FALSE);
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

exports.getAllUsers = async function getAllUsers() {
    const { rows } = await pool.query('SELECT * FROM users;');

    return rows;
};

exports.updateUser = async function updateUser(userId, value) {
    await pool.query('UPDATE users SET isadmin = $1 WHERE id=$2', [value, userId]);
};