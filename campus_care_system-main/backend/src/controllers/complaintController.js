import path from 'node:path';
import fs from 'node:fs';
import { asyncHandler } from '../utils/asyncHandler.js';
import { HttpError } from '../utils/httpError.js';
import { requireString, trimToNull } from '../utils/sanitize.js';
import { PRIORITIES, REPORTER_ROLES } from '../utils/status.js';
import { saveDataUrl, isHttpUrl, uploadRoot } from '../middleware/upload.js';
import * as complaints from '../services/complaints.js';
import { resolveImageSrc } from '../services/complaintMapper.js';
import { canViewComplaint } from '../services/complaintAccess.js';
import { getRawByIdOrCode } from '../services/complaints.js';

function parseImage(body, file) {
  if (file) {
    return { imageFilename: file.filename, imageUrl: null };
  }
  const image = trimToNull(body.imageUrl);
  if (!image) return { imageFilename: null, imageUrl: null };
  if (image.startsWith('data:image/')) {
    return { imageFilename: saveDataUrl(image), imageUrl: null };
  }
  if (isHttpUrl(image)) {
    return { imageFilename: null, imageUrl: image };
  }
  throw new HttpError(400, 'Image must be a JPEG/PNG/WebP upload or an http(s) URL.');
}

export const list = asyncHandler(async (req, res) => {
  const items = await complaints.listComplaints(req.user, {
    status: req.query.status,
    category: req.query.category,
    priority: req.query.priority,
    departmentId: req.query.departmentId,
    search: req.query.search,
    sort: req.query.sort,
  });
  res.json(items);
});

export const getById = asyncHandler(async (req, res) => {
  const item = await complaints.getVisibleComplaint(req.user, req.params.id);
  res.json(item);
});

export const track = asyncHandler(async (req, res) => {
  const code = requireString(req.params.code, 'Tracking code', { min: 3, max: 32 });
  const row = await getRawByIdOrCode(code);
  if (!row) {
    throw new HttpError(404, 'No grievance found for that tracking ID.');
  }
  const publicView = !req.user || !canViewComplaint(req.user, row);
  const item = await complaints.hydrate(row, { publicView: true });
  if (!publicView) {
    res.json(await complaints.hydrate(row, { publicView: false }));
    return;
  }
  res.json(item);
});

export const create = asyncHandler(async (req, res) => {
  if (!REPORTER_ROLES.includes(req.user.role)) {
    throw new HttpError(403, 'Only students and faculty can submit complaints.');
  }

  const title = requireString(req.body.title, 'Title', { min: 8, max: 255 });
  const description = requireString(req.body.description, 'Description', { min: 20, max: 4000 });
  const location = requireString(req.body.location, 'Location', { min: 2, max: 255 });
  const specificLocation = trimToNull(req.body.specificLocation);
  const categoryId = trimToNull(req.body.categoryId);
  const categoryName = trimToNull(req.body.categoryName);
  if (!categoryId && !categoryName) {
    throw new HttpError(400, 'Category is required.');
  }
  const priority = trimToNull(req.body.priority) || 'Medium';
  if (!PRIORITIES.includes(priority)) {
    throw new HttpError(400, 'Invalid priority value.');
  }

  const image = parseImage(req.body, req.file);
  const created = await complaints.createComplaint(req.user, {
    title,
    description,
    location,
    specificLocation,
    categoryId,
    categoryName,
    priority,
    ...image,
  });
  const item = await complaints.getVisibleComplaint(req.user, created.id);
  res.status(201).json({
    ...item,
    message: 'Complaint registered successfully',
  });
});

export const patchStatus = asyncHandler(async (req, res) => {
  const id = await complaints.updateStatus(req.user, req.params.id, {
    status: req.body.status,
    note: trimToNull(req.body.note),
    resolutionNotes: trimToNull(req.body.resolutionNotes),
  });
  res.json(await complaints.getVisibleComplaint(req.user, id));
});

export const patchAssign = asyncHandler(async (req, res) => {
  const departmentId = requireString(req.body.departmentId, 'Department', { min: 1, max: 64 });
  const result = await complaints.assignComplaint(req.user, req.params.id, {
    departmentId,
    staffId: trimToNull(req.body.staffId),
    note: trimToNull(req.body.note),
  });
  const item = await complaints.getVisibleComplaint(req.user, result.id);
  res.json(item);
});

export const patchPriority = asyncHandler(async (req, res) => {
  const id = await complaints.updatePriority(req.user, req.params.id, req.body.priority);
  res.json(await complaints.getVisibleComplaint(req.user, id));
});

export const postFeedback = asyncHandler(async (req, res) => {
  const id = await complaints.submitFeedback(req.user, req.params.id, {
    rating: req.body.rating,
    comments: trimToNull(req.body.comments),
  });
  const item = await complaints.getVisibleComplaint(req.user, id);
  res.status(201).json(item);
});

export const getImage = asyncHandler(async (req, res) => {
  const row = await getRawByIdOrCode(req.params.id);
  if (!row) throw new HttpError(404, 'Complaint not found.');
  if (!canViewComplaint(req.user, row) && !row.image_url) {
    // Local private files require access. External URLs are not served here.
    throw new HttpError(404, 'Complaint not found.');
  }
  const src = resolveImageSrc(row);
  if (!src) throw new HttpError(404, 'No image attached.');
  if (src.type === 'url') {
    res.redirect(src.url);
    return;
  }
  const filePath = path.join(uploadRoot, src.filename);
  if (!fs.existsSync(filePath)) throw new HttpError(404, 'Image file is missing.');
  if (!canViewComplaint(req.user, row)) {
    throw new HttpError(404, 'Complaint not found.');
  }
  res.sendFile(filePath);
});
