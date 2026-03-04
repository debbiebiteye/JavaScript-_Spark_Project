const fs = require('fs/promises');
const path = require('path');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const ROOT = path.join(__dirname, '..');
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017';
const DB_NAME = process.env.DB_NAME || 'spark_app';
const SALT_ROUNDS = Number(process.env.BCRYPT_ROUNDS || 10);

async function readJson(fileName) {
    const data = await fs.readFile(path.join(ROOT, fileName), 'utf8');
    return JSON.parse(data);
}

async function seed() {
    const [usersRaw, recipesRaw] = await Promise.all([
        readJson('logAboutJSON.JSON'),
        readJson('recipeJSON.JSON'),
    ]);

    const users = await Promise.all(
        usersRaw.map(async (user) => ({
            username: user.username,
            info: user.info,
            passwordHash: await bcrypt.hash(user.password, SALT_ROUNDS),
        }))
    );

    const recipes = (recipesRaw.jsonRecipe || []).map((item) => ({
        name: item.name,
        recipe: item.recipe,
        image: item.image,
    }));

    const client = new MongoClient(MONGO_URI);
    await client.connect();
    const db = client.db(DB_NAME);

    await db.collection('users').deleteMany({});
    await db.collection('recipes').deleteMany({});
    if (users.length) {
        await db.collection('users').insertMany(users);
    }
    if (recipes.length) {
        await db.collection('recipes').insertMany(recipes);
    }

    await db.collection('users').createIndex({ username: 1 }, { unique: true });
    console.log(`Seeded ${users.length} users and ${recipes.length} recipes into ${DB_NAME}.`);
    await client.close();
}

seed().catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
});
