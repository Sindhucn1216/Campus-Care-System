import { randomUUID } from 'node:crypto';

export function prefixedId(prefix) {
  return `${prefix}-${randomUUID()}`;
}

export function toIso(value) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

export function capitalizeRole(role) {
  if (!role) return null;
  return role.charAt(0).toUpperCase() + role.slice(1);
}
