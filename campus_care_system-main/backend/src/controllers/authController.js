import bcrypt from 'bcryptjs';
import { pool } from '../config/db.js';
import { HttpError } from '../utils/httpError.js';
import { prefixedId } from '../utils/ids.js';
import { isEmail, normalizeEmail, requireString, trimToNull } from '../utils/sanitize.js';
import { PUBLIC_ROLES } from '../utils/status.js';
import { publicUser, signToken } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const SALT_ROUNDS = 10;

async function attachDeptName(user) {
  if (!user?.department_id) return user;
  const [rows] = await pool.query('SELECT name FROM departments WHERE id = ?', [user.department_id]);
  if (rows[0]) user.department_name = rows[0].name;
  return user;
}

export const register = asyncHandler(async (req, res) => {
  const name = requireString(req.body.name, 'Full name', { min: 2, max: 150 });
  const email = normalizeEmail(req.body.email);
  const password = req.body.password;
  const role = String(req.body.role || 'student').toLowerCase();
  const rollNo = trimToNull(req.body.rollNo)?.toUpperCase();
  const designation = trimToNull(req.body.designation);
  const academicDepartment = trimToNull(req.body.department);

  if (!isEmail(email)) {
    throw new HttpError(400, 'Please provide a valid campus email address.');
  }
  if (!password || String(password).length < 6) {
    throw new HttpError(400, 'Password must be at least 6 characters.');
  }
  if (role === 'admin') {
    throw new HttpError(403, 'Administrator accounts cannot be created through public registration.');
  }
  if (!PUBLIC_ROLES.includes(role)) {
    throw new HttpError(400, 'Invalid role. Register as student, faculty, or department staff.');
  }
  if (role === 'student' && !rollNo) {
    throw new HttpError(400, 'Student roll number is required.');
  }

  let departmentId = null;
  if (role === 'staff') {
    const requested = trimToNull(req.body.departmentId) || academicDepartment;
    if (!requested) {
      throw new HttpError(400, 'Staff accounts must select a resolution department.');
    }
    const [depts] = await pool.query(
      'SELECT id, name FROM departments WHERE (id = ? OR name = ?) AND active = 1 LIMIT 1',
      [requested, requested]
    );
    if (!depts[0]) throw new HttpError(400, 'Selected department is not available.');
    departmentId = depts[0].id;
  }

  const [existing] = await pool.query('SELECT id FROM users WHERE email = ? LIMIT 1', [email]);
  if (existing[0]) {
    throw new HttpError(409, 'An account with this email already exists.');
  }
  if (rollNo) {
    const [rollRows] = await pool.query('SELECT id FROM users WHERE roll_no = ? LIMIT 1', [rollNo]);
    if (rollRows[0]) {
      throw new HttpError(409, 'An account with this roll number already exists.');
    }
  }

  const passwordHash = await bcrypt.hash(String(password), SALT_ROUNDS);
  const id = prefixedId('usr');

  await pool.query(
    `INSERT INTO users (
      id, name, email, password_hash, role, roll_no, academic_department, department_id, designation, avatar
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      name,
      email,
      passwordHash,
      role,
      role === 'student' ? rollNo : null,
      role === 'staff' ? null : academicDepartment,
      departmentId,
      designation,
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    ]
  );

  const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
  const user = await attachDeptName(rows[0]);
  const token = signToken(user);

  res.status(201).json({
    message: 'User registered successfully',
    userId: id,
    token,
    user: publicUser(user),
  });
});

export const login = asyncHandler(async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const password = req.body.password;
  if (!email || !password) {
    throw new HttpError(400, 'Email and password are required.');
  }

  const [rows] = await pool.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
  const user = rows[0];
  if (!user) {
    throw new HttpError(401, 'Invalid email or password.');
  }
  const ok = await bcrypt.compare(String(password), user.password_hash);
  if (!ok) {
    throw new HttpError(401, 'Invalid email or password.');
  }

  await attachDeptName(user);
  const token = signToken(user);
  res.json({ token, user: publicUser(user) });
});

export const me = asyncHandler(async (req, res) => {
  const user = await attachDeptName({ ...req.user });
  if (user.department_id && !user.department_name) {
    const [rows] = await pool.query('SELECT name FROM departments WHERE id = ?', [user.department_id]);
    if (rows[0]) user.department_name = rows[0].name;
  }
  res.json({ user: publicUser(user) });
});

export const logout = asyncHandler(async (_req, res) => {
  res.json({ message: 'Signed out. Discard the client token.' });
});

export const updateMe = asyncHandler(async (req, res) => {
  const name = req.body.name ? requireString(req.body.name, 'Display name', { min: 2, max: 150 }) : req.user.name;
  const notifyEmail = req.body.notifyEmail === undefined ? req.user.notify_email : req.body.notifyEmail ? 1 : 0;
  const notifySms = req.body.notifySms === undefined ? req.user.notify_sms : req.body.notifySms ? 1 : 0;

  await pool.query(
    'UPDATE users SET name = ?, notify_email = ?, notify_sms = ? WHERE id = ?',
    [name, notifyEmail, notifySms, req.user.id]
  );
  const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
  const user = await attachDeptName(rows[0]);
  res.json({ user: publicUser(user) });
});
