import { asyncHandler } from '../utils/asyncHandler.js';
import { resetDatabase } from '../../scripts/seedLib.js';

export const resetDemo = asyncHandler(async (_req, res) => {
  await resetDatabase();
  res.json({ success: true, message: 'Demo data restored to the official seed set.' });
});
