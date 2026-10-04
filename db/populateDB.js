const pg = require('pg');
const crypto = require('node:crypto');

const saltOne = crypto.randomBytes(32).toString('hex');
const hashOne = crypto.pbkdf2Sync(process.env.PASSWORD_ONE, saltOne, 10000, 64, 'sha512').toString('hex');

const saltTwo = crypto.randomBytes(32).toString('hex');
const hashTwo = crypto.pbkdf2Sync(process.env.PASSWORD_TWO, saltTwo, 10000, 64, 'sha512').toString('hex');

const saltThree = crypto.randomBytes(32).toString('hex');
const hashThree = crypto.pbkdf2Sync(process.env.PASSWORD_THREE, saltThree, 10000, 64, 'sha512').toString('hex');

const SQL = `
    DROP TABLE messages;
    DROP TABLE users;

    CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        firstname VARCHAR (255) NOT NULL CHECK (TRIM(firstname) <> ''),
        lastname VARCHAR (255) NOT NULL CHECK (TRIM(lastname) <> ''),
        username VARCHAR (255) NOT NULL UNIQUE CHECK (TRIM(username) <> ''),
        hashedpassword VARCHAR (255) NOT NULL,
        salt VARCHAR (255) NOT NULL,
        isAdmin BOOLEAN NOT NULL,
        member BOOLEAN NOT NULL
    );

    INSERT INTO users (firstname, lastname, username, hashedpassword, salt, isAdmin, member)
        VALUES
            ('John', 'Doe', 'JohnnyD', '${hashOne}', '${saltOne}', FALSE, TRUE),
            ('Joao', 'Pereira', 'Jper', '${hashTwo}', '${saltTwo}', FALSE, TRUE),
            ('Calogero', 'Salvaggio', 'Aquilaruspante', '${hashThree}', '${saltThree}', TRUE, TRUE);


    CREATE TABLE IF NOT EXISTS messages (
        id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        body VARCHAR (255) NOT NULL,
        date VARCHAR (255),
        user_id INT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
    );

    INSERT INTO messages (body, date, user_id)
        VALUES
            ('Hi guys', '${new Date(Date.now()).toString()}', 1),
            ('We are the inner circle', '${new Date(Date.now()).toString()}', 2);
`;

async function main() {
    console.log('seeding...');
    try{
        const client = new pg.Client({
        connectionString: process.env.CONNECTION_STRING
        });

        await client.connect();
        await client.query(SQL);
        await client.end();
        console.log('Database seeded')
    } catch (err) {
        console.log('Seed failed!');
        console.log(err);
    };
};

main();