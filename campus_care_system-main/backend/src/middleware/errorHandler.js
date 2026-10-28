import { env } from '../config/env.js';

export function notFoundHandler(req, res) {
  res.status(404).json({ message: 'Endpoint not found.' });
}

export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    next(err);
    return;
  }

  if (err.code === 'LIMIT_FILE_SIZE') {
    res.status(400).json({ message: 'Image size exceeds the 5MB limit.' });
    return;
  }

  const status = err.status || err.statusCode || 500;
  const message =
    status >= 500 && env.isProd
      ? 'An unexpected server error occurred.'
      : err.message || 'Request failed.';

  const payload = { message };
  if (err.details) payload.errors = err.details;
  res.status(status).json(payload);
}
