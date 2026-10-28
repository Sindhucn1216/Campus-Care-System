import { pool } from '../config/db.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const list = asyncHandler(async (_req, res) => {
  const [rows] = await pool.query(
    'SELECT id, name, description, icon, default_department_id AS defaultDepartmentId FROM complaint_categories ORDER BY name'
  );
  res.json(rows);
});
