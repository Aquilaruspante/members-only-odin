const pool = require('./pool');

/*-------------------------- Messages ---------------------------*/

exports.getAllMessages = async function getAllMessages() {
    const { rows } = await pool.query('SELECT * FROM messages;');

    return rows;
};

/*-------------------------- Users ------------------------------*/

exports.userCreate = async function userCreate(firstName, lastName, username, hash, salt) {
    console.log(firstName, lastName, username, hash, salt);
    await pool.query(`
        INSERT INTO users (firstname, lastname, username, hashedpassword, salt)
            VALUES
                ($1, $2, $3, $4, $5);
    `, [firstName, lastName, username, hash, salt]);
};