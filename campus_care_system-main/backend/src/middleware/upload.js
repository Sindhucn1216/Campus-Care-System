import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import multer from 'multer';
import { randomUUID } from 'node:crypto';
import { env } from '../config/env.js';
import { HttpError } from '../utils/httpError.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const uploadRoot = path.resolve(__dirname, '../..', env.uploadDir);

if (!fs.existsSync(uploadRoot)) {
  fs.mkdirSync(uploadRoot, { recursive: true });
}

const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp']);
const EXT = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp' };

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadRoot),
  filename: (_req, file, cb) => {
    const ext = EXT[file.mimetype] || '.bin';
    cb(null, `${randomUUID()}${ext}`);
  },
});

export const uploadPhoto = multer({
  storage,
  limits: { fileSize: env.maxUploadMb * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED.has(file.mimetype)) {
      cb(new HttpError(400, 'Please upload a JPEG, PNG, or WebP image.'));
      return;
    }
    cb(null, true);
  },
}).single('photo');

export function saveDataUrl(dataUrl) {
  const match = String(dataUrl).match(/^data:(image\/(?:jpeg|png|webp));base64,(.+)$/i);
  if (!match) {
    throw new HttpError(400, 'Invalid image data. Upload a JPEG, PNG, or WebP file.');
  }
  const mime = match[1].toLowerCase();
  const buffer = Buffer.from(match[2], 'base64');
  if (buffer.length > env.maxUploadMb * 1024 * 1024) {
    throw new HttpError(400, `Image size exceeds ${env.maxUploadMb}MB limit.`);
  }
  const filename = `${randomUUID()}${EXT[mime]}`;
  fs.writeFileSync(path.join(uploadRoot, filename), buffer);
  return filename;
}

export function isHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}
