/**
 * scripts/generateUsers.js
 * -------------------------
 * Regenerates data/users.json with 24 dummy users (6 ADMIN, 8 EDITOR,
 * 10 VIEWER), hashing each password with bcryptjs.
 *
 * The project already ships with a pre-generated data/users.json, so
 * you do NOT need to run this script to use the project. It's provided
 * so you can:
 *   - regenerate the dataset if you ever edit it
 *   - see exactly how the passwords in TEST_CREDENTIALS.md map to hashes
 *
 * Usage:
 *   npm run generate-users
 */
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");

const ROLES = [
  { role: "ADMIN", count: 6, label: "Admin", startPwd: 123 },
  { role: "EDITOR", count: 8, label: "Editor", startPwd: 123 },
  { role: "VIEWER", count: 10, label: "Viewer", startPwd: 123 },
];

const NAME_POOL = [
  "One", "Two", "Three", "Four", "Five",
  "Six", "Seven", "Eight", "Nine", "Ten",
];

const SALT_ROUNDS = 10;

function generateUsers() {
  const users = [];
  const testCredentials = [];
  let id = 1;

  ROLES.forEach(({ role, count, label, startPwd }) => {
    for (let i = 1; i <= count; i++) {
      const username = `${label.toLowerCase()}${i}`;
      const name = `${label} ${NAME_POOL[i - 1]}`;
      const plainPassword = `${label}@${startPwd + (i - 1)}`;
      const email = `${username}@example.com`;
      const hashedPassword = bcrypt.hashSync(plainPassword, SALT_ROUNDS);

      users.push({
        id,
        name,
        username,
        email,
        password: hashedPassword,
        role,
      });

      testCredentials.push({ id, name, username, password: plainPassword, role });
      id++;
    }
  });

  return { users, testCredentials };
}

function main() {
  const { users, testCredentials } = generateUsers();

  const usersPath = path.join(__dirname, "..", "data", "users.json");
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2), "utf-8");

  console.log(`Generated ${users.length} users -> ${usersPath}`);
  console.log("\nPlain-text test credentials (also see TEST_CREDENTIALS.md):\n");
  testCredentials.forEach((u) => {
    console.log(`  [${u.role}] ${u.username} / ${u.password}`);
  });
}

main();
