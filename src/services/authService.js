// src/services/authService.js

// temporary “database”
const USERS = [
  { email: "admin@komplex.com", password: "admin123", role: "ADMIN" },
  { email: "staff@komplex.com", password: "staff123", role: "STAFF" },
];

export function validateCredentials(email, password) {
  const e = (email ?? "").trim().toLowerCase();
  const p = password ?? "";

  if (!e || !p) {
    return { ok: false, message: "Please enter your email and password." };
  }

  const user = USERS.find(
    (u) => u.email.toLowerCase() === e && u.password === p
  );

  if (!user) {
    return { ok: false, message: "Invalid email or password." };
  }

  return { ok: true, user };
}