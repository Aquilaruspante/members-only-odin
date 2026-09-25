const pg = require('pg');
const crypto = require('node:crypto');

console.log(process.env.PASSWORD_TWO, typeof process.env.PASSWORD_TWO);

const saltOne = crypto.randomBytes(32).toString('hex');
const hashOne = crypto.pbkdf2Sync(process.env.PASSWORD_ONE, saltOne, 10000, 64, 'sha512').toString('hex');

const saltTwo = crypto.randomBytes(32).toString('hex');
const hashTwo = crypto.pbkdf2Sync(process.env.PASSWORD_TWO, saltTwo, 10000, 64, 'sha512').toString('hex');

const SQL = `
    CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        firstname VARCHAR (255) NOT NULL,
        lastname VARCHAR (255) NOT NULL,
        username VARCHAR (255) NOT NULL UNIQUE,
        hashedpassword VARCHAR (255) NOT NULL,
        salt VARCHAR (255) NOT NULL
    );

    INSERT INTO users (firstname, lastname, username, hashedpassword, salt)
        VALUES
            ('John', 'Doe', 'JohnnyD', '${hashOne}', '${saltOne}'),
            ('Joao', 'Pereira', 'Jper', '${hashTwo}', '${hashTwo}');
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