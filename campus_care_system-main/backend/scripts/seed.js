import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mysql from 'mysql2/promise';
import { env } from '../src/config/env.js';
import { DEMO_PASSWORD, resetDatabase } from './seedLib.js';
import { pool } from '../src/config/db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function ensureSchema() {
  const admin = await mysql.createConnection({
    host: env.db.host,
    port: env.db.port,
    user: env.db.user,
    password: env.db.password,
    multipleStatements: true,
  });
  const schemaPath = path.resolve(__dirname, '../sql/schema.sql');
  const sql = fs.readFileSync(schemaPath, 'utf8');
  await admin.query(sql);
  await admin.end();
}

try {
  console.log('Creating database schema if needed...');
  await ensureSchema();
  console.log('Seeding demo records...');
  await resetDatabase();
  console.log('Seed complete.');
  console.log('Demo password for all seeded accounts:', DEMO_PASSWORD);
  console.log('  Student : aarav.sharma@student.campus.edu');
  console.log('  Student : pooja.hegde@student.campus.edu');
  console.log('  Faculty : meera.iyer@faculty.campus.edu');
  console.log('  IT Staff: venkatesh.rao@staff.campuscare.edu');
  console.log('  Elec    : karthik.m@staff.campuscare.edu');
  console.log('  Admin   : admin.grievance@campuscare.edu');
  await pool.end();
  process.exit(0);
} catch (err) {
  console.error('Seed failed:', err.message);
  console.error('\nWindows troubleshooting:');
  console.error('  1. Start MySQL:  Start-Service MySQL80');
  console.error('  2. Confirm backend/.env has the correct DB_USER and DB_PASSWORD');
  console.error('  3. Default XAMPP/WAMP root password is often empty');
  process.exit(1);
}
