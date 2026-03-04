# Spark Project Refresh (MongoDB + Express)

Yes — this app can use **MongoDB** instead of myjson or flat local JSON at runtime.

## What changed

- Added Mongo-backed API endpoints for login/profile/recipes.
- Added password hashing (`bcryptjs`) support.
- Added real server-side sessions (`express-session` + `connect-mongo`).
- Added a seed script to import existing JSON data into MongoDB.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set environment variables (example):
   ```bash
   export MONGO_URI='mongodb://127.0.0.1:27017'
   export DB_NAME='spark_app'
   export SESSION_SECRET='replace-with-a-strong-secret'
   ```
3. Seed the database from your existing files:
   ```bash
   npm run seed
   ```
4. Start the app:
   ```bash
   npm start
   ```
5. Open:
   - `http://localhost:3000/Spark_Login.html`


## Node/npm upgrade help (Windows)

If you see:

```
'nvm' is not recognized as an internal or external command
```

that means the Linux/macOS `nvm` tool is not installed on your Windows machine (or not on PATH).

### Option A (recommended on Windows): install **nvm-windows**

1. Download and install **nvm-windows** from the releases page:  
   <https://github.com/coreybutler/nvm-windows/releases>
2. Close and re-open Command Prompt/PowerShell.
3. Verify `nvm` works:
   ```powershell
   nvm version
   ```
4. Install and use latest Node:
   ```powershell
   nvm install latest
   nvm use latest
   node -v
   npm -v
   ```

### Option B: install latest Node directly

1. Download the latest installer from <https://nodejs.org>.
2. Run the installer, re-open terminal, then verify:
   ```powershell
   node -v
   npm -v
   ```

### PATH troubleshooting (if `nvm` still not found)

- Confirm `NVM_HOME` and `NVM_SYMLINK` environment variables exist (set by nvm-windows installer).
- Confirm both paths are in your PATH.
- Restart terminal (or reboot) after PATH changes.

## API endpoints

- `POST /api/login`
- `POST /api/logout`
- `GET /api/me` (session required)
- `GET /api/recipes` (session required)

## Security notes

- Use a strong `SESSION_SECRET` in production.
- Use HTTPS in production so session cookies stay protected.
- Move MongoDB credentials to environment/config management.


## Verification / testing

Yes — it is absolutely possible to introduce test files. This repo now includes `tests/verification.test.mjs`.

### Quick checks (no DB/server required)
```bash
npm test
```
This validates JSON seed file shape and will skip API smoke tests unless `BASE_URL` is set.

### Full API smoke verification
1. Ensure MongoDB is running.
2. Seed database:
```bash
npm run seed
```
3. Start server:
```bash
npm start
```
4. In another terminal, run smoke tests against the live API:
```bash
BASE_URL=http://127.0.0.1:3000 npm test
```

What this verifies:
- unauthenticated `/api/me` returns `401`
- login works with seeded credentials (`user1` / `a123`)
- authenticated `/api/me` and `/api/recipes` return `200`


### CI automation
A GitHub Actions workflow is included at `.github/workflows/ci.yml` and runs `npm install` + `npm test` on pushes and pull requests.
