// Seed akun pengembangan Wiki UMK.
//
// Hash memakai `better-auth/crypto` — fungsi yang sama dengan
// `ctx.context.password` di src/lib/auth.ts — supaya hash yang tersimpan
// identik dengan akun yang dibuat lewat POST /api/auth/sign-up/email.
import "dotenv/config";
import { Client } from "pg";
import { generateRandomString, hashPassword, verifyPassword } from "better-auth/crypto";

const USERS = [
  { name: "Admin", email: "admin@dev.com", password: "admin123", role: "ADMIN" },
  { name: "Mahasiswa", email: "student@dev.com", password: "student123", role: "USER" },
];

const client = new Client({ connectionString: process.env.DATABASE_URL });

async function ensureUser({ name, email, password, role }) {
  const found = await client.query('SELECT id FROM "user" WHERE email = $1', [email]);
  let userId;
  if (found.rows.length) {
    userId = found.rows[0].id;
    console.log(`user  ${email} sudah ada`);
  } else {
    userId = generateRandomString(32);
    await client.query(
      'INSERT INTO "user" (id, name, email, "updatedAt") VALUES ($1, $2, $3, now())',
      [userId, name, email],
    );
    console.log(`user  ${email} dibuat`);
  }

  // Samakan role (idempoten) — akun lama yang belum punya role ikut terselaraskan.
  await client.query('UPDATE "user" SET role = $1 WHERE id = $2 AND role <> $1', [role, userId]);

  const acc = await client.query(
    'SELECT id, password FROM "account" WHERE "userId" = $1 AND "providerId" = $2',
    [userId, "credential"],
  );
  const stored = acc.rows[0]?.password;
  if (stored && (await verifyPassword({ hash: stored, password }))) {
    console.log("  pass  sudah cocok");
    return;
  }
  const hash = await hashPassword(password);
  if (stored) {
    await client.query('UPDATE "account" SET password = $1, "updatedAt" = now() WHERE id = $2', [
      hash,
      acc.rows[0].id,
    ]);
    console.log("  pass  diselaraskan");
  } else {
    await client.query(
      'INSERT INTO "account" (id, "accountId", "providerId", "userId", password, "updatedAt") VALUES ($1, $2, $3, $4, $5, now())',
      [generateRandomString(32), userId, "credential", userId, hash],
    );
    console.log("  pass  dibuat");
  }
}

// Baca ulang dari database dan buktikan hash-nya benar-benar diterima
// verifikator Better Auth, bukan hanya hash yang baru saja kita hitung.
async function verifyStored() {
  const rows = await client.query(
    `SELECT u.email, a.password
       FROM "user" u
       JOIN "account" a ON a."userId" = u.id
      WHERE a."providerId" = 'credential'`,
  );
  let failed = 0;
  for (const row of rows.rows) {
    const expected = USERS.find((u) => u.email === row.email)?.password;
    let ok = false;
    if (expected && row.password) {
      try {
        ok = await verifyPassword({ hash: row.password, password: expected });
      } catch {
        ok = false;
      }
    }
    console.log(`cek   ${row.email}: ${ok ? "OK" : "GAGAL"}`);
    if (!ok) failed++;
  }
  return failed;
}

try {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL belum di-set di .env");
  await client.connect();
  for (const user of USERS) await ensureUser(user);
  const failed = await verifyStored();
  if (failed) {
    console.error(`${failed} akun tidak lolos verifikasi`);
    process.exitCode = 1;
  }
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  await client.end();
}
