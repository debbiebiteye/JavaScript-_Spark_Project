import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const BASE_URL = process.env.BASE_URL;

async function readJson(filePath) {
  const raw = await fs.readFile(filePath, 'utf8');
  return JSON.parse(raw);
}

test('local JSON seed files have expected shape', async () => {
  const users = await readJson('logAboutJSON.JSON');
  const recipes = await readJson('recipeJSON.JSON');

  assert.ok(Array.isArray(users), 'users JSON should be an array');
  assert.ok(users.length > 0, 'users JSON should not be empty');
  assert.ok(users.every((u) => u.username && u.password && u.info), 'each user should have username/password/info');

  assert.ok(Array.isArray(recipes.jsonRecipe), 'recipeJSON should contain jsonRecipe array');
  assert.ok(recipes.jsonRecipe.length > 0, 'recipe list should not be empty');
  assert.ok(recipes.jsonRecipe.every((r) => r.name && r.recipe), 'each recipe should have name and recipe');
});

test('API smoke test (optional, requires running server and seeded DB)', { timeout: 20_000 }, async (t) => {
  if (!BASE_URL) {
    t.skip('Set BASE_URL (example: http://127.0.0.1:3000) to run API smoke tests.');
    return;
  }

  const meUnauthed = await fetch(`${BASE_URL}/api/me`);
  assert.equal(meUnauthed.status, 401);

  const loginRes = await fetch(`${BASE_URL}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'user1', password: 'a123' })
  });

  assert.equal(loginRes.status, 200, 'login should succeed for seeded credentials');
  const setCookie = loginRes.headers.get('set-cookie');
  assert.ok(setCookie, 'login should return session cookie');
  const cookie = setCookie.split(';')[0];

  const meAuthed = await fetch(`${BASE_URL}/api/me`, {
    headers: { Cookie: cookie }
  });
  assert.equal(meAuthed.status, 200, '/api/me should be available after login');

  const recipesRes = await fetch(`${BASE_URL}/api/recipes`, {
    headers: { Cookie: cookie }
  });
  assert.equal(recipesRes.status, 200, '/api/recipes should be available after login');

  const recipes = await recipesRes.json();
  assert.ok(Array.isArray(recipes));
  assert.ok(recipes.length > 0);
});
