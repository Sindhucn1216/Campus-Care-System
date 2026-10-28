import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { pool } from '../config/db.js';
import { HttpError } from '../utils/httpError.js';

const USER_FIELDS = `id, name, email, role, roll_no, academic_department, department_id, designation, avatar, notify_email, notify_sms`;

async function loadUser(userId) {
  const [rows] = await pool.query(
    `SELECT ${USER_FIELDS} FROM users WHERE id = ? LIMIT 1`,
    [userId]
  );
  return rows[0] || null;
}

export function signToken(user) {
  return jwt.sign(
    { sub: user.id, role: user.role },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );
}

export async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    if (!header.startsWith('Bearer ')) {
      throw new HttpError(401, 'Authentication required.');
    }
    const token = header.slice(7);
    let payload;
    try {
      payload = jwt.verify(token, env.jwtSecret);
    } catch {
      throw new HttpError(401, 'Invalid or expired session. Please sign in again.');
    }
    const user = await loadUser(payload.sub);
    if (!user) {
      throw new HttpError(401, 'Session is no longer valid. Please sign in again.');
    }
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

export async function optionalAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    if (!header.startsWith('Bearer ')) {
      req.user = null;
      return next();
    }
    const token = header.slice(7);
    try {
      const payload = jwt.verify(token, env.jwtSecret);
      req.user = await loadUser(payload.sub);
    } catch {
      req.user = null;
    }
    next();
  } catch (err) {
    next(err);
  }
}

export function requireRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new HttpError(401, 'Authentication required.'));
    }
    if (!roles.includes(req.user.role)) {
      return next(new HttpError(403, 'You do not have permission to perform this action.'));
    }
    next();
  };
}

export function publicUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    rollNo: user.roll_no || undefined,
    department: user.department_name || user.academic_department || undefined,
    departmentId: user.department_id || undefined,
    departmentName: user.department_name || undefined,
    designation: user.designation || undefined,
    avatar: user.avatar || undefined,
    notifyEmail: Boolean(user.notify_email),
    notifySms: Boolean(user.notify_sms),
  };
}
