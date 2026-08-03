# JWT Authentication and Role-Based Access Control (RBAC)

## Experiment Title
JWT Authentication and Role-Based Access Control

## Aim
To implement authentication using JSON Web Tokens (JWT) and authorization using
user roles (Role-Based Access Control), demonstrated through a small Node.js +
Express REST API.

## Overview
This project is a self-contained backend that lets you:
1. Log in with a username/password and receive a JWT.
2. Verify that JWT to confirm the logged-in user's identity.
3. Access a small "posts" API where each action (view/create/edit/delete) is
   restricted based on the logged-in user's role.

No database is required — user and post data live in JSON files under `data/`.

## Tech Stack
- Node.js + Express.js
- `jsonwebtoken` for signing/verifying JWTs
- `bcryptjs` for password hashing
- `dotenv` for environment configuration
- Plain JSON files as a dummy dataset

## Roles
- **ADMIN**
- **EDITOR**
- **VIEWER**

## Permission Table

| Operation    | ADMIN | EDITOR | VIEWER |
| ------------ | ----- | ------ | ------ |
| Login        | Yes   | Yes    | Yes    |
| Verify Token | Yes   | Yes    | Yes    |
| View Posts   | Yes   | Yes    | Yes    |
| Create Post  | Yes   | No     | No     |
| Edit Post    | Yes   | Yes    | No     |
| Delete Post  | Yes   | No     | No     |

## Project Structure
```
jwt-rbac-project/
│
├── data/
│   ├── users.json          # 24 dummy users (passwords bcrypt-hashed)
│   └── posts.json          # dummy posts dataset
│
├── middleware/
│   ├── authMiddleware.js    # JWT authentication only
│   └── roleMiddleware.js    # role-based authorization only
│
├── routes/
│   ├── authRoutes.js
│   └── postRoutes.js
│
├── controllers/
│   ├── authController.js
│   └── postController.js
│
├── utils/
│   └── generateToken.js
│
├── scripts/
│   └── generateUsers.js     # optional: regenerate data/users.json
│
├── .env.example
├── .gitignore
├── package.json
├── server.js
├── README.md
└── TEST_CREDENTIALS.md
```

## Installation

```bash
npm install
```

## Environment Setup

Copy `.env.example` to `.env`:

**macOS / Linux:**
```bash
cp .env.example .env
```

**Windows (PowerShell):**
```powershell
copy .env.example .env
```

Then open `.env` and set values, e.g.:

```
PORT=3000
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=1h
```

> Replace `your_secret_key` with any long random string for this local demo.
> Never commit your real `.env` file — it's already in `.gitignore`.

## Run

```bash
npm start
```

Or, for auto-restart on file changes during development:

```bash
npm run dev
```

You should see:
```
Server running on http://localhost:3000
```

## Test Credentials

See [`TEST_CREDENTIALS.md`](./TEST_CREDENTIALS.md) for the full list of 24
dummy users. Quick reference:

| Role   | Username | Password    |
| ------ | -------- | ----------- |
| ADMIN  | admin1   | Admin@123   |
| EDITOR | editor1  | Editor@123  |
| VIEWER | viewer1  | Viewer@123  |

---

## Testing from the Terminal

Below are commands for both **bash/macOS/Linux `curl`** and **Windows
PowerShell (`curl.exe`)**. PowerShell's built-in `curl` is an alias for
`Invoke-WebRequest`, which does not behave like real curl, so use `curl.exe`
explicitly and use PowerShell's `` ` `` line continuation and escaped quotes
as shown.

### 1. Login as Admin

**bash:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin1","password":"Admin@123"}'
```

**PowerShell:**
```powershell
curl.exe -X POST http://localhost:3000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"username\":\"admin1\",\"password\":\"Admin@123\"}'
```

Expected response:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOi...",
  "user": { "id": 1, "username": "admin1", "role": "ADMIN" }
}
```

Copy the `token` value from the response — you'll use it as `ADMIN_TOKEN`
below.

### 2. Verify the Admin token

**bash:**
```bash
curl http://localhost:3000/api/auth/verify \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

**PowerShell:**
```powershell
curl.exe http://localhost:3000/api/auth/verify `
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### 3. Admin views posts

**bash:**
```bash
curl http://localhost:3000/api/posts \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

**PowerShell:**
```powershell
curl.exe http://localhost:3000/api/posts `
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### 4. Admin creates a post

**bash:**
```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"New Post","content":"Created by Admin"}'
```

**PowerShell:**
```powershell
curl.exe -X POST http://localhost:3000/api/posts `
  -H "Authorization: Bearer ADMIN_TOKEN" `
  -H "Content-Type: application/json" `
  -d '{\"title\":\"New Post\",\"content\":\"Created by Admin\"}'
```

Expected: `201 Created`.

### 5. Admin edits a post

**bash:**
```bash
curl -X PUT http://localhost:3000/api/posts/1 \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Post","content":"Edited by Admin"}'
```

**PowerShell:**
```powershell
curl.exe -X PUT http://localhost:3000/api/posts/1 `
  -H "Authorization: Bearer ADMIN_TOKEN" `
  -H "Content-Type: application/json" `
  -d '{\"title\":\"Updated Post\",\"content\":\"Edited by Admin\"}'
```

### 6. Admin deletes a post

**bash:**
```bash
curl -X DELETE http://localhost:3000/api/posts/2 \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

**PowerShell:**
```powershell
curl.exe -X DELETE http://localhost:3000/api/posts/2 `
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### 7. Login as Editor

**bash:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"editor1","password":"Editor@123"}'
```

**PowerShell:**
```powershell
curl.exe -X POST http://localhost:3000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"username\":\"editor1\",\"password\":\"Editor@123\"}'
```

Copy the token as `EDITOR_TOKEN`.

### 8. Editor views posts

**bash:**
```bash
curl http://localhost:3000/api/posts \
  -H "Authorization: Bearer EDITOR_TOKEN"
```

**PowerShell:**
```powershell
curl.exe http://localhost:3000/api/posts `
  -H "Authorization: Bearer EDITOR_TOKEN"
```

### 9. Editor edits a post (allowed)

**bash:**
```bash
curl -X PUT http://localhost:3000/api/posts/1 \
  -H "Authorization: Bearer EDITOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Post","content":"Edited by Editor"}'
```

**PowerShell:**
```powershell
curl.exe -X PUT http://localhost:3000/api/posts/1 `
  -H "Authorization: Bearer EDITOR_TOKEN" `
  -H "Content-Type: application/json" `
  -d '{\"title\":\"Updated Post\",\"content\":\"Edited by Editor\"}'
```

Expected: `200 OK`.

### 10. Editor attempts to create a post (should FAIL — 403)

**bash:**
```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Authorization: Bearer EDITOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Editor Post","content":"Should not be allowed"}'
```

**PowerShell:**
```powershell
curl.exe -X POST http://localhost:3000/api/posts `
  -H "Authorization: Bearer EDITOR_TOKEN" `
  -H "Content-Type: application/json" `
  -d '{\"title\":\"Editor Post\",\"content\":\"Should not be allowed\"}'
```

Expected: `403 Forbidden`.

### 11. Editor attempts to delete a post (should FAIL — 403)

**bash:**
```bash
curl -X DELETE http://localhost:3000/api/posts/1 \
  -H "Authorization: Bearer EDITOR_TOKEN"
```

**PowerShell:**
```powershell
curl.exe -X DELETE http://localhost:3000/api/posts/1 `
  -H "Authorization: Bearer EDITOR_TOKEN"
```

Expected: `403 Forbidden`.

### 12. Login as Viewer

**bash:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"viewer1","password":"Viewer@123"}'
```

**PowerShell:**
```powershell
curl.exe -X POST http://localhost:3000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"username\":\"viewer1\",\"password\":\"Viewer@123\"}'
```

Copy the token as `VIEWER_TOKEN`.

### 13. Viewer views posts (allowed)

**bash:**
```bash
curl http://localhost:3000/api/posts \
  -H "Authorization: Bearer VIEWER_TOKEN"
```

**PowerShell:**
```powershell
curl.exe http://localhost:3000/api/posts `
  -H "Authorization: Bearer VIEWER_TOKEN"
```

### 14. Viewer attempts to edit a post (should FAIL — 403)

**bash:**
```bash
curl -X PUT http://localhost:3000/api/posts/1 \
  -H "Authorization: Bearer VIEWER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Viewer Edit","content":"Should not be allowed"}'
```

**PowerShell:**
```powershell
curl.exe -X PUT http://localhost:3000/api/posts/1 `
  -H "Authorization: Bearer VIEWER_TOKEN" `
  -H "Content-Type: application/json" `
  -d '{\"title\":\"Viewer Edit\",\"content\":\"Should not be allowed\"}'
```

Expected: `403 Forbidden`.

### 15. Viewer attempts to create/delete a post (should FAIL — 403)

**bash:**
```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Authorization: Bearer VIEWER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Viewer Post","content":"Should not be allowed"}'

curl -X DELETE http://localhost:3000/api/posts/1 \
  -H "Authorization: Bearer VIEWER_TOKEN"
```

**PowerShell:**
```powershell
curl.exe -X POST http://localhost:3000/api/posts `
  -H "Authorization: Bearer VIEWER_TOKEN" `
  -H "Content-Type: application/json" `
  -d '{\"title\":\"Viewer Post\",\"content\":\"Should not be allowed\"}'

curl.exe -X DELETE http://localhost:3000/api/posts/1 `
  -H "Authorization: Bearer VIEWER_TOKEN"
```

Expected: `403 Forbidden` for both.

### 16. Missing JWT (should FAIL — 401)

**bash:**
```bash
curl http://localhost:3000/api/posts
```

**PowerShell:**
```powershell
curl.exe http://localhost:3000/api/posts
```

Expected: `401 Unauthorized` — "No token provided."

### 17. Invalid JWT (should FAIL — 401)

**bash:**
```bash
curl http://localhost:3000/api/posts \
  -H "Authorization: Bearer this.is.not.a.valid.token"
```

**PowerShell:**
```powershell
curl.exe http://localhost:3000/api/posts `
  -H "Authorization: Bearer this.is.not.a.valid.token"
```

Expected: `401 Unauthorized` — "Invalid token."

### 18. Wrong password (should FAIL — 401)

**bash:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin1","password":"WrongPassword"}'
```

**PowerShell:**
```powershell
curl.exe -X POST http://localhost:3000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"username\":\"admin1\",\"password\":\"WrongPassword\"}'
```

Expected: `401 Unauthorized` — "Invalid username or password."

---

## Full Demonstration Sequence (for viva/practical)

1. Start the server (`npm start`).
2. Login as Admin → step 1 above.
3. Receive JWT in the response.
4. Verify Admin JWT → step 2.
5. Admin views posts → step 3.
6. Admin creates a post → step 4.
7. Admin edits a post → step 5.
8. Admin deletes a post → step 6.
9. Login as Editor → step 7.
10. Editor views posts → step 8.
11. Editor edits a post (allowed) → step 9.
12. Editor cannot create/delete → steps 10–11 (403 Forbidden).
13. Login as Viewer → step 12.
14. Viewer views posts → step 13.
15. Viewer cannot create/edit/delete → steps 14–15 (403 Forbidden).
16. Missing JWT → step 16 (401 Unauthorized).
17. Invalid JWT → step 17 (401 Unauthorized).

## HTTP Status Codes Used

| Code | Meaning                             |
| ---- | ------------------------------------ |
| 200  | Successful request                   |
| 201  | Resource created                     |
| 400  | Bad request (missing/invalid input)  |
| 401  | Authentication failure               |
| 403  | Authenticated but not authorized     |
| 404  | Resource not found                   |
| 500  | Server error                         |

## How Authentication + Authorization Fit Together

```
Login
  ↓
Credentials verified (bcrypt.compare against hashed password)
  ↓
JWT generated (contains userId, username, role + expiry)
  ↓
JWT returned to client
  ↓
Client sends JWT in Authorization: Bearer <token> header
  ↓
authMiddleware.js verifies the JWT (signature + expiry)
  ↓
roleMiddleware.js checks the user's role against the route's allowed roles
  ↓
Request allowed (controller runs) or rejected (401 / 403)
```

- **ADMIN** → Create + Read + Update + Delete
- **EDITOR** → Read + Update
- **VIEWER** → Read only

## Security Notes
- Passwords are hashed with bcrypt (`bcryptjs`) — plain-text passwords are
  never stored in `data/users.json`.
- The JWT secret lives only in `.env`, which is git-ignored.
- API responses never return the stored password hash.
- Authentication (`authMiddleware.js`) and authorization
  (`roleMiddleware.js`) are deliberately kept in separate files/concerns.

## Uploading to GitHub

```bash
git init
git add .
git commit -m "Add JWT authentication and role based access control"
git branch -M main
git remote add origin <YOUR_GITHUB_REPOSITORY_URL>
git push -u origin main
```

`node_modules/` and `.env` are already excluded via `.gitignore`, so they
won't be pushed.
