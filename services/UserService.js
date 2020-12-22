const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const {open} = require('sqlite');

const dbFilePath = path.join(path.dirname(__dirname), 'database', 'database.db');

async function getAllUsersFromDB(db) {
    return await db.all('SELECT * FROM users', [], (err) => {
        if (err) {
            console.error('Error', err.message);
            return [];
        }
    });
}

async function getUserByEmail(db, email) {
    const user = await db.get(`SELECT * FROM users WHERE email = ?`, [email], (err) => {
        if (err) {
            console.error('Error', err.message);
            return [];
        }
    });
    return user;
}

async function addDBUser(db, user) {
    const candidate = await getUserByEmail(db, user.email);
    if (!candidate) {
        const sql = 'INSERT INTO users (email, password) VALUES (?, ?)';
        return await db.run(sql, [user.email, user.password], (err) => {
            if (err) {
                console.error('Error', err.message);
                return [];
            }
        });
    }

}

async function openDBConnection(dbFilePath) {
    return await open({
        filename: dbFilePath,
        driver: sqlite3.Database
    });
}

function closeDBConnection(db) {
    db.close((err) => {
        if (err) {
            return console.error(err.message);
        }
    });
}

exports.UserService = {

    getAllUsers: async () => {
        const db = await openDBConnection(dbFilePath);
        const users = await getAllUsersFromDB(db);
        closeDBConnection(db);
        return users;
    },

    findByEmail: async (email) => {
        const db = await openDBConnection(dbFilePath);
        const user = await getUserByEmail(db, email);
        closeDBConnection(db);
        return user;
    },

    addUser: async (user) => {
        const db = await openDBConnection(dbFilePath);
        const result = await addDBUser(db, user);
        closeDBConnection(db);
        return result;
    }
}
