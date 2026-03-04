const express = require('express');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017';
const DB_NAME = process.env.DB_NAME || 'spark_app';
const SESSION_SECRET = process.env.SESSION_SECRET || 'change-me-in-production';

app.use(express.json());
app.use(
    session({
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: MONGO_URI,
            dbName: DB_NAME,
            collectionName: 'sessions',
            ttl: 60 * 60 * 8,
        }),
        cookie: {
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 8,
        },
    })
);

app.use(express.static(ROOT));

let db;

function requireAuth(req, res, next) {
    if (!req.session.userId) {
        return res.status(401).json({ message: 'Please log in first.' });
    }

    return next();
}

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body || {};

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    try {
        const user = await db.collection('users').findOne({ username });

        if (!user) {
            return res.status(401).json({ message: 'Wrong username or password.' });
        }

        const passwordMatches = await bcrypt.compare(password, user.passwordHash);
        if (!passwordMatches) {
            return res.status(401).json({ message: 'Wrong username or password.' });
        }

        req.session.userId = String(user._id);
        req.session.username = user.username;

        return res.json({ username: user.username });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Login service is unavailable.' });
    }
});

app.post('/api/logout', (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Unable to log out right now.' });
        }

        res.clearCookie('connect.sid');
        return res.json({ message: 'Logged out.' });
    });
});

app.get('/api/me', requireAuth, async (req, res) => {
    try {
        const user = await db.collection('users').findOne(
            { username: req.session.username },
            { projection: { username: 1, info: 1 } }
        );

        if (!user) {
            return res.status(404).json({ message: 'Profile not found.' });
        }

        return res.json({ username: user.username, info: user.info });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Profile service is unavailable.' });
    }
});

app.get('/api/recipes', requireAuth, async (req, res) => {
    try {
        const recipes = await db
            .collection('recipes')
            .find({}, { projection: { _id: 0, name: 1, recipe: 1, image: 1 } })
            .toArray();

        return res.json(recipes);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Recipe service is unavailable.' });
    }
});

async function startServer() {
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    db = client.db(DB_NAME);

    app.listen(PORT, () => {
        console.log(`Spark app running at http://localhost:${PORT}`);
    });
}

startServer().catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
});
